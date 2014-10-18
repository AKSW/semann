/**
 This file contain all the necessary sparql related queries,
 that need to perform.

 @authors : A Q M Saiful Islam, Jaana Takis
 @dependency
 {
    scientificAnnotation.js
    messageHandler.js
    progressbar.js
 }

 */

"use strict";
var sparql  = {

    SERVER_ADDRESS : "http://localhost:8890/sparql",
    GRAPH_NAME : 'http://eis.iai.uni-bonn.de/semann/graph',
    GRAPH_META_NAME : 'http://eis.iai.uni-bonn.de/semann/graph/meta',
    GRAPH_NAME_EIS : 'http://eis.iai.uni-bonn.de/semann/graph/cube',
    // annotation properties
    PREFIX_FILE : "http://eis.iai.uni-bonn.de/semann/pdf/",
    PREFIX_PUB : "http://eis.iai.uni-bonn.de/semann/publication/",
    PREFIX_RDFS : "http://www.w3.org/2000/rdf-schema#",
    PREFIX_SEMANN : "http://eis.iai.uni-bonn.de/semann/0.2/owl#",
    PREFIX_DC : "http://purl.org/dc/terms/",
    defaultProperties: [],
    // For showing similar search result, the maximum size of the list
    SIMILAR_RESULT_LIMIT : 10,
    // For auto complete property and object maximum size of the list
    AUTO_COMPLETE_RESULT_LIMIT : 200,
    
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
                messageHandler.showWarningMessage('User inputs got corrupted.');
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
                messageHandler.showWarningMessage('User inputs got corrupted.');
            }
            return isSuccess; //true if value got trimmed
        },
        
        emptyAll: function() {
            this.empty(scientificAnnotation.INPUT_SUBJECT);
            this.empty(scientificAnnotation.INPUT_PROPERTY);
            this.empty(scientificAnnotation.INPUT_OBJECT);
        }
        
    }, 

    
    /**
     * prepare an ajax call for contacting our local Virtuoso database. This allows us to make SPARQL queries.
     *
     * @param {String} query to be executed against the SPARQL endpoint
     * @return {jqXHR}
     */
    
    makeAjaxRequest: function(query) {
        var settings = {
            type: "POST",
            url: sparql.SERVER_ADDRESS,
            data: {
                query: query,
                format: "application/json"
            },
            async: true,
            dataType: "jsonp",
            crossDomain: true,
            cache: false,
            beforeSend: function() {
                progressbar.showProgressBar('Querying database...'); //before making the request, display progress bar
                return true; //make request
            }
        }
        // return deferred object
        return  $.ajax(settings)
                    .fail(function(jqXHR, exception) { //what to do in case of error
                        var errorTxt= sparql.getStandardErrorMessage(jqXHR, exception);
                        messageHandler.showErrorMessage(errorTxt);
                    })
                    .always(function() {
                        progressbar.hideProgressBar(); //after the request, hide progress bar
                    });
    },

    /**
     * Query for returning a list of user defined annotations.
     *
     * @return {String}
     */
    selectTriplesQuery: function (){

        var q = sparql.resource();
        var selectQuery = 'SELECT distinct str(?excerpt) as ?excerpt str(?SUBJECT) as ?SUBJECT str(?PROPERTY) as ?PROPERTY str(?OBJECT) as ?OBJECT FROM  <'+sparql.GRAPH_NAME+'> ' +'\n'+
            'WHERE' +'\n'+
            '{ ' +'\n\t'+
                q.Publication + ' '+ q.hasAnnotation + ' ?excerpt . ' +'\n\t'+
                '?excerpt ' + q.label + ' ?SUBJECT. ?excerpt ?prop ?obj. ' +'\n\t'+
                '?prop ' + q.label + ' ?PROPERTY. ' +'\n\t'+
                '?obj ' + q.label + ' ?OBJECT.' +'\n'+
            '}';
        if (scientificAnnotation.DEBUG) console.log(selectQuery);
        return selectQuery;
    },


    /**
     * Query for inserting user defined annotations. This combines multiple insert queries into one transaction.
     *
     * @param string start position of the annotation within the page
     * @param string end position of the annotation within the page
     * @param page number where annotation starts
     * @param serialised text position (rangy)
     *
     * @return {String}
     */
    insertQuery:function(charStart, charEnd, page, id){
        var length = (charEnd - charStart);
	    var fileFragment = '#page='+page+'?char='+charStart+'&length='+length+'&id='+id;
	    var q = sparql.resource(fileFragment);
        var insertQuery = sparql.insertTriplesQuery(q) + sparql.insertMetaQuery(q, page, charStart, length);
        return insertQuery;
    },
    
    
    /**
     * Query for inserting user defined annotations into the flat graph. 
     *
     * @param object of resource URIs
     * @return {String}
     */
    insertTriplesQuery:function(q){
        var isSuccess = true;
        //check that the triple is not corrupt
        if (scientificAnnotation.INPUT_SUBJECT.val() != sparql.triple.subject.label || scientificAnnotation.INPUT_PROPERTY.val() != sparql.triple.property.label || scientificAnnotation.INPUT_OBJECT.val() != sparql.triple.object.label) {
            var error = "Error! User defined triple values do not match globally stored ones.";
            if (scientificAnnotation.DEBUG) console.error(error);
            messageHandler.showErrorMessage(error,true);
            isSuccess = false;
            return null;
        }
        if (!sparql.triple.subject.label || !sparql.triple.property.label || !sparql.triple.object.label) {
            var error = "Error! Some or all of the user defined triple values are missing in the global variable.";
            if (scientificAnnotation.DEBUG) if (scientificAnnotation.DEBUG) console.error(error);
            messageHandler.showErrorMessage(error,true);
            isSuccess = false;
            return null;
        }
        var defineSubjectType = true;
        if (!sparql.triple.subject.uri) {
            defineSubjectType = false;
        }
        if (!sparql.triple.property.uri) {
            var localUri = sparql.PREFIX_PUB + sparql.camelCase(sparql.triple.property.label, true);
            sparql.triple.property.uri = localUri;
        }
        if (!sparql.triple.object.uri) {
            var localUri = sparql.PREFIX_PUB +sparql.camelCase(sparql.triple.object.label, false);
            sparql.triple.object.uri = localUri;
        }
        
        var insertQuery =
            'INSERT INTO GRAPH <'+sparql.GRAPH_NAME+'> ' +'\n'+
                '{ ' +'\n\t\t'+
                    q.Publication+' a ' +q.PublicationType+ ' ; '+'\n\t\t\t'+
                        q.label + ' "'+document.title.toString()+'"@en ; ' +'\n\t\t\t'+
                        q.hasAnnotation + ' '+ q.Annotation +' .'+'\n\t\t';
        if (defineSubjectType) {
            insertQuery = insertQuery + 
                    q.Annotation +' a <' +sparql.triple.subject.uri+ '> .' + '\n\t\t';
        }
        insertQuery = insertQuery +
                    q.Annotation+' a ' +q.AnnotationType+ ' ; '+'\n\t\t\t'+
                        q.label + ' "'+sparql.triple.subject.label+'"@en ; ' +'\n\t\t\t'+
                        '<'+sparql.triple.property.uri +'> <'+sparql.triple.object.uri+'> .'+'\n\t\t'+
                    '<'+sparql.triple.property.uri+'>  a ' + q.isAnnotationProperty +' ; \n\t\t\t'+
                        q.label + ' "'+sparql.triple.property.label+'"@en . '+'\n\t\t'+
                    '<'+sparql.triple.object.uri+'> a ' + q.AnnotationObject +' ;\n\t\t\t'+
                        q.label + ' "'+sparql.triple.object.label+'"@en . '+'\n'+
                '}' ;
        
        if (scientificAnnotation.DEBUG) console.log(insertQuery);
        return insertQuery;
    },
    
    /**
     * Query for inserting information about annotations into the tree graph.
     *
     * @param object of resource URIs
     * @param page number where annotation starts
     * @param string start position of the annotation within the page
     * @param length of the annotation
     * @return {String}
     */
    insertMetaQuery:function(q, page, charStart, length){
        var insertQuery =
            'INSERT' +'\n'+
            '{' + '\n\t'+
                'GRAPH <' + sparql.GRAPH_META_NAME + '> { ?parent ' + q.hasPart + ' ' + q.Annotation + ' . }' + '\n'+
            '}' + '\n'+
            'WHERE' + '\n'+
            '{' + '\n\t'+
                'SELECT ?parent' + '\n\t'+
                'FROM <' +sparql.GRAPH_NAME+ '>' + '\n\t'+
                'WHERE' + '\n\t'+
                '{' + '\n\t\t'+
                    '?file a ' + q.PublicationType+ ' .\n\t\t'+
                    'OPTIONAL {' + '\n\t\t\t'+
                        '?file ' + q.hasAnnotation+ ' ?f .\n\t\t\t'+
                        '?f a ' + q.AnnotationType+ ' .\n\t\t\t'+
                        'FILTER (?charStart <= ?currentStart)' + '\n\t\t\t'+
                        'FILTER (?length >= ?currentLength)' + '\n\t\t\t'+
                        'FILTER (?page = ?currentPage)' + '\n\t\t\t'+
                        'FILTER (?padding > 0)' + '\n\t\t\t'+
                        'BIND (' +charStart+ ' as ?currentStart)' + '\n\t\t\t'+
                        'BIND (' +length+ ' as ?currentLength)' + '\n\t\t\t'+
                        'BIND (' +page+ ' as ?currentPage)' + '\n\t\t\t'+
                        'BIND (STRDT(STRBEFORE(STRAFTER(STR(?f), "length="), ","), xsd:integer) as ?length)' + '\n\t\t\t'+
                        'BIND (STRDT(STRBEFORE(STRAFTER(STR(?f), "page="), "?"), xsd:integer) as ?page)'+ '\n\t\t\t'+
                        'BIND (STRDT(STRBEFORE(STRAFTER(STR(?f), "char="), ","), xsd:integer) as ?charStart)'+ '\n\t\t\t'+
                        'BIND (?currentStart-?charStart+?length-?currentLength as ?padding)'+ '\n\t\t'+
                    '}' + '\n\t\t'+
                    'FILTER (?file = ' + q.Publication + ')' + '\n\t\t'+
                    'BIND (COALESCE(?f, ?file) as ?parent)' + '\n\t'+
                '}' + '\n\t'+
                'ORDER BY ASC(?padding) LIMIT 1' + '\n'+
            '}';
        if (scientificAnnotation.DEBUG) console.log(insertQuery);
        return insertQuery;
    },
    
    /**
     * Query for returning semann properties.
     *
     * @return {String}
     */

    selectDefaultPropertiesQuery: function() {
        var q = sparql.resource();
        var selectQuery = 'SELECT distinct str(?p) as ?PROPERTY str(?label) as ?LABEL FROM  <'+sparql.GRAPH_NAME+'> ' +'\n'+
                                'WHERE ' +'\n'+
                                '{ ' +'\n\t'+
                                    '?p a ' + q.isAnnotationProperty +' .\n\t'+
                                    '?p ' + q.label + ' ?label .' +'\n'+
                                '} ORDER BY fn:lower-case(?label) LIMIT '+sparql.AUTO_COMPLETE_RESULT_LIMIT;
        if (scientificAnnotation.DEBUG) console.log('Triggering query:\n' +selectQuery);
        return selectQuery;
    },
    
    /**
     * Query for returning dbpedia.org ontology properties.
     *
     * @param {String} dbpedia.org URI
     * @param {Array} of superclass URIs if you would like to include the properties from there as well
     * @returns {String}
     */
    
    selectResourcePropertiesQuery: function(selectedSubject, relatedClasses) {
        var q = sparql.resource();
        var selectQuery = 'SELECT distinct ?PROPERTY ?LABEL' +'\n'+
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
                            'ORDER BY fn:lower-case(?LABEL) LIMIT '+sparql.AUTO_COMPLETE_RESULT_LIMIT;
        if (scientificAnnotation.DEBUG) console.log('Triggering query:\n' +selectQuery);
        return selectQuery;
    },
    

    /**
     * Query for returning a list of recommendations.
     *
     * @return {String}
     */
    selectRecommendationsQuery :function(){

        var q = sparql.resource();
        var selectQuery =
            'SELECT ?file ' +'\n'+
            'WHERE ' +'\n'+
            '{' +'\n\t'+
                'SELECT ?file ?s ?p ?o ?curr_o FROM <'+sparql.GRAPH_NAME+'> ' +'\n\t'+
                'WHERE ' +'\n\t'+
                '{' +'\n\t\t'+
                    '{' +'\n\t\t\t'+
                        q.Publication+' '+q.hasAnnotation+' ?curr_excerpt .' +'\n\t\t\t'+
                        '?curr_excerpt ?curr_prop ?curr_obj.' +'\n\t\t\t'+
                        '?curr_obj ' + q.label + ' ?curr_o.' +'\n\t\t'+
                    '}' +'\n\t\t'+
                    '{' +'\n\t\t\t'+
                        '?file '+q.hasAnnotation+' ?excerpt .' +'\n\t\t\t'+
                        '?excerpt ' + q.label + ' ?s. ?excerpt ?prop ?obj.' +'\n\t\t\t'+
                        '?prop ' + q.label + ' ?p.' +'\n\t\t\t'+
                        '?obj ' + q.label + ' ?o.' +'\n\t\t'+
                    '}' +'\n\t\t'+
                    'FILTER (?obj in (?curr_obj) and !sameTerm('+q.Publication+', ?file))' +'\n\t'+
                '}' +'\n'+
            '}' +'\n'+
            'GROUP BY ?file ' +'\n'+
            'ORDER BY DESC(count(?file))  LIMIT '+sparql.SIMILAR_RESULT_LIMIT ;
        if (scientificAnnotation.DEBUG) console.log('Triggering query:\n' +selectQuery);
        return selectQuery;
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
        var annotationURI = fileURI + fragment;

        return {
            Publication:			        '<'+fileURI+'>',
            PublicationType:		    '<'+sparql.PREFIX_SEMANN+'Publication>',
            Annotation:		            '<'+annotationURI+'>',
            AnnotationType:		    '<'+sparql.PREFIX_SEMANN+'Annotation>',
            AnnotationObject:		'<'+sparql.PREFIX_SEMANN + 'AnnotationObject'+'>',
            hasAnnotation:	        '<'+sparql.PREFIX_SEMANN + 'hasAnnotation'+'>',
            isAnnotationProperty:   '<'+sparql.PREFIX_SEMANN + 'isAnnotationProperty'+'>',
            hasPart:                    '<'+sparql.PREFIX_DC + 'hasPart'+'>',
            label:			                '<'+sparql.PREFIX_RDFS+'label>'
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
