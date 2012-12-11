/*
	Copyright (c) 2010, Micah N Gorrell
	All rights reserved.

	THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR IMPLIED
	WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
	MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
	EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
	PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
	OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
	WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
	OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
	ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// TODO	With the cool popup to search for recent domains it doesn't make much
//		sense to have a pain on the left for tablets... So how do we fill the
//		screen?
//
//		Perhaps just center it and call it good?

// TODO	Package as a webOS app

// TODO	Implement the dashboard for webOS phones and tablets

enyo.kind({

name:											"net.minego.pwdhash.main",

domains: [
	"google.com", "amazon.com", "twitter.com", "foo.com", "bar.com", "minego.net"
],

published: {
	value:										''
},

fit:											true,
classes:										"pwdhash",

components: [
	{
		kind:									onyx.Groupbox,
		classes:								"inputgroup",

		components: [
			{
				kind:							"extras.AutoCompleteInputDecorator",
				name:							"recentdomains",

				oninput:						"filterdomains",
				onfocus:						"recentdomains",
				onValueSelected:				"selectdomain",
				onkeydown:						"nextfieldonenter",
				nextfield:						"password",

				components: [{
					name:						"domain",
					kind:						onyx.Input,
					selectOnFocus:				true,
					type:						"url",
					ontap:						"recentdomains",

					placeholder:				$L("Domain or URL")
				}]
			},
			{
				kind:							onyx.InputDecorator,
				components: [{
					name:						"password",
					kind:						onyx.Input,
					type:						"password",
					selectOnFocus:				true,

					placeholder:				$L("Master Password"),
					oninput:					"generate",
					onkeydown:					"nextfieldonenter",
					nextfield:					"generated"
				}]
			}
		]
	},
	{
		kind:									onyx.Groupbox,
		classes:								"inputgroup",

		components: [
			{
				kind:							onyx.InputDecorator,
				components: [{
					name:						"generated",
					kind:						onyx.Input,
					selectOnFocus:				true,

					placeholder:				$L("Generated Password"),
					oninput:					"generate",

					style:						"font-family: monospace; font-size: 20px;"
				}]
			}
		]
	},
	{
		kind:									onyx.Groupbox,
		classes:								"inputgroup",

		components: [
			{
				name:							"copybutton",
				classes:						"button",

				content:						$L("Copy Password"),
				kind:							onyx.Button,
				ontap:							"copyPassword",

				disabled:						true
			},
			{
				name:							"resetbutton",
				classes:						"button",

				content:						$L("Reset"),
				kind:							onyx.Button,
				ontap:							"reset",

				disabled:						true
			}
		]
	}
],

rendered: function()
{
	this.inherited(arguments);

	/*
		Only show the "copy password" button if we are able to successfully set
		the clipboard on this platform.
	*/
	clipboard.test(function(works) {
		if (!works) {
			this.$.copybutton.destroy();
		}
	}.bind(this));
},

reset: function(sender, event)
{
	this.$.domain.setValue('');
	this.$.password.setValue('');
	this.$.generated.setValue('');

	this.$.copybutton.setContent($L("Copy Password"));
	this.$.copybutton.setDisabled(true);
	this.$.resetbutton.setDisabled(true);
},

copyPassword: function(sender, event)
{
	if (window.PalmSystem) {
		// TODO	Launch a dashboard that shows the password (in an easy to read
		//		font) and lets you clear the clipboard
	}

	clipboard.set(this.value);

	if (this.$.copybutton) {
		this.$.copybutton.setContent($L("Password Copied"));
		this.$.copybutton.setDisabled(true);
	}
},

generate: function(sender, event)
{
	var		uri		= '';
	var		pass	= '';

	try {
		uri = this.$.domain.getValue();
	} catch (e) {};

	try {
		pass = this.$.password.getValue();
	} catch (e) {};

	if (uri.length > 0 && pass.length > 0) {
		var domain = (new SPH_DomainExtractor()).extractDomain(uri);
		this.value = new String(new SPH_HashedPassword(pass, domain.toLowerCase()));
	} else {
		this.value = null;
	}

	try {
		this.$.generated.setValue(this.value || '');
	} catch (e) {}

	try {
		this.$.copybutton.setContent($L("Copy Password"));
		this.$.copybutton.setDisabled(!this.value);
	} catch (e) {};

	try {
		this.$.resetbutton.setDisabled(pass.length == 0 && uri.length == 0);
	} catch (e) {};
},

recentdomains: function(sender, event)
{
	var domains	= [];

	/* Include the most recent domains */
	for (var i = 0; i < 10; i++) {
		domains.push(this.domains[i]);
	}

	this.$.recentdomains.setValues(domains);
},

filterdomains: function(sender, event)
{
	var		uri		= '';
	var		domain	= '';
	var		domains = [];

	this.generate(sender, event);

	try {
		uri = this.$.domain.getValue();
		domain = (new SPH_DomainExtractor()).extractDomain(uri);
		domain = domain.toLowerCase();
	} catch (e) {
		domain = '';
	};

	if (domain.length == 0) {
		this.recentdomains(sender, event);
		return;
	}

	/* Include domains that match the value entered */
	domains.push(domain);
	for (var i = 0, d; d = this.domains[i]; i++) {
		if (d.indexOf(domain) !== -1) {
			domains.push(this.domains[i]);

			if (domains.length > 10) {
				break;
			}
		}
	}
	this.$.recentdomains.setValues(domains);
},

selectdomain: function(sender, event)
{
	this.$.domain.setValue(event.value);
	this.generate(sender, event);
},

nextfieldonenter: function(sender, event)
{
	var		node;

	if (event.keyCode !== 13) {
		return;
	}

	if ((!(node = event.dispatchTarget) && !(node = sender)) || !node.hasNode) {
		return;
	}

	if (node.hasNode()) {
		sender.hasNode().blur();
	}

	if (sender.nextfield) {
		if (this.$[sender.nextfield].hasNode()) {
			this.$[sender.nextfield].hasNode().focus();
		}
	}
}


});
