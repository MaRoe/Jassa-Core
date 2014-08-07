var LookupServiceBase = require('./lookup-service-base');
var LookupServicePathLabels = require('./lookup-service-path-labels');
var HashMap = require('../util/hash-map');

var LookupServiceConstraintLabels = function(lookupServiceNodeLabels, lookupServicePathLabels) {
    LookupServiceBase.call(this);

    this.initialize(lookupServiceNodeLabels, lookupServicePathLabels);
};
// inherit
LookupServiceConstraintLabels.prototype = Object.create(LookupServiceBase.prototype);
// hand back the constructor
LookupServiceConstraintLabels.prototype.constructor = LookupServiceConstraintLabels;

LookupServiceConstraintLabels.prototype.initialize = function(lookupServiceNodeLabels, lookupServicePathLabels) {
    this.lookupServiceNodeLabels = lookupServiceNodeLabels;
    this.lookupServicePathLabels = lookupServicePathLabels || new LookupServicePathLabels(lookupServiceNodeLabels);
};

LookupServiceConstraintLabels.prototype.lookup = function(constraints) {
    // Note: For now we just assume subclasses of ConstraintBasePathValue

    var paths = [];
    var nodes = [];

    constraints.forEach(function(constraint) {
        var cPaths = constraint.getDeclaredPaths();
        var cNode = constraint.getValue();

        paths.push.apply(paths, cPaths);
        nodes.push(cNode);
    });

    var p1 = this.lookupServiceNodeLabels.lookup(nodes);
    var p2 = this.lookupServicePathLabels.lookup(paths);

    var result = jQuery.when.apply(window, [p1, p2]).pipe(function(nodeMap, pathMap) {
        var r = new HashMap();

        constraints.forEach(function(constraint) {
            var cPath = constraint.getDeclaredPath();
            var cNode = constraint.getValue();

            var pathLabel = pathMap.get(cPath);
            var nodeLabel = nodeMap.get(cNode);

            var cLabel = pathLabel + ' = ' + nodeLabel;
            r.put(constraint, cLabel);
        });

        return r;
    });

    return result;
};

module.exports = LookupServiceConstraintLabels;