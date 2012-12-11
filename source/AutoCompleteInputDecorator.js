/*
	Copyright Ryan J. Duffy

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to
	deal in the Software without restriction, including without limitation the
	rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	sell copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
	IN THE SOFTWARE.
*/

// requires enyo v2 and onyx
enyo.kind({
    name: "extras.AutoCompleteInputDecorator",
    kind: "onyx.InputDecorator",
    handlers: {
        onSelect: "itemSelected"
    },
    published: {
        values: "",

        // private ... needed to support Menu ...
        active: false
    },
    events: {
        onValueSelected: ""
    },
    components:[
        {name: "popup", kind: "onyx.Menu", floating: true}
    ],
    valuesChanged: function() {
        if (!this.values || this.values.length === 0) {
            this.waterfall("onRequestHideMenu", {activator: this});
            return;
        }

        this.$.popup.destroyClientControls();

        var c = [];
        for (var i = 0; i < this.values.length; i++) {
            c.push({content: this.values[i]});
        }
        this.$.popup.createComponents(c);
        this.$.popup.render();

        this.waterfall("onRequestShowMenu", {activator: this});
    },
    itemSelected: function(source, event) {
        this.doValueSelected({ value: event.content });
    }
});
