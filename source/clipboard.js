clipboard = {
	textarea: null,

	works: function() {
		if (window.clipboardData || window.PalmSystem) {
			return(true);
		} else {
			return(false);
		}
	},

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

