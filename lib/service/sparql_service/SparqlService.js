var Class = require('../../ext/Class');

var SparqlService = Class.create({
    getServiceId: function() {
        throw new Error('[ERROR] Method not overridden');
    },

    getStateHash: function() {
        throw new Error('[ERROR] Method not overridden');
    },

    createQueryExecution: function(query) {
        throw new Error('[ERROR] Method not overridden');
    }

//    createUpdateExecution: function(updates) {
//        throw new Error('[ERROR] Method not overridden');
//    }
});

module.exports = SparqlService;
