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

enyo.kind({

name:											"net.minego.pwdhash.layout",

components: [
	{
		kind:									"enyo.AppMenu",
		components: [
			{
				content:						$L("Reset recent domains"),
				ontap:							"resetdomains"
			},
			{
				content:						$L("About"),
				ontap:							"about"
			},
			{
				content:						$L("Help"),
				ontap:							"help"
			}
		]
	},
	{
		kind:									enyo.Panels,
		name:									"panels",
		classes:								"panels",
		fit:									true,
		arrangerKind:							"CardArranger",
		style:									"width: 100%; height: 100%;",

		components: [
			/* The main app */
			{
				layoutKind:						"FittableRowsLayout",

				components: [
					{
						kind:					onyx.Toolbar,
						layoutKind:				"FittableColumnsLayout",

						components: [
							{
								kind:			enyo.Image,
								src:			"assets/icon.png",
								style:			"width: 48px; height: 48px;",
								ontap:			"about"
							},
							{
								content:		"PwdHash",
								fit:			true,
								ontap:			"about"
							},
							{
								kind:			onyx.Button,
								content:		"Help",
								ontap:			"help"
							}
						]
					},
					{
						name:					"main",
						kind:					"net.minego.pwdhash.form",
						classes:				"pwdhash",
						fit:					true
					}
				]
			},

			/* About */
			{
				layoutKind:						"FittableRowsLayout",

				components: [
					{
						kind:					onyx.Toolbar,
						layoutKind:				"FittableColumnsLayout",

						components: [
							{
								kind:			enyo.Image,
								src:			"assets/icon.png",
								style:			"width: 48px; height: 48px;"
							},
							{
								content:		"About",
								fit:			true
							},
							{
								kind:			onyx.Button,
								content:		"Close",
								ontap:			"home"
							}
						]
					},
					{
						name:					"about",
						classes:				"about",
						kind:					enyo.Scroller,

						allowHtml:				true,
						fit:					true
					}
				]
			},

			/* Help */
			{
				layoutKind:						"FittableRowsLayout",

				components: [
					{
						kind:					onyx.Toolbar,
						layoutKind:				"FittableColumnsLayout",

						components: [
							{
								kind:			enyo.Image,
								src:			"assets/icon.png",
								style:			"width: 48px; height: 48px;"
							},
							{
								content:		"Help",
								fit:			true
							},
							{
								kind:			onyx.Button,
								content:		"About",
								ontap:			"about"
							},
							{
								kind:			onyx.Button,
								content:		"Close",
								ontap:			"home"
							}
						]
					},
					{
						classes:				"help",
						kind:					enyo.Scroller,
						fit:					true,

						components: [
							{
								name:			"help"
							},
							{
								name:			"reset",
								classes:		"button onyx-negative",

								content:		$L("Reset recent domains"),
								kind:			onyx.Button,
								ontap:			"resetdomains"
							}
						]
					}
				]
			}
		]
	}
],

home: function(sender, event)
{
	this.$.panels.setIndex(0);
},

about: function(sender, event)
{
	this.$.panels.setIndex(1);
},

help: function(sender, event)
{
	this.$.reset.setDisabled(false);
	this.$.panels.setIndex(2);
},

resetdomains: function(sender, event)
{
	this.$.reset.setDisabled(true);
	this.$.main.setDomains([]);
},

create: function()
{
	this.inherited(arguments);

	this.$.help.createComponent({
		allowHtml:	true,
		content:	this.html.help
	});

	this.$.about.createComponent({
		allowHtml:	true,
		content:	this.html.about
	});
},

html: {
	about: [
		"<p>",
		"	Version: 2.3",
		"</p>",
		"",
		"<p>",
		"	This app is provided \"as is\" with no warranties expressed or",
		"	implied.  Use at your own risk.",
		"</p>",
		"",
		"<p>",
		"	This app was developed by Micah N Gorrell. The source and license",
		"	can be obtained at",
		"	<a href=\"http://github.com/minego/PwdHash-HD2/\"",
		"		>github.com/minego/PwdHash-HD2/</a>",
		"</p>",
		"",
		"<p>",
		"	This app is based on the algorithms created by the",
		"	<a href=\"http://www.pwdhash.com/\">Stanford PwdHash</a> project.",
		"</p>"
	].join('\n'),

	help: [
		"<p>",
		"	This application generates a unique password for each site that",
		"	you visit. This is done by creating a hash of the domain name",
		"	and a master password. The result is that you only have to",
		"	remember one password, but you get the benefits of having a",
		"	different password on each site you visit.",
		"</p>",
		"",
		"<p>",
		"	This application uses the same source and algorithms as the",
		"	<a href=\"http://www.pwdhash.com/\">Stanford PwdHash</a> site.",
		"	If you use the chrome or firefox plugin then the password",
		"	generated will be the same.",
		"</p>"

	].join('\n')
}

});
