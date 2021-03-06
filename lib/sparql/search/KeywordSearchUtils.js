var ExprVar = require('../expr/ExprVar');
var E_LangMatches = require('../expr/E_LangMatches');
var E_LogicalOr = require('../expr/E_LogicalOr');
var E_Lang = require('../expr/E_Lang');
var E_Bound = require('../expr/E_Bound');
var E_Regex = require('../expr/E_Regex');
var E_Str = require('../expr/E_Str');
var E_Function = require('../expr/E_Function');

var Concept = require('../Concept');

var ElementGroup = require('../element/ElementGroup');
var ElementOptional = require('../element/ElementOptional');
var ElementFilter = require('../element/ElementFilter');

var NodeValueUtils = require('../NodeValueUtils');

var LabelUtils = require('../LabelUtils');

var KeywordSearchUtils = {
    /**
     * ?s ?p ?o // your relation
     * Filter(Regex(Str(?o), 'searchString'))
     * 
     * if includeSubject is true, the output becomes:
     * 
     * Optional {
     *     ?s ?p ?o // your relation
     *     Filter(Regex(Str(?o), 'searchString'))
     * }
     * Filter(Regex(Str(?s), 'searchString') || Bound(?o))
     * 
     * 
     * 
     * @param relation
     * @returns
     */
    createConceptRegex: function(relation, searchString, includeSubject) {
        var result = includeSubject
            ? this.createConceptRegexIncludeSubject(relation, searchString)
            : this.createConceptRegexLabelOnly(relation, searchString);

        return result;
    },
   
    createConceptRegexLabelOnly: function(relation, searchString) {
        
        var result;
        if(searchString) {
            var element =
                new ElementGroup([
                    relation.getElement(),
                    new ElementFilter(
                        new E_Regex(new E_Str(new ExprVar(relation.getTargetVar())), searchString, 'i'))
               ]);
            
            result = new Concept(element, relation.getSourceVar());
        } else {
            result = null;
        }

        return result;
    },

    createConceptRegexIncludeSubject: function(relation, searchString) {
        var result;

        if(searchString) {
            var relEl = relation.getElement();
            var s = relation.getSourceVar();
            var o = relation.getTargetVar();
    
            // var nv = NodeValueUtils.makeString(searchString);
    
            var es = new ExprVar(s);
            var eo = new ExprVar(o);
            
            var innerExpr = new E_Regex(new E_Str(eo), searchString, 'i');
            
            var outerExpr = new E_LogicalOr(
                new E_Regex(new E_Str(es), searchString, 'i'),
                new E_Bound(eo));
            
    
            var element = new ElementGroup([
                new ElementOptional(
                    new ElementGroup([relEl, new ElementFilter(innerExpr)])),
                new ElementFilter(outerExpr)
            ]);
    
            result = new Concept(element, s);
        } else {
            result = null;
        }
        
        return result;
    },

    /**
     * ?s ?p ?o // relation
     * Filter(<bif:contains>(?o, 'searchString')
     */
    createConceptBifContains: function(relation, searchString) {
        var result;

        if(searchString) {
            var relEl = relation.getElement();
            var o = relation.getTargetVar();
            
            var eo = new ExprVar(o);
            var nv = NodeValueUtils.makeString(searchString);
            
            var element =
                new ElementGroup([
                    relation.getElement(),
                    new ElementFilter(new E_Function('<bif:contains>', [eo, nv]))
                ]);
    
            var s = relation.getSourceVar();
            result = new Concept(element, s);
        } else {
            result = null;
        }

        return result;
    }
};

module.exports = KeywordSearchUtils;
