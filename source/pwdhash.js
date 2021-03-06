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

// TODO	Implement the dashboard for webOS phones and tablets, or at least a
//		notification?

// TODO	Port to android with phonegap, and implement an intent so that apps can
//		share links with the app to fill out the domain.

// TODO	Create a browser patch for webOS to launch the app with the URL from the
//		browser.

// TODO	Copy and paste on Firefox OS once that is possible

enyo.kind({
name:									"net.minego.pwdhash.form",


published: {
	value:								'',
	domains:							[]
},

kind:									enyo.FittableRows,
fit:									true,

components: [
	{
		kind:							onyx.Groupbox,
		classes:						"inputgroup",

		components: [
			{
				kind:					"extras.AutoCompleteInputDecorator",
				name:					"recentdomains",

				oninput:				"filterdomains",
				onfocus:				"recentdomains",

				onValueSelected:		"selectdomain",
				onkeydown:				"nextfieldonenter",
				nextfield:				"password",

				components: [{
					name:				"domain",
					kind:				onyx.Input,
					selectOnFocus:		true,
					type:				"url",
					onfocus:			"recentdomains",

					placeholder:		$L("Domain or URL")
				}]
			},
			{
				kind:					onyx.InputDecorator,
				components: [{
					name:				"password",
					kind:				onyx.Input,
					type:				"password",
					selectOnFocus:		true,

					placeholder:		$L("Master Password"),
					oninput:			"generate",
					onkeydown:			"nextfieldonenter",
					nextfield:			"generated"
				}]
			}
		]
	},
	{
		kind:							onyx.Groupbox,
		classes:						"inputgroup",
		fit:							true,

		components: [
			{
				kind:					onyx.InputDecorator,
				components: [{
					name:				"generated",
					classes:			"generated",
					kind:				onyx.Input,
					selectOnFocus:		true,

					placeholder:		$L("Generated Password"),
					oninput:			"generate",
					onfocus:			"savedomain"
				}]
			}
		]
	},
	{
		kind:							onyx.Groupbox,
		classes:						"inputgroup",

		components: [
			{
				name:					"copybutton",
				classes:				"button onyx-dark",

				content:				$L("Copy Password"),
				kind:					onyx.Button,
				ontap:					"copypassword",

				disabled:				true
			},
			{
				name:					"resetbutton",
				classes:				"button onyx-negative",

				content:				$L("Reset"),
				kind:					onyx.Button,
				ontap:					"reset",

				disabled:				true
			}
		]
	}
],

create: function()
{
	var json = null;

	try {
		var classes	= document.body.className;
		var info	= enyo.webOS.deviceInfo();
		var name	= null;

		if ("Emulator" != info.modelNameAscii) {
			name = info.modelNameAscii;
		} else {
			/* Detect sizes known to be supported by the webOS emulator */
			if (info.screenWidth == 480 && info.screenHeight == 800) {
				name = "Pre3";
			} else if (info.screenWidth == 320 && info.screenHeight == 480) {
				name = "Pre";
			} else if (info.screenWidth == 320 && info.screenHeight == 400) {
				name = "Veer";
			}
		}

		if (name) {
			document.body.className = [ name, classes ].join(' ');
			// this.log('Adding class to body: ' + name);
		}

	} catch (e) {};

	this.inherited(arguments);

	/* Load the recent domain list */
	if (window.localStorage) {
		json = window.localStorage.getItem("recentdomains");
	}

	if (!json) {
		json = enyo.getCookie("recentdomains");
	}

	try {
		if (json) {
			this.domains = enyo.json.parse(json);
			this.log(this.domains);
		} else {
			this.domains = [];
		}
	} catch(e) {
		this.domains = [];
	}

	if (!this.domains.length) {
		/*
			The default list of recent domains. Domains will be added as users
			enter their own.
		*/
		this.domains = [
			"google.com", "amazon.com", "twitter.com", "facebook.com",
			"netflix.com", "youtube.com", "linkedin.com", "flickr.com"
		];
	}

	/* Was the app launched with a uri? (webOS style) */
	try {
		if (eny.webOS.launchParams &&
			(json = enyo.webOS.launchParams()) &&
			json.uri
		) {
			this.$.domain.setValue(json.uri);
		}
	} catch (e) { };

	/* Was the app launched with a uri? (firefox style) */
	try {
		navigator.mozSetMessageHandler('activity', function(activity) {
			switch (activity.source.name) {
				case 'view':
				case 'share':
					if (activity.source.data.url) {
						this.$.domain.setValue(activity.source.data.url);
					}
					break;
			}
		}.bind(this));
	} catch (e) {
	}


	// if (enyo.platform.firefoxOS) {
	if (-1 != navigator.userAgent.toLowerCase().indexOf("firefox") &&
		-1 != navigator.userAgent.toLowerCase().indexOf("mobile;")
	) {
		this.install();
	}
},

install: function()
{
	var request = window.navigator.mozApps.getInstalled();

	request.onsuccess = function () {
		var found	= false;
		var i		= 0;

		if (request.result && request.result.length) {
			for (i = 0; i < request.result.length; i++) {
				if (request.result[i] && request.result[i].manifest &&
					request.result[i].manifest.name === "PwdHash"
				) {
					found = true;
					break;
				}
			}
		}

		if (!found) {
			this.installUrl = (
				location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp"
			);

			this.doIt = function() {
				try {
					var req2 = navigator.mozApps.install(this.installUrl);

					req2.onsuccess = function(data) {
						// Show something?
					};
					req2.onerror = function(error) {
						// Show something?
					};
				} catch (error) {
					this.error = error;
					// Show something?
				}
			};

			this.doIt();
		} else {
			// Show something?
		}
	}.bind(this);

	request.onerror = function (error) {
		/* Oh well, just run in the browser */
	}.bind(this);
},

rendered: function()
{
	this.inherited(arguments);

	/* Prevent auto capitalization on webOS devices */
	this.$.domain.setAttribute('x-palm-disable-auto-cap', true);

	/*
		Only show the "copy password" button if we are able to successfully set
		the clipboard on this platform.
	*/
	if (!clipboard.works()) {
		this.$.copybutton.destroy();
	} else {
		this.$.generated.setDisabled(true);
	}

	try {
		/* Leave the keyboard showing all the time on the TouchPad */
		enyo.webOS.keyboard.setManualMode(true);
		enyo.webOS.keyboard.show();
	} catch(e) {};
},

reset: function(sender, event)
{
	this.$.domain.setValue('');
	this.$.password.setValue('');
	this.$.generated.setValue('');

	this.$.resetbutton.setDisabled(true);
	if (this.$.copybutton) {
		this.$.copybutton.setContent($L("Copy Password"));
		this.$.copybutton.setDisabled(true);
	}
},

copypassword: function(sender, event)
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

	this.savedomain();

	if (enyo.webOS.deactivate) {
		/*
			Switch to card view, so that the user can go paste the password
			in another app.
		*/
		enyo.webOS.deactivate();
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
	this.$.domain.focus();
},

filterdomains: function(sender, event)
{
	var		uri		= '';
	var		domain	= '';
	var		domains = [];

	this.generate(sender, event);

	try {
		uri = this.$.domain.getValue().toLowerCase();
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

	if (this.$.password.hasNode()) {
		this.$.password.hasNode().focus();
	}
},

nextfieldonenter: function(sender, event)
{
	var		node;

	/* Act on enter or tab */
	if (event.keyCode !== 13 && event.keyCode !== 9) {
		return;
	}

	/*
		If we don't prevent the default then tab cause the browser to freak out
		and loop between inputs like crazy.
	*/
	event.preventDefault();

	this.$.recentdomains.setValues([]);

	if ((!(node = event.dispatchTarget) && !(node = sender)) || !node.hasNode) {
		return;
	}

	if (node.hasNode()) {
		sender.hasNode().blur();
	}

	if (sender.nextfield) {
		if (sender.nextfield === "generated") {
			this.copypassword();
		}

		if (this.$[sender.nextfield].hasNode()) {
			this.$[sender.nextfield].hasNode().focus();
		}
	}
},

savedomain: function(sender, event)
{
	var last;

	domain = this.$.domain.getValue();

	if (!domain || !domain.length) {
		return;
	}

	/* Only store the domain, not a URI */
	domain = (new SPH_DomainExtractor()).extractDomain(domain.toLowerCase());

	if (-1 != enyo.indexOf(domain, this.domains)) {
		/* Already there */
		return;
	}

	this.domains.unshift(domain);
	while (this.domains.length > 10) {
		this.domains.pop();
	}

	this.domainsChanged();
},

domainsChanged: function()
{
	/* Save the list */
	if (window.localStorage) {
		window.localStorage.setItem("recentdomains",
			enyo.json.stringify(this.domains));
	}

	enyo.setCookie("recentdomains", enyo.json.stringify(this.domains));
}

});

window.addEventListener('load', function()
{
	new net.minego.pwdhash.layout().renderInto(document.body);
}, false);


