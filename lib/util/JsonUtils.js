var ObjectUtils = require('./ObjectUtils');
var JSONCanonical = require('../ext/JSONCanonical');

var JsonUtils = {
    stringifyCyclic: function(obj, fn) {
        var seen = [];
        var result = JSONCanonical.stringify(obj, function(key, val) {
            if (ObjectUtils.isObject(val)) {
                if (seen.indexOf(val) >= 0) {
                    return;
                }

                seen.push(val);

                if (fn) {
                    val = fn(key, val);
                }
            }
            return val;
        });

        return result;
    },
};

module.exports = JsonUtils;