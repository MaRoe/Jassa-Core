var Class = require('../../ext/class');
var newBinaryExpr = require('../new-binary-expr');
var ExprFunction2 = require('../expr/expr-function-2');

var ELogicalAnd = Class.create(ExprFunction2, {
    initialize: function($super, left, right) {
        $super('&&', left, right);
    },

    copySubstitute: function(fnNodeMap) {
        return new ELogicalAnd(this.left.copySubstitute(fnNodeMap), this.right.copySubstitute(fnNodeMap));
    },

    copy: function(args) {
        return newBinaryExpr(ELogicalAnd, args);
    },

    toString: function() {
        return '(' + this.left + ' && ' + this.right + ')';
    },
});

module.exports = ELogicalAnd;