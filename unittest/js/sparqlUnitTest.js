/**
 * This file contain the unit test of libs/sparql.js file
 *
 * @authors : A Q M Saiful Islam, Mirsattar Seyidov
 *
 */
/*global QUnit:false, sparql :false */

var sparqlUnitTest = {

    testIsSparqlServerUrlValid : function(serverUrl) {
        return (sparql.SERVER_ADDRESS === serverUrl);
    },

    convertCamelCaseSuccessTest : function() {
        return (sparql.camelCase('Hello World') === 'helloWorld');
    },

    convertCamelCaseFailTest : function() {
        return (sparql.camelCase('Hello World') === 'hello World');
    }
};

   
 





