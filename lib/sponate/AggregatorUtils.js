var TreeUtils = require('../../util/TreeUtils');
var AggregatorRef = require('../aggregator/AggregatorRef');

var AggregatorUtils = {
    /**
     * Get all aggregators in an aggregator
     */
    getRefs: function(aggregator) {
        var result = [];

        var fn = function(aggregator) {
            var proceed = true;
            if (aggregator instanceof AggregatorRef) {
                result.push(aggregator);
                proceed = false;
            }

            return proceed;
        };

        TreeUtils.visitDepthFirst(aggregator, this.getChildren, fn);

        return result;
    },

    getChildren: function(aggregator) {
        return aggregator.getSubAggregators();
    },

    /**
     * Generic method for visiting a tree structure
     *
     */
//      visitDepthFirst: function(parent, fnChildren, fnPredicate) {
//          var proceed = fnPredicate(parent);
//
//          if(proceed) {
//              var children = fnChildren(parent);
//
//              _(children).each(function(child) {
//                  ns.PatternUtils.visitDepthFirst(child, fnChildren, fnPredicate);
//              });
//          }
//      }

};

module.exports = AggregatorUtils;