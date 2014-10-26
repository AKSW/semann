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
                    var property = (jQuery.isEmptyObject(item.PROPERTY)) ? "": item.PROPERTY.value;
                    var object = (jQuery.isEmptyObject(item.OBJECT)) ? "": item.OBJECT.value;
                    scientificAnnotation.addDataToSparqlTableView(
                        item.SUBJECT.value,
                        property,
                        object
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
     * Parse the json response and return as array. Also initialises the global variable of ontologies.
     *
     * @param JSON response
     * @param {String} Ontology identifier
     * @returns {Object} of ontology classes 
     */
    parseOntologyClasses:function(response, ontologyURL) {

        var items = { classes: {} };
        var restrictedItems = [];

        $.each(response, function(name, value) {
            if(name == 'results'){
                $.each(value.bindings, function(index,item) {
                    var classLabel = (jQuery.isEmptyObject(item.classLabel)) ? null: item.classLabel.value;
                    var classComment = (jQuery.isEmptyObject(item.classComment)) ? null: item.classComment.value;
                    items.classes[item.class.value] = { "label" : classLabel, "comment" : classComment };
                });
            }
        });
        sparql.ontologies[ontologyURL] = items; //assign global var
        restrictedItems = $.map( sparql.ontologies[ontologyURL].classes, function( value, key ) {
            return { "value": value.label, "uri": key };
        });
        return restrictedItems;
    },
    
    /**
     * Parse the json response and return as array. Also initialises the global variable of ontologies.
     *
     * @param JSON response
     * @param {String} Ontology identifier
     * @returns {Object} of ontology properties 
     */
    parseOntologyProperties:function(response, ontologyURL) {

        var items = { properties: {} };
        var restrictedItems = [];

        $.each(response, function(name, value) {
            if(name == 'results'){
                $.each(value.bindings, function(index,item) {
                    var propertyLabel = (jQuery.isEmptyObject(item.propertyLabel)) ? null: item.propertyLabel.value;
                    var propertyComment = (jQuery.isEmptyObject(item.propertyComment)) ? null: item.propertyComment.value;
                    items.properties[item.property.value] = { "label" : propertyLabel, "comment" : propertyComment };
                });
            }
        });
        sparql.ontologies[ontologyURL] = items; //assign global var
        restrictedItems = $.map( sparql.ontologies[ontologyURL].properties, function( value, key ) {
            return { "value": value.label, "uri": key };
        });
        return restrictedItems;
    },
    
    /**
     * Parse json response of recommendations which share the same SKOS category.
     *
     * @return JSON response
     * @returns {Object} of recommendations 
     */
    parseRecommendationsBySKOSCategory :function(response){
        
        $.each(response, function(name, value) {
            if(name == 'results'){
                $.each(value.bindings, function(index,item) {
                    var categoryLabel = (jQuery.isEmptyObject(item.category_label)) ? null: item.category_label.value;
                    //var skosValues = { "curr_a" : item.curr_a.value, "curr_aType": item.curr_aType.value, "a": item.a.value, "aType": item.aType.value, "curr_category": item.curr_category.value, "category_label" : categoryLabel };
                    sparql.recommendations.papers[item.file.value] = (jQuery.isEmptyObject(sparql.recommendations.papers[item.file.value])) ? { "label": item.fileLabel.value, "annotations": {} } : sparql.recommendations.papers[item.file.value];
                    var ann = sparql.recommendations.papers[item.file.value];
                    ann.annotations[item.a.value] = (jQuery.isEmptyObject(ann[item.a.value])) ? { "label": item.aLabel.value, "skos": {}} : ann[item.a.value];
                    var cat = ann.annotations[item.a.value];
                    cat.skos[item.curr_category.value] = (jQuery.isEmptyObject(cat.skos[item.curr_category.value])) ? { "label": categoryLabel, "subjectOf":  item.aType.value, "thisSubjectOf": item.curr_aType.value } : cat.skos[item.curr_category.value];
                });
            }
        });
        return sparql.recommendations;
    },
    
    /**
     * Parse json response of recommendations which share the same DBpedia resource.
     *
     * @return JSON response
     * @returns {Object} of recommendations 
     */
    parseRecommendationsByDBpedia :function(response){
        
        $.each(response, function(name, value) {
            if(name == 'results'){
                $.each(value.bindings, function(index,item) {
                    sparql.recommendations.papers[item.file.value] = (jQuery.isEmptyObject(sparql.recommendations.papers[item.file.value])) ? { "label": item.fileLabel.value, "annotations": {}} : sparql.recommendations.papers[item.file.value];
                    var ann = sparql.recommendations.papers[item.file.value];
                    ann.annotations[item.a.value] = (jQuery.isEmptyObject(ann[item.a.value])) ? { "label": item.aLabel.value, "dbpedia": {}} : ann[item.a.value];
                    var cat = ann.annotations[item.a.value];
                    cat.dbpedia[item.aType.value] = (jQuery.isEmptyObject(cat[item.aType.value])) ? { "label": null } : cat.dbpedia[item.aType.value];
                });
            }
        });
        return sparql.recommendations;
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

