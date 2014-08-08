var SparqlServiceHttp = require('./sparql-service-http');
var SparqlServiceCache = require('./sparql-service-cache');

var SparqlServiceFactoryDefault = function() {
    this.initialize();
};

SparqlServiceFactoryDefault.prototype.initialize = function() {
    this.hashToCache = {};
};

SparqlServiceFactoryDefault.prototype.createSparqlService = function(sparqlServiceIri, defaultGraphIris) {
    var tmp = new SparqlServiceHttp(sparqlServiceIri, defaultGraphIris);
    tmp = new SparqlServiceCache(tmp);

    var hash = tmp.getStateHash();

    var cacheEntry = this.hashToCache[hash];

    var result;
    if (cacheEntry) {
        result = cacheEntry;
    } else {
        this.hashToCache[hash] = tmp;
        result = tmp;
    }

    return result;
};

module.exports = SparqlServiceFactoryDefault;