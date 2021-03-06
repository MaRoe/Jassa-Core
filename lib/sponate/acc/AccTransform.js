var Class = require('../../ext/Class');

var Acc = require('./Acc');

var AccTransform = Class.create(Acc, {
    classLabel: 'jassa.sponate.AccTransform',

    initialize: function(subAcc, fn) {
        this.subAcc = subAcc;
        this.fn = fn;
    },

    getSubAcc: function() {
        return this.subAcc;
    },

    accumulate: function(binding) {
        this.subAcc.accumulate(binding);
    },

    getValue: function() {
        var v = this.subAcc.getValue();
        var result = this.fn(v);
        return result;
    },

    getSubAccs: function() {
        return [this.subAcc];
    }
});

module.exports = AccTransform;
