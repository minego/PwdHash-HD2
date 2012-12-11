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

enyo.kind({

name:											"net.minego.pwdhash.main",

fit:											true,
classes:										"main",

components: [
	{
		kind:									"net.minego.pwdhash.passform",
		name:									"form",

		recent: [
			"google.com", "amazon.com", "twitter.com", "foo.com", "bar.com", "minego.net"
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

reset: function(sender, event)
{
	this.$.form.reset();
},

copyPassword: function(sender, event)
{
	var generated = this.$.form.getGenerated();

	if (window.PalmSystem) {
		// TODO	Copy the password
		// TODO	Launch a dashboard that shows the password (in an easy to read
		//		font) and lets you clear the clipboard
	} else {
		// TODO	Actually copy the password
	}

	if (this.$.copybutton) {
		this.$.copybutton.setContent($L("Password Copied"));
		this.$.copybutton.setDisabled(true);
	}
}


});
