/**
Parse the json response from virtuso server

 @authors : A Q M Saiful Islam, Jaana Takis

 @dependency
 null
 */
"use strict";
var sparqlResponseParser  = {

    /**
     * Parse the json response form db and render a tabular view of the results
     *
     * @param JSON response
     */
    parseResponse:function(response) {
        highlight.importedAnnotations.emptyAll(); //reset imported annotations
        $.each(response, function(name, value) {
            if(name == 'results'){
                $.each(value.bindings, function(index,item) {
                    scientificAnnotation.addDataToSparqlTableView(
                        item.SUBJECT.value,
                        item.PROPERTY.value,
                        item.OBJECT.value
                    );
                    var fragment = sparqlResponseParser.getURLParameters(item.excerpt.value, "id");
                    var pageNum = sparqlResponseParser.getPageParameter(item.excerpt.value);
                    highlight.importedAnnotations.set(pageNum, fragment);
                });
            }
        });
    },

    /**
     * Parse the json response and return as an array of objects
     *
     * @param response
     * @returns {Array of objects}
     */
    parseResource:function(response) {
        var map = []; //maps labels to properties (URIs), eg  
        /*
            [
              {
                    "value": "long distance piste kilometre (?)",
                    "uri": "http://dbpedia.org/ontology/longDistancePisteKilometre"
                },
                {
                    "value": "long distance piste number",
                    "uri": "http://dbpedia.org/ontology/longDistancePisteNumber"
                }
            ]
            */
        var resource = 'PROPERTY'; //by default we check for properties
        $.each(response, function(name, value) {
            if(name == 'results'){
                $.each(value.bindings, function(index,item) {
                    if (item.OBJECT && index == 0) resource = 'OBJECT'; //response contains "OBJECT", not "PROPERTY"
                    map.push({
                        "value": item.LABEL.value, "uri": item[resource].value
                    });
                });
            }
        });
        if (scientificAnnotation.DEBUG) console.log("Returned " +map.length+ " "+resource+ "s. " /*+JSON.stringify(map, null, 4)*/ );
        return map;
    },
    
    /**
     * Parse the json response and return as array
     *
     * @param JSON response
     * @returns {Array} of results
     */
    parseSimilarSearch:function(response) {

        var items = [];

        $.each(response, function(name, value) {
            if(name == 'results'){
                $.each(value.bindings, function(index,item) {
                    items.push(item.file.value);
                });
            }
        });
        return items;
    },
    
    /**
     * Parse the json response and return as array
     *
     * @param JSON response
     * @returns {Array} of results
     */
    parseLoadOntology:function(response) {

        var items = [];

        $.each(response, function(name, value) {
            if(name == 'results'){
                $.each(value.bindings, function(index,item) {
                    items.push(item.count.value);
                });
            }
        });
        return items;
    },

    /**
     * Filters out given URI parameter value from the sURL and returns the values as a string array.
     *
     * @param string, string
     * @returns mix
     */
    getURLParameters: function (sURL, paramName) { //filters out givenURI parameter value from the sURL
        if (sURL.indexOf("?") > 0) {
            var arrParams = sURL.split("?");
            var arrURLParams = arrParams[1].split("&");
            var arrParamNames = new Array(arrURLParams.length);
            var arrParamValues = new Array(arrURLParams.length);
            var i = 0;
            for (i=0;i<arrURLParams.length;i++) {
                var sParam =  arrURLParams[i].split("=");
                arrParamNames[i] = sParam[0];
                if (sParam[1] != "")
                    arrParamValues[i] = unescape(sParam[1]);
                else
                    arrParamValues[i] = "No Value";
            }

            for (i=0;i<arrURLParams.length;i++) {
                if(arrParamNames[i] == paramName){
                    return arrParamValues[i];
                }
            }
            return "No Parameters Found";
        }
    },
    
    /**
     * Retrieves "page" parameter from the given URL.
     *
     * @param {String} URL string
     * @returns {Integer} page number
     */
    getPageParameter: function (sURL) {
        var start = sURL.indexOf("#") ;
        var end = sURL.indexOf("?") ;
        var result;
        if (start && end && start < end) {
            start++;
            result = sURL.substring(start, end); //"page=2" e.g.
            result = result.split("=")[1]; //2 e.g.
            result = parseInt(result);
        }
        return result;
    }
};

