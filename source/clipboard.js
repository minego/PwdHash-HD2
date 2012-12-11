clipboard = {
	textarea: null,

	set: function(value) {
		if (window.clipboardData) {
			if (value && value.length) {
				window.clipboardData.setData('Text', value);
			} else {
				window.clipboardData.clearData();
			}

			return;
		}

		if (!clipboard.textarea) {
			clipboard.textarea = document.createElement('textarea');
		}

		clipboard.textarea.value = value;

		document.body.appendChild(clipboard.textarea);

		clipboard.keyboard.suspend();

		clipboard.textarea.select();
		document.execCommand("cut");
		clipboard.textarea.blur();

		clipboard.keyboard.resume();

		if (clipboard.textarea.parentNode == document.body) {
			document.body.removeChild(clipboard.textarea);
		}
	},

	get: function(cb) {
		if (window.clipboardData) {
			setTimeout(function() {
				cb(window.clipboardData.getData('Text'));
			}, 10);

			return;
		}

		if (!clipboard.textarea) {
			clipboard.textarea = document.createElement('textarea');
		}

		clipboard.textarea.value = "";
		document.body.appendChild(clipboard.textarea);

		clipboard.keyboard.suspend();

		clipboard.textarea.select();
		if (window.PalmSystem) {
			PalmSystem.paste();
		} else {
			document.execCommand("paste");
		}

		setTimeout(function() {
			cb(clipboard.textarea.value);

			clipboard.textarea.blur();
			clipboard.keyboard.resume();

			if (clipboard.textarea.parentNode == document.body) {
				document.body.removeChild(clipboard.textarea);
			}
		}, 10);
	},

	/*
		Test to see if the clipboard can be set programatically with javascript.

		Much of this functionality is protected in browsers, so it can only
		function in some cases (such as a browser add-on with the correct
		permissions).

		This function will attempt to determine if the clipboard is working and
		will then restore the original value.
	*/
	test: function(cb) {
		var	testvalue	= 'testing-clipboard-functionality';

		clipboard.get(function(original) {
			clipboard.set(testvalue);

			clipboard.get(function(current) {
				clipboard.set(original);

				if (current === testvalue) {
					cb(true);
				} else {
					cb(false);
				}
			});
		});
	},

	keyboard: {
		suspend: function() {
			if (window.PalmSystem &&
				window.PalmSystem.setManualKeyboardEnabled
			) {
				PalmSystem.setManualKeyboardEnabled(true);
			}
		},
		resume: function() {
			if (window.PalmSystem &&
				window.PalmSystem.setManualKeyboardEnabled
			) {
				PalmSystem.setManualKeyboardEnabled(false);
			}
		}
	}
};

