/**
 This file contain all the necessary sparql related queries,
 that need to perform.

 @authors : A Q M Saiful Islam, Jaana Takis
 @dependency
 {
    scientificAnnotation.js
    highlight.js
 }

 */

"use strict";
var sparql  = {

    SERVER_ADDRESS : "http://localhost:8890/sparql",
    GRAPH_NAME : 'scientificAnnotation',

    // annotation properties
    PREFIX_FILE : "http://eis.iai.uni-bonn.de/semann/pdf/",
    PREFIX_PUB : "http://eis.iai.uni-bonn.de/semann/publication/",
    PREFIX_RDFS : "http://www.w3.org/2000/rdf-schema#",
    PREFIX_SEMANN : "http://eis.iai.uni-bonn.de/semann/owl#",
    PREFIX_SEMANNP : "http://eis.iai.uni-bonn.de/semann/property#",
    triple: { //holds triple SPO values to be added into the database. Comes with convenience methods
        "subject": {"uri": null, "label": null},
        "property": {"uri": null, "label": null},
        "object": {"uri": null, "label": null},
        empty: function(inputObject) {
            var tripleObject;
            var isSuccess = false;
            if (inputObject.is(scientificAnnotation.INPUT_SUBJECT)) {
                tripleObject = "subject";
            } else if (inputObject.is(scientificAnnotation.INPUT_PROPERTY)) {
                tripleObject = "property";
            } else if (inputObject.is(scientificAnnotation.INPUT_OBJECT)) {
                tripleObject = "object";
            }
            if (sparql.triple[tripleObject]) {
                sparql.triple[tripleObject].uri = null;
                sparql.triple[tripleObject].label = null;
                inputObject.val('');
                isSuccess = true;
            } else {
                if (scientificAnnotation.DEBUG) console.warn("Failed to empty triple value due to unexpected input. Only the following input elements are allowed: "+[scientificAnnotation.INPUT_SUBJECT.attr('id'), scientificAnnotation.INPUT_PROPERTY.attr('id'), scientificAnnotation.INPUT_OBJECT.attr('id')].toString());
                scientificAnnotation.showWarningMessage('User inputs got corrupted.');
            }
            return isSuccess; //true if operation was successful
        },
        set: function(inputObject, uriValue) {
            if (!uriValue) uriValue = null; //optional parameter
            var labelValue = $.trim(inputObject.val());
            var isSuccess = false;
            var wasTrimmed = (labelValue === inputObject.val())? false : true;
            var tripleObject;
            if (inputObject.is(scientificAnnotation.INPUT_SUBJECT)) {
                tripleObject = "subject";
            } else if (inputObject.is(scientificAnnotation.INPUT_PROPERTY)) {
                tripleObject = "property";
            } else if (inputObject.is(scientificAnnotation.INPUT_OBJECT)) {
                tripleObject = "object";
            }
            if (sparql.triple[tripleObject]) {
                sparql.triple[tripleObject].uri = uriValue;
                sparql.triple[tripleObject].label = labelValue;
                if (wasTrimmed) inputObject.val(labelValue);
                isSuccess = true;
            } else {
                if (scientificAnnotation.DEBUG) console.warn("Failed to set triple value due to unexpected input. Only the following input elements are allowed: "+[scientificAnnotation.INPUT_SUBJECT.attr('id'), scientificAnnotation.INPUT_PROPERTY.attr('id'), scientificAnnotation.INPUT_OBJECT.attr('id')].toString());
                scientificAnnotation.showWarningMessage('User inputs got corrupted.');
            }
            return isSuccess; //true if value got trimmed
        },
        emptyAll: function() {
            this.empty(scientificAnnotation.INPUT_SUBJECT);
            this.empty(scientificAnnotation.INPUT_PROPERTY);
            this.empty(scientificAnnotation.INPUT_OBJECT);
        }
    }, 
    defaultProperties: [],
        
    // For showing similar search result, the maximum size of the list
    SIMILAR_RESULT_LIMIT : 10,

    // For auto complete property and object maximum size of the list
    AUTO_COMPLETE_RESULT_LIMIT : 200,

    /**
     *Read data for sparql table and display
     *
     * @return void
     */
    showDataFromSparql:function (){

        var q = sparql.resource();
        var selectQuery = 'SELECT distinct str(?excerpt) as ?excerpt str(?SUBJECT) as ?SUBJECT str(?PROPERTY) as ?PROPERTY str(?OBJECT) as ?OBJECT FROM  <'+sparql.GRAPH_NAME+'> ' +'\n'+
            'WHERE' +'\n'+
            '{ ' +'\n\t'+
                q.File + ' '+ q.hasExcerpt + ' ?excerpt . ' +'\n\t'+
                '?excerpt ' + q.label + ' ?SUBJECT. ?excerpt ?prop ?obj. ' +'\n\t'+
                '?prop ' + q.label + ' ?PROPERTY. ' +'\n\t'+
                '?obj ' + q.label + ' ?OBJECT.' +'\n'+
            '}';
        if (scientificAnnotation.DEBUG) console.log(selectQuery);
        $.ajax({
            type: "GET",
            url: sparql.SERVER_ADDRESS,
            data: {
                query: selectQuery,
                format: "application/json"
            },
            async: true,
            dataType: "jsonp",
            crossDomain: true,
            cache: false,
            success: function(response){

                if( response!= null && response.results.bindings.length >0) {
                    scientificAnnotation.hideProgressBar();
                    scientificAnnotation.displayAvailableAnnotationFromSparql();
                    var fragments = sparqlResponseParser.parseResponse(response);
                    highlight.rangy_highlight(fragments);
                } else {
                    scientificAnnotation.noAvailableAnnotationFromSparql();
                }
            },
            error: function(jqXHR, exception){
                var errorTxt= sparql.getStandardErrorMessage(jqXHR, exception);
                scientificAnnotation.hideProgressBar();
                scientificAnnotation.showErrorMessage(errorTxt);
            }
        });
    },

    /**
     * prepare and send the ajax request for add annotation.
     *
     * @param property
     * @param subject
     * @param object
     * @param textStartPos
     * @param textEndPos
     * @param rangyPage
     * @param rangyFragment
     *
     * @return void
     */
    addAnnotation:function(textStartPos, textEndPos, rangyPage, rangyFragment){
        var isSuccess = true;
        //check that the triple is not corrupt
        if (scientificAnnotation.INPUT_SUBJECT.val() != sparql.triple.subject.label || scientificAnnotation.INPUT_PROPERTY.val() != sparql.triple.property.label || scientificAnnotation.INPUT_OBJECT.val() != sparql.triple.object.label) {
            var error = "Error! User defined triple values do not match globally stored ones.";
            if (scientificAnnotation.DEBUG) console.error(error);
            scientificAnnotation.showErrorMessage(error,true);
            isSuccess = false;
            return isSuccess;
        }
        if (!sparql.triple.subject.label || !sparql.triple.property.label || !sparql.triple.object.label) {
            var error = "Error! Some or all of the user defined triple values are missing in the global variable.";
            if (scientificAnnotation.DEBUG) if (scientificAnnotation.DEBUG) console.error(error);
            scientificAnnotation.showErrorMessage(error,true);
            isSuccess = false;
            return isSuccess;
        }
        var defineSubjectType = true;
        if (!sparql.triple.subject.uri) {
            defineSubjectType = false;
        }
        if (!sparql.triple.property.uri) {
            var localUri = sparql.PREFIX_SEMANNP + sparql.camelCase(sparql.triple.property.label, true);
            sparql.triple.property.uri = localUri;
        }
        if (!sparql.triple.object.uri) {
            var localUri = sparql.PREFIX_SEMANN +sparql.camelCase(sparql.triple.object.label, false);
            sparql.triple.object.uri = localUri;
        }
        
        var currentPage = $('#pageNumber').val();
        var charStart = textStartPos, charEnd = textEndPos,length = (textEndPos - textStartPos);
	    var fileFragment = '#page='+currentPage+'?char='+charStart+','+charEnd+';length='+length+',UTF-8&rangyPage='+rangyPage+'&rangyFragment='+rangyFragment;
	    var q = sparql.resource(fileFragment);

        var insertQuery =
            'prefix semann: <'+sparql.PREFIX_SEMANN+'>' +'\n'+
            'prefix semannp: <'+sparql.PREFIX_SEMANNP+'>'+'\n'+
            'INSERT DATA ' +'\n'+
            '{ ' +'\n\t'+
                'GRAPH <'+sparql.GRAPH_NAME+'> ' +'\n\t'+
                '{ ' +'\n\t\t'+
                    q.File+' a ' +q.Publication+ '. '+'\n\t\t'+
                    q.File+' ' + q.hasExcerpt + ' '+ q.Excerpt +' .'+'\n\t\t';
        if (defineSubjectType) {
            insertQuery = insertQuery + 
                    q.Excerpt +' a <' +sparql.triple.subject.uri+ '> .' + '\n\t\t';
        }
        insertQuery = insertQuery +
                    q.Excerpt +' ' + q.label + ' "'+sparql.triple.subject.label+'"@en; ' +'\n\t\t'+
                    '<'+sparql.triple.property.uri +'> <'+sparql.triple.object.uri+'> .'+'\n\t\t'+
                    '<'+sparql.triple.property.uri+'>  ' + q.label + ' "'+sparql.triple.property.label+'"@en. '+'\n\t\t'+
                    '<'+sparql.triple.object.uri+'> ' + q.label + ' "'+sparql.triple.object.label+'"@en. '+'\n\t'+
                '} ' +'\n'+
            '}';
        
        if (scientificAnnotation.DEBUG) console.log(insertQuery);
        $.ajax({
            type: "GET",
            url: sparql.SERVER_ADDRESS,
            data: {
                query: insertQuery,
                format: "application/json"
            },
            async: true,
            dataType: "jsonp",
            crossDomain: true,
            cache: false,
            success: function(response){
                sparql.bindAutoCompleteProperty();
                //sparql.bindAutoCompleteObject();
                scientificAnnotation.hideAnnotationDisplayTable();
                scientificAnnotation.hideProgressBar();
                scientificAnnotation.showSuccessMessage('Annotation successfully added');
            },
            error: function(jqXHR, exception){
                isSuccess = false;
                var errorTxt= sparql.getStandardErrorMessage(jqXHR ,exception);
                scientificAnnotation.hideProgressBar();
                scientificAnnotation.showErrorMessage(errorTxt);
            }
        });
        return isSuccess;
    },

    /**
     * Provide the data for the auto complete in the  object field
     *
     * @param searchItem
     * @returns {Array}
     */
    bindAutoCompleteObject :function(){ //not in use

        var q = sparql.resource();
        var selectQuery = 
            'SELECT distinct str(?o) as ?OBJECT str(?label) as ?LABEL FROM  <'+sparql.GRAPH_NAME+'> ' +'\n'+
            'WHERE ' +'\n'+
            '{ ' +'\n\t'+
                '?o ' + q.label + ' ?label ' +'\n\t'+
                'FILTER(STRSTARTS(STR(?o), "'+sparql.PREFIX_SEMANN+'"))' +'\n'+
            '} ORDER BY fn:lower-case(?OBJECT) LIMIT '+sparql.AUTO_COMPLETE_RESULT_LIMIT;

        var source = null;

        $.ajax({
            type: "GET",
            url: sparql.SERVER_ADDRESS,
            data: {
                query: selectQuery,
                format: "application/json"
            },
            async: true,
            dataType: "jsonp",
            crossDomain: true,
            cache: false,
            success: function(response){
                source = sparqlResponseParser.parseResource(response);
                scientificAnnotation.setAutoComputeDataForField(source, 'objectValueInput');
            },
            error: function(jqXHR, exception){
                var errorTxt= sparql.getStandardErrorMessage(jqXHR, exception);
                scientificAnnotation.showErrorMessage(errorTxt);
            }
        });

        return source;
    },

    /**
     * Provide the data for the auto complete in the property field
     *
     * @param dbpedia.org URI as a subject if it was redefined as a class by the user. 'null' if subject is a literal.
     * @param URIs of superclasses of the subject class. 'null' if subject is a literal.
     * @returns {Array} an Array of properties and labels.
     */
    bindAutoCompleteProperty :function(selectedSubject, relatedClasses){
        if (!selectedSubject) selectedSubject = null; //optional parameter
        if (!relatedClasses) relatedClasses = null; //optional parameter
        var q = sparql.resource();
        var selectQuery;
        var getDefaultProperties = false;
        if (!selectedSubject) getDefaultProperties = true; // local search of non-dpedia properties
        if (getDefaultProperties) {
            selectQuery = 'SELECT distinct str(?p) as ?PROPERTY str(?label) as ?LABEL FROM  <'+sparql.GRAPH_NAME+'> ' +'\n'+
                                'WHERE ' +'\n'+
                                '{ ' +'\n\t'+
                                    '?p ' + q.label + ' ?label ' +'\n\t'+
                                    'FILTER(STRSTARTS(STR(?p), "'+sparql.PREFIX_SEMANNP+'"))' +'\n'+
                                '} ORDER BY fn:lower-case(?PROPERTY) LIMIT '+sparql.AUTO_COMPLETE_RESULT_LIMIT;
        } else { //used when the user defined the subject as a dbpedia class
            selectQuery = 'SELECT distinct ?PROPERTY ?LABEL' +'\n'+
                                'WHERE ' +'\n'+
                                '{ ' +'\n\t'+
                                    '{  <' +selectedSubject+ '> ?PROPERTY ?o. } ' +'\n\t';
            $.each(relatedClasses, function(i, item) {
                selectQuery = selectQuery + 
                                    'UNION {  ?PROPERTY rdfs:domain <' +item+ '>. } ' + '\n\t';
            });
            selectQuery = selectQuery + 
                                    '?PROPERTY rdfs:label ?LABEL. FILTER (lang(?LABEL) = "en")' +'\n'+
                                '}' +'\n'+
                                'ORDER BY fn:lower-case(?PROPERTY) LIMIT '+sparql.AUTO_COMPLETE_RESULT_LIMIT;
        }
        if (scientificAnnotation.DEBUG) console.log('Triggering query:\n' +selectQuery);
        
        $.ajax({
            type: "GET",
            url: sparql.SERVER_ADDRESS,
            data: {
                query: selectQuery,
                format: "application/json"
            },
            async: true,
            dataType: "jsonp",
            crossDomain: true,
            cache: false,
            success: function(response){
                var source = sparqlResponseParser.parseResource(response);
                if (getDefaultProperties) {
                    sparql.defaultProperties = source;
                } else {
                    scientificAnnotation.displayInfo("Found "+source.length+" related properties.", scientificAnnotation.DIV_PROPERTIES, true);
                }
                if (source.length > 0) {
                    scientificAnnotation.setAutoComputeDataForField(source, scientificAnnotation.INPUT_PROPERTY);
                } else { //no results, revert to default ones
                    scientificAnnotation.setAutoComputeDataForField(sparql.defaultProperties, scientificAnnotation.INPUT_PROPERTY);
                }
            },
            error: function(jqXHR, exception){
                var errorTxt= sparql.getStandardErrorMessage(jqXHR, exception);
                scientificAnnotation.showErrorMessage(errorTxt);
            }
        });
    },


    /**
     * Finds similar publications to the currently open pdf.
     *
     * @returns void
     */
    findSimilarFiles :function(){

        var q = sparql.resource();
        var selectQuery =
            'SELECT ?file ' +'\n'+
            'WHERE ' +'\n'+
            '{' +'\n\t'+
                'SELECT ?file ?s ?p ?o ?curr_o FROM <'+sparql.GRAPH_NAME+'> ' +'\n\t'+
                'WHERE ' +'\n\t'+
                '{' +'\n\t\t'+
                    '{' +'\n\t\t\t'+
                        q.File+' '+q.hasExcerpt+' ?curr_excerpt .' +'\n\t\t\t'+
                        '?curr_excerpt ?curr_prop ?curr_obj.' +'\n\t\t\t'+
                        '?curr_obj ' + q.label + ' ?curr_o.' +'\n\t\t'+
                    '}' +'\n\t\t'+
                    '{' +'\n\t\t\t'+
                        '?file '+q.hasExcerpt+' ?excerpt .' +'\n\t\t\t'+
                        '?excerpt ' + q.label + ' ?s. ?excerpt ?prop ?obj.' +'\n\t\t\t'+
                        '?prop ' + q.label + ' ?p.' +'\n\t\t\t'+
                        '?obj ' + q.label + ' ?o.' +'\n\t\t'+
                    '}' +'\n\t\t'+
                    'FILTER (?obj in (?curr_obj) and !sameTerm('+q.File+', ?file))' +'\n\t'+
                '}' +'\n'+
            '}' +'\n'+
            'GROUP BY ?file ' +'\n'+
            'ORDER BY DESC(count(?file))  LIMIT '+sparql.SIMILAR_RESULT_LIMIT ;

        var source = null;

        $.ajax({
            type: "GET",
            url: sparql.SERVER_ADDRESS,
            data: {
                query: selectQuery,
                format: "application/json"
            },
            async: true,
            dataType: "jsonp",
            crossDomain: true,
            cache: false,
            success: function(response){
                source = sparqlResponseParser.parseSimilarSearch(response);
                scientificAnnotation.hideProgressBar();
                scientificAnnotation.setSimilarSearchResult(source, scientificAnnotation.DIV_RECOMMENDER);
            },
            error: function(jqXHR, exception){
                var errorTxt= sparql.getStandardErrorMessage(jqXHR ,exception);
                scientificAnnotation.hideProgressBar();
                scientificAnnotation.showErrorMessage(errorTxt);
            }
        });

        return source;
    },

    /**
     * Return the camelCase of a sentences (Hello World --> helloWorld)
     *
     * @param {String} to apply camel casing on
     * @param {Boolean} defines whether first letter should be lower case or not
     * @returns {String} camel cased output
     */
    camelCase :function (str, isProperty){
        var result = str;
        result = result.toLowerCase().replace(/ (.)/g, function(match, group1) {
            return group1.toUpperCase();
        });
        if (!isProperty) result = result.charAt(0).toUpperCase() + result.substr(1); //for resources the first letter is in capital
        return  result;
    },
    
    /**
     * Return the URI of resources to be used in sparql queries.
     *
     * @param optional file fragment location 
     * @returns object with resources you can use in sparql queries.
     */
    resource :function (fragment) {

        var fileURI = sparql.PREFIX_FILE + encodeURI(document.title.toString());
        var excerptURI = fileURI + fragment;
        var hasExcerptURI = sparql.PREFIX_PUB + 'hasExcerpt';

        return {
            File:			'<'+fileURI+'>',
            hasExcerpt:	'<'+hasExcerptURI+'>',
            label:			'<'+sparql.PREFIX_RDFS+'label>',
            Publication:		'<'+sparql.PREFIX_PUB+'Publication>',
            Excerpt:		'<'+excerptURI+'>'
        }
    },

    /**
     * Return the standard error message if the server communication is failed with Virtuoso
     *
     * @param exception
     * @param jqXHR
     */
    getStandardErrorMessage:function(jqXHR, exception){
        var errorTxt = "Error occurred when sending data to the server: "+ sparql.SERVER_ADDRESS;

        if (jqXHR.status === 0) {
            errorTxt = errorTxt + '<br>Not connected. Verify network.';
        } else if (jqXHR.status == 404) {
            errorTxt = errorTxt + '<br>Request cannot be fulfilled by the server. Check whether the \n(a) sparql endpoint is available at the above address \n(b) query contains bad syntax.';
        } else if (jqXHR.status == 500) {
            errorTxt = errorTxt + '<br>Internal server error [500].';
        } else if (exception === 'parsererror') {
            errorTxt = errorTxt + '<br>Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            errorTxt = errorTxt + '<br>Timeout error.';
        } else if (exception === 'abort') {
            errorTxt = errorTxt + '<br>Ajax request aborted.';
        } else {
            errorTxt = errorTxt + '<br>Uncaught Error.\n' + jqXHR.responseText;
        }
        if (scientificAnnotation.DEBUG) console.error(errorTxt);
        return errorTxt;
    }
};
