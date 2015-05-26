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
    DBPEDIA_SERVER_ADDRESS : "http://dbpedia.org/sparql",
    
    GRAPH_NAME : 'http://eis.iai.uni-bonn.de/semann/graph/evaluation',
    GRAPH_META_NAME : 'http://eis.iai.uni-bonn.de/semann/graph/meta/evaluation',
    
    //GRAPH_NAME : 'http://eis.iai.uni-bonn.de/semann/graph',
    //GRAPH_META_NAME : 'http://eis.iai.uni-bonn.de/semann/graph/meta',
    
    GRAPH_NAME_EIS : 'http://eis.iai.uni-bonn.de/semann/graph/cube',
    GRAPH_DBPEDIA : 'http://dbpedia.org',
    GRAPH_RULES : 'http://eis.iai.uni-bonn.de/semann/0.2/rules',
    // annotation properties
    PREFIX_FILE : "http://eis.iai.uni-bonn.de/semann/pdf/",
    PREFIX_PUB : "http://eis.iai.uni-bonn.de/semann/publication/",
    PREFIX_RDFS : "http://www.w3.org/2000/rdf-schema#",
    PREFIX_SEMANN : "http://eis.iai.uni-bonn.de/semann/0.2/owl#",
    PREFIX_DC : "http://purl.org/dc/terms/",
    ONTOLOGY_SDEO : "http://eis.iai.uni-bonn.de/semann/0.2/sdeo",
    defaultProperties: [],
    // For showing similar search result, the maximum size of the list
    SIMILAR_RESULT_LIMIT : 10,
    // For auto complete property and object maximum size of the list
    AUTO_COMPLETE_RESULT_LIMIT : 200,
    ontologies: {}, //holds all ontologies
    recommendations: { papers: {} }, //holds all recommendations
    
    triple: { //holds triple SPO values to be added into the database. Comes with convenience methods
        
        "subject": {"uri": null, "label": null, "info":{}},
        "property": {"uri": null, "label": null},
        "object": {"uri": null, "label": null, "info":null},
        
        empty: function(inputObject) {
            var tripleObject, drawObject;
            var isSuccess = false;
            if (inputObject.is(scientificAnnotation.INPUT_SUBJECT)) {
                tripleObject = "subject";
                drawObject = scientificAnnotation.DIV_DRAWING_SUBJECT;
            } else if (inputObject.is(scientificAnnotation.INPUT_PROPERTY)) {
                tripleObject = "property";
                drawObject = scientificAnnotation.DIV_DRAWING_PROPERTY;
            } else if (inputObject.is(scientificAnnotation.INPUT_OBJECT)) {
                tripleObject = "object";
                drawObject = scientificAnnotation.DIV_DRAWING_OBJECT;
            }
            if (sparql.triple[tripleObject]) {
                sparql.triple[tripleObject].uri = null;
                sparql.triple[tripleObject].label = null;
                if (sparql.triple[tripleObject].info) sparql.triple[tripleObject].info = {};
                inputObject.val('');
                drawObject.html('');
                isSuccess = true;
            } else {
                if (scientificAnnotation.DEBUG) console.warn("Failed to empty triple value due to unexpected input. Only the following input elements are allowed: "+[scientificAnnotation.INPUT_SUBJECT.attr('id'), scientificAnnotation.INPUT_PROPERTY.attr('id'), scientificAnnotation.INPUT_OBJECT.attr('id')].toString());
                messageHandler.showWarningMessage('User inputs got corrupted.');
            }
            return isSuccess; //true if operation was successful
        },
        
        set: function(inputObject, uriValue) {
            if (!uriValue) uriValue = null; //optional parameter
            var isSuccess = false;
            var labelValue = $.trim(inputObject.val());
            var wasTrimmed = (labelValue === inputObject.val())? false : true;
            var tripleObject, drawObject;
            if (inputObject.is(scientificAnnotation.INPUT_SUBJECT)) {
                tripleObject = "subject";
                drawObject = scientificAnnotation.DIV_DRAWING_SUBJECT;
            } else if (inputObject.is(scientificAnnotation.INPUT_PROPERTY)) {
                tripleObject = "property";
                drawObject = scientificAnnotation.DIV_DRAWING_PROPERTY;
            } else if (inputObject.is(scientificAnnotation.INPUT_OBJECT)) {
                tripleObject = "object";
                drawObject = scientificAnnotation.DIV_DRAWING_OBJECT;
            }
            if (sparql.triple[tripleObject]) {
                sparql.triple[tripleObject].uri = uriValue;
                if (jQuery.isEmptyObject(sparql.triple[tripleObject].info)) {
                    sparql.triple[tripleObject].label = labelValue.replace(/\"/g, '\\"'); //escape quotation marks
                }
                if (wasTrimmed) inputObject.val(labelValue);
                sparql.updateDrawing(drawObject, uriValue);
                isSuccess = true;
            } else {
                if (scientificAnnotation.DEBUG) console.warn("Failed to set triple value due to unexpected input. Only the following input elements are allowed: "+[scientificAnnotation.INPUT_SUBJECT.attr('id'), scientificAnnotation.INPUT_PROPERTY.attr('id'), scientificAnnotation.INPUT_OBJECT.attr('id')].toString());
                messageHandler.showWarningMessage('User inputs got corrupted.');
            }
            return isSuccess; //true if value got trimmed
        },
        
        setInfo: function(inputObject, rangyObject, selectionText) {
            var tripleObject;
            if (inputObject.is(scientificAnnotation.INPUT_SUBJECT)) {
                tripleObject = "subject";
            } else if (inputObject.is(scientificAnnotation.INPUT_OBJECT)) {
                tripleObject = "object";
            }
            if (sparql.triple[tripleObject]) {
                if (!jQuery.isEmptyObject(rangyObject)) sparql.triple[tripleObject].info = rangyObject;
                if (selectionText)  sparql.triple[tripleObject].label = selectionText.replace(/\"/g, '\\"'); //escape quotation marks
            } else {
                if (scientificAnnotation.DEBUG) console.warn("Failed to set triple information. Only the following input elements are allowed: "+[scientificAnnotation.INPUT_SUBJECT.attr('id'), scientificAnnotation.INPUT_OBJECT.attr('id')].toString());
                messageHandler.showWarningMessage('User inputs got corrupted.');
            }
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
     * @param {String} optional sponge parameter of the request. E.g. "soft"
     * @return {jqXHR}
     */
    
    makeAjaxRequest: function(query, sponge) {
        if (!sponge) sponge = "";
        var settings = {
            type: "POST",
            url: sparql.SERVER_ADDRESS,
            data: {
                query: query,
                format: "application/json",
                "should-sponge": sponge
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
                '?excerpt ' + q.label + ' ?SUBJECT. ' +'\n\t'+
                'OPTIONAL {' +'\n\t\t'+
                    '?excerpt ?prop ?obj .' +'\n\t\t'+
                    '?prop ' + q.label + ' ?PROPERTY. ' +'\n\t\t'+
                    '?obj ' + q.label + ' ?OBJECT.' +'\n\t'+
                '}' +'\n'+
            '} LIMIT 1000';
        if (scientificAnnotation.DEBUG) console.log(selectQuery);
        return selectQuery;
    },


    /**
     * Query for executing a transaction that inserts user defined annotations and performs some data cleaning.
     *
     * @param serialised text position (rangy)
     * @return {String}
     */
    insertQuery:function(){
        var objectFragment;
        var subject = sparql.triple.subject.info;
	    var subjectFragment = '#page='+subject.page+'?char='+subject.start+','+subject.end+'&id='+subject.domPosition;
        var object = sparql.triple.object.info;
	    if (!jQuery.isEmptyObject(object)) objectFragment = '#page='+object.page+'?char='+object.start+','+object.end+'&id='+object.domPosition;
	    var q = sparql.resource(subjectFragment, objectFragment);
        var insertTransaction = sparql.insertTriplesQuery(q) + sparql.deleteMetaQuery(q) + sparql.insertMetaFlatQuery(q) + sparql.insertMetaTreeQuery(q);
        return insertTransaction;
    },
    
    
    /**
     * Query for inserting user defined annotation details. 
     *
     * @param object of resource URIs
     * @return {String}
     */
    insertTriplesQuery:function(q){
        var isSuccess = true;
        var hasClassificationOnly = (sparql.triple.subject.label && !sparql.triple.property.label && !sparql.triple.object.label) ? true : false;
        var hasTriple = (sparql.triple.subject.label && sparql.triple.property.label && sparql.triple.object.label) ? true : false;
        var hasAllowedValues = (hasClassificationOnly || hasTriple) ? true : false;
        if (!hasAllowedValues) {
            var error = "Error! This is not an allowed input.";
            if (scientificAnnotation.DEBUG) if (scientificAnnotation.DEBUG) console.error(error);
            messageHandler.showErrorMessage(error,true);
            isSuccess = false;
            return null;
        }
        var defineSubjectType = false;
        var defineObjectType = false;
        var objectIsAnnotation = false;
        if (sparql.triple.subject.uri) {
            defineSubjectType = true;
        }
        if (!jQuery.isEmptyObject(sparql.triple.object.info)) {
            objectIsAnnotation = true;
        }
        if (objectIsAnnotation && sparql.triple.object.uri) {
            defineObjectType = true;
        }        
        
        var insertQuery = "";
        if (hasTriple) {
            insertQuery =
                'INSERT INTO GRAPH <'+sparql.GRAPH_NAME+'> ' +'\n'+
                    '{ ' +'\n\t'+
                        q.Publication+' a ' +q.PublicationType+ ' ; '+'\n\t\t\t'+
                                                q.label + ' "'+document.title.toString()+'"@en ; ' +'\n\t\t\t';
            if (objectIsAnnotation) {
                insertQuery = insertQuery +
                                                q.hasAnnotation + ' '+ q.AnnotationObject +' ;'+'\n\t\t\t';
            }
            insertQuery = insertQuery +
                                                q.hasAnnotation + ' '+ q.Annotation +' .'+'\n\t';
            insertQuery = insertQuery +
                        q.Annotation+' a ' +q.AnnotationType+ ' ; '+'\n\t\t\t';
            if (defineSubjectType) {
                insertQuery = insertQuery + 
                                                ' a <' +sparql.triple.subject.uri+ '> ;' + '\n\t\t\t';
            }
            insertQuery = insertQuery +
                                                q.label + ' "'+sparql.triple.subject.label+'"@en ; ' +'\n\t\t\t' +
                                                '<'+sparql.triple.property.uri +'> '+q.AnnotationObject+' .'+'\n\t'+
                        '<'+sparql.triple.property.uri+'>  a ' + q.isAnnotationProperty +' ; \n\t\t\t'+
                                                q.label + ' "'+sparql.triple.property.label+'"@en . '+'\n\t'+
                        q.AnnotationObject+' a ' + q.AnnotationObjectType +' ;\n\t\t\t';
            if (defineObjectType) {
                insertQuery = insertQuery +
                                                ' a <' +sparql.triple.object.uri+ '> ;' + '\n\t\t\t';
            }
            insertQuery = insertQuery +
                                                q.label + ' "'+sparql.triple.object.label+'"@en . '+'\n'+
                    '}' ;
        }
        if (hasClassificationOnly) {
             insertQuery =
                    'INSERT INTO GRAPH <'+sparql.GRAPH_NAME+'> ' +'\n'+
                    '{ ' +'\n\t'+
                        q.Publication+' a ' +q.PublicationType+ ' ; '+'\n\t\t\t'+
                                                q.label + ' "'+document.title.toString()+'"@en ; ' +'\n\t\t\t' +
                                                q.hasAnnotation + ' '+ q.Annotation +' .'+'\n\t' +
                        q.Annotation+' a ' +q.AnnotationType+ ' ; '+'\n\t\t\t';
            if (defineSubjectType) {
                insertQuery = insertQuery + 
                                                ' a <' +sparql.triple.subject.uri+ '> ;' + '\n\t\t\t';
            }
            insertQuery = insertQuery +
                                                q.label + ' "'+sparql.triple.subject.label+'"@en . ' + '\n' +
                    '}';
        }
        if (scientificAnnotation.DEBUG) console.log(insertQuery);
        return insertQuery;
    },
    
    /**
     * Query for inserting annotations into the tree graph as leaf nodes of root (ie. flat tree diagram)
     *
     * @param object of resource URIs
     * @return {String}
     */
    insertMetaFlatQuery:function(q){
        var insertQuery =
            'INSERT' +'\n'+
            '{' + '\n\t'+
                'GRAPH <' + sparql.GRAPH_META_NAME + '> { ?p_file ' + q.hasPart + ' ?annotation . }' + '\n'+
            '}' + '\n'+
            'FROM <' +sparql.GRAPH_NAME+ '>' + '\n'+
            'WHERE' + '\n'+
            '{' + '\n\t'+
                '?p_file ' +q.hasAnnotation+ ' ?annotation .' + '\n\t'+
                'FILTER (?p_file = ' +q.Publication+ ')' + '\n'+
            '}';
        if (scientificAnnotation.DEBUG) console.log(insertQuery);
        return insertQuery;
    },
    
    /**
     * Query for ontology loading (use with soft sponger requests)
     *
     * @param {String} URL of ontology to load into database
     * @return {String}
     */
    loadOntology:function(ontologyURL){
        var selectQuery =
            'SELECT COUNT(*) as ?count FROM <' +ontologyURL+ '> WHERE {?s ?p ?o}';
        if (scientificAnnotation.DEBUG) console.log(selectQuery);
        return selectQuery;
    },
    
    /**
     * Query for retrieving a list of ontology classes with their labels and comments.
     *
     * @param {String} URL of ontology to load into database
     * @return {String}
     */
    selectOntologyClasses:function(ontologyURL){
        var selectQuery =
            'SELECT distinct ?class ?classLabel ?classComment' + '\n'+
            'FROM <' +ontologyURL+ '>' + '\n'+
            'WHERE {' + '\n\t'+
                '{ ?class a <http://www.w3.org/2002/07/owl#Class>. }' + '\n\t'+
                'UNION { ?class a <http://www.w3.org/2000/01/rdf-schema#Class>. }' + '\n\t'+
                '{' + '\n\t\t'+
                    'OPTIONAL { ' + '\n\t\t\t'+
                        '?class rdfs:label ?classLabel .' + '\n\t\t\t'+
                        'FILTER (langMatches(lang(?classLabel),"en") || lang(?classLabel) = "" )' + '\n\t\t\t'+
                        '?class rdfs:comment ?classComment .' + '\n\t\t\t'+
                        'FILTER (langMatches(lang(?classComment),"en") || lang(?classComment) = "" )' + '\n\t\t'+
                    '}' + '\n\t'+
                '}' + '\n'+
            '}';
        if (scientificAnnotation.DEBUG) console.log(selectQuery);
        return selectQuery;
    },
    
    /**
     * Query for retrieving a list of property classes with their labels, comments, ranges, domains.
     *
     * @param {String} URL of ontology to load into database
     * @return {String}
     */
    selectOntologyProperties:function(ontologyURL){
        var selectQuery =
            'SELECT distinct ?property ?propertyLabel ?propertyComment ?domain ?range' + '\n'+
            'FROM <' +ontologyURL+ '>' + '\n'+
            'WHERE {' + '\n\t'+
		'{ ?property a <http://www.w3.org/1999/02/22-rdf-syntax-ns#Property> . }' + '\n\t'+
		'UNION { ?property a <http://www.w3.org/2002/07/owl#ObjectProperty> . }' + '\n\t'+
		'UNION { ?property a <http://www.w3.org/2002/07/owl#TransitiveProperty> . }' + '\n\t'+
		'UNION { ?property a <http://www.w3.org/2002/07/owl#SymmetricProperty> . }' + '\n\t'+
                '{' + '\n\t\t'+
                    'OPTIONAL { ' + '\n\t\t\t'+
                        '?property rdfs:label ?propertyLabel .' + '\n\t\t\t'+
                        'FILTER (langMatches(lang(?propertyLabel),"en") || lang(?propertyLabel) = "" )' + '\n\t\t'+
                    '}' + '\n\t\t'+
                    'OPTIONAL { ' + '\n\t\t\t'+
                        '?property rdfs:comment ?propertyComment .' + '\n\t\t\t'+
                        'FILTER (langMatches(lang(?propertyComment),"en") || lang(?propertyComment) = "" )' + '\n\t\t'+
                    '}' + '\n\t\t'+
                    'OPTIONAL { ' + '\n\t\t\t'+
                        '?property <http://www.w3.org/2000/01/rdf-schema#domain> ?domain .' + '\n\t\t'+
                    '}' + '\n\t\t'+
                    'OPTIONAL { ' + '\n\t\t\t'+
                        '?property <http://www.w3.org/2000/01/rdf-schema#range> ?range .' + '\n\t\t'+
                    '}' + '\n\t'+
                '}' + '\n'+
            '}';
        if (scientificAnnotation.DEBUG) console.log(selectQuery);
        return selectQuery;
    },
    
    /**
     * Query for inserting annotations into the tree graph.
     *
     * @param object of resource URIs
     * @return {String}
     */
    insertMetaTreeQuery:function(q){
        var insertQuery =
            'INSERT' +'\n'+
            '{' + '\n\t'+
                'GRAPH <' + sparql.GRAPH_META_NAME + '> { ?parent ' +q.hasPart+ ' ?child . }' + '\n'+
            '}' + '\n'+
            'FROM <' +sparql.GRAPH_NAME + '>' + '\n'+
            'WHERE' + '\n'+
            '{' + '\n\t'+
                '{' + '\n\t\t'+
                    'SELECT ?child MIN(?padding) as ?minPadding' + '\n\t\t'+
                    'WHERE' + '\n\t\t'+
                    '{' + '\n\t\t\t'+
                        '?child a ' +q.AnnotationType+ ' .' + '\n\t\t\t'+
                        '?parent a ' +q.AnnotationType+ ' .' + '\n\t\t\t'+
                        '?file ' +q.hasAnnotation+ ' ?child .' + '\n\t\t\t'+
                        '?file ' +q.hasAnnotation+ ' ?parent .' + '\n\t\t\t'+
                        'FILTER (?PcharStart <= ?CcharStart AND ?PcharEnd >= ?CcharEnd)' + '\n\t\t\t'+
                        'FILTER (?padding > 0)' + '\n\t\t\t'+
                        'BIND (STRBEFORE(STRAFTER(STR(?child), "char="), "&") as ?CcharParam)' + '\n\t\t\t'+
                        'BIND (STRDT(STRBEFORE(?CcharParam, ","), xsd:integer) as ?CcharStart)' + '\n\t\t\t'+
                        'BIND (STRDT(STRAFTER(?CcharParam, ","), xsd:integer) as ?CcharEnd)' + '\n\t\t\t'+
                        'BIND (STRBEFORE(STRAFTER(STR(?parent), "char="), "&") as ?PcharParam)' + '\n\t\t\t'+
                        'BIND (STRDT(STRBEFORE(?PcharParam, ","), xsd:integer) as ?PcharStart)' + '\n\t\t\t'+
                        'BIND (STRDT(STRAFTER(?PcharParam, ","), xsd:integer) as ?PcharEnd)' + '\n\t\t\t'+
                        'BIND (?CcharStart-?PcharStart+?PcharEnd-?CcharEnd as ?padding)' + '\n\t\t\t'+
                        'FILTER (?file = ' +q.Publication+ ')' + '\n\t\t'+
                    '}' + '\n\t'+
                '}' + '\n\t'+
                '{' + '\n\t\t'+
                    '?parent a <http://eis.iai.uni-bonn.de/semann/0.2/owl#Annotation> .' + '\n\t\t'+
                    '?file ' +q.hasAnnotation+ ' ?child .' + '\n\t\t'+
                    '?file ' +q.hasAnnotation+ ' ?parent .' + '\n\t\t'+
                    'FILTER (?PcharStart <= ?CcharStart AND ?PcharEnd >= ?CcharEnd)' + '\n\t\t'+
                    'FILTER (?padding = ?minPadding)' + '\n\t\t'+
                    'BIND (STRBEFORE(STRAFTER(STR(?child), "char="), "&") as ?CcharParam)' + '\n\t\t'+
                    'BIND (STRDT(STRBEFORE(?CcharParam, ","), xsd:integer) as ?CcharStart)' + '\n\t\t'+
                    'BIND (STRDT(STRAFTER(?CcharParam, ","), xsd:integer) as ?CcharEnd)' + '\n\t\t'+
                    'BIND (STRBEFORE(STRAFTER(STR(?parent), "char="), "&") as ?PcharParam)' + '\n\t\t'+
                    'BIND (STRDT(STRBEFORE(?PcharParam, ","), xsd:integer) as ?PcharStart)' + '\n\t\t'+
                    'BIND (STRDT(STRAFTER(?PcharParam, ","), xsd:integer) as ?PcharEnd)' + '\n\t\t'+
                    'BIND (?CcharStart-?PcharStart+?PcharEnd-?CcharEnd as ?padding)' + '\n\t'+
                '}' + '\n'+
            '}';
        if (scientificAnnotation.DEBUG) console.log(insertQuery);
        return insertQuery;
    },
    
    
    /**
     * Deletes all triples that are referring to the specified file from the meta graph.
     *
     * @param object of resource URIs
     * @return {String}
     */
    deleteMetaQuery:function(q){
        var deleteQuery =   'DELETE { GRAPH <' + sparql.GRAPH_META_NAME + '> { ?s ?p ?annotation .}}' +'\n'+
                                    'WHERE ' +'\n'+
                                    '{ ' +'\n\t'+
                                    'GRAPH <' + sparql.GRAPH_META_NAME + '> { ?s ?p ?annotation . }' +'\n\t'+
                                    'GRAPH <' + sparql.GRAPH_NAME + '> { ?p_file '+ q.hasAnnotation+' ?annotation . }' +'\n\t'+
                                    'FILTER (?p_file = ' + q.Publication + ')' +'\n'+
                                    '} ';
        if (scientificAnnotation.DEBUG) console.log('Triggering query:\n' +deleteQuery);
        return deleteQuery;
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
     * Query for returning a list of recommendations where DBpedia resources share the same SKOS category.
     *
     * @return {String}
     */
    selectRecommendationsBySKOSCategoryQuery :function(){
        var q = sparql.resource();
        var selectQuery =
            'SELECT distinct ?curr_a ?curr_aType ?file ?a ?aType ?curr_category ?category_label ?fileLabel ?aLabel' +'\n'+
            'WHERE' +'\n'+
            '{' +'\n\t'+
                'GRAPH <' +sparql.GRAPH_NAME+ '> {' +'\n\t\t'+
                    '?curr_file ' +q.hasAnnotation + ' ?curr_a .' +'\n\t\t'+
                    '?curr_a a ?curr_aType .' +'\n\t\t'+
                    'FILTER (?curr_file = ' +q.Publication+ ')' +'\n\t\t'+
                    'FILTER (STRSTARTS(STR(?curr_aType), "' +sparql.GRAPH_DBPEDIA+ '"))' +'\n\t\t'+
                '}' +'\n\t'+
                'GRAPH <' +sparql.GRAPH_NAME+ '> {' +'\n\t\t'+
                    '?file ' +q.hasAnnotation + ' ?a .' +'\n\t\t'+
                    //'?file <http://www.w3.org/2000/rdf-schema#label> ?fileLabel .' +'\n\t\t'+
                    '?a a ?aType .' +'\n\t\t'+
                    //'?a <http://www.w3.org/2000/rdf-schema#label> ?aLabel .' +'\n\t\t'+
                    'FILTER (STRSTARTS(STR(?aType), "' +sparql.GRAPH_DBPEDIA+ '")) ' + '\n\t\t'+
                '}' +'\n\t'+
                'FILTER (!sameTerm(?curr_file, ?file))' +'\n\t'+
                'FILTER (!sameTerm(?curr_aType, ?aType))' +'\n\t'+
                '?file <http://www.w3.org/2000/rdf-schema#label> ?fileLabel .' +'\n\t\t'+
                '?a <http://www.w3.org/2000/rdf-schema#label> ?aLabel .' +'\n\t\t'+
                'GRAPH <' +sparql.GRAPH_DBPEDIA+ '> {' +'\n\t\t'+
                    '?curr_aType <http://purl.org/dc/terms/subject> ?curr_category .' +'\n\t\t'+
                    '?aType <http://purl.org/dc/terms/subject> ?curr_category .' +'\n\t\t'+
                    'OPTIONAL {?curr_category <http://www.w3.org/2004/02/skos/core#prefLabel> ?category_label . }' + '\n\t'+
                '}' +'\n'+
            '}';
        if (scientificAnnotation.DEBUG) console.log('Triggering query:\n' +selectQuery);
        return selectQuery;
    },
    
    /**
     * Query for returning a list of recommendations which share the same DBpedia resources.
     *
     * @return {String}
     */
    selectRecommendationsByDBpediaQuery :function(){
        var q = sparql.resource();
        var selectQuery =
            'SELECT ?curr_a ?aType ?a ?file ?fileLabel ?aLabel' +'\n'+
            'FROM <' +sparql.GRAPH_NAME+ '>' +'\n'+
            'WHERE' +'\n'+
            '{' +'\n\t'+
                '?curr_file ' +q.hasAnnotation+ ' ?curr_a .' +'\n\t'+
                '?curr_a a ?aType .' +'\n\t'+
                '?file ' +q.hasAnnotation+ ' ?a .' +'\n\t'+
                '?file <http://www.w3.org/2000/rdf-schema#label> ?fileLabel .' +'\n\t'+
                '?a a ?aType .' +'\n\t'+
                '?a <http://www.w3.org/2000/rdf-schema#label> ?aLabel .' +'\n\t'+
                'FILTER (STRSTARTS(STR(?aType), "' +sparql.GRAPH_DBPEDIA+ '")) ' +'\n\t'+
                'FILTER (?curr_file = ' +q.Publication+ ')' +'\n\t'+
                'FILTER (!sameTerm(?curr_file, ?file))' +'\n'+
            '}';
        if (scientificAnnotation.DEBUG) console.log('Triggering query:\n' +selectQuery);
        return selectQuery;
    },
    
    /**
     * Query for returning a common parent SDEO ontology context between 2 annotations from different papers. Includes inferencing
     * @param {Array} a pair of annotations for which to find shared context
     * @return {String}
     */
    selectCommonContextQuery :function(annotationPair){
        var q = sparql.resource();
        var selectQuery =
            //'DEFINE input:inference "' +sparql.GRAPH_RULES+ '"' +'\n'+
            'SELECT DISTINCT ?parent ?parentType ?thisParent ?label ?annotation ?thisAnnotation' +'\n'+
            'FROM <' +sparql.GRAPH_NAME+ '>' +'\n'+
            'FROM <' +sparql.GRAPH_META_NAME+ '>' +'\n'+
            'FROM <' +sparql.ONTOLOGY_SDEO+ '>' +'\n'+
            'WHERE' +'\n'+
            '{' +'\n\t'+
                '{' +'\n\t\t'+
                    '?parent <http://purl.org/dc/terms/hasPart> ?annotation .' +'\n\t\t'+
                    '?parent a ?parentType .' +'\n\t\t'+
                    '?parentType <http://www.w3.org/2000/01/rdf-schema#isDefinedBy> <' +sparql.ONTOLOGY_SDEO+ '> .' +'\n\t\t'+
                    '?thisParent <http://purl.org/dc/terms/hasPart>* ?thisAnnotation .' +'\n\t\t'+
                    '?thisParent a ?parentType .' +'\n\t'+
                    'FILTER (?annotation = <' +annotationPair[0]+ '>)' +
                    'FILTER (?thisAnnotation = <' +annotationPair[1]+ '>)' +
                '}' +'\n\t'+
                '{ ?parent <http://www.w3.org/2000/rdf-schema#label> ?label. }' +'\n'+
            '}';
        //if (scientificAnnotation.DEBUG) console.log('Triggering query:\n' +selectQuery);
        return selectQuery;
    },
    
    /**
     * Updates the triple drawing in UI to reflect the state of triple values
     *
     * @param {Element} to apply updates on
     * @param {String} sets the URI of the resource
     * @returns     void
     */
    updateDrawing :function (drawingElement, uri){
        if (uri) {
            var uriArray = uri.split("/");
            var display = "<a href='" + uri + "' target='_blank'>" + uriArray[uriArray.length-1] + "</a>";
            drawingElement.html(display);
        } else {
            drawingElement.html("");
        }
    },
    
    /**
     * Test whether URL is valid.
     *
     * @param {String} URL
     * @returns {Boolean} true if valid
     */
    validateURL: function (url) {
      var urlregex = new RegExp(
            "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
      return urlregex.test(url);
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
     * @param optional subject annotation id 
     * @param optional object annotation id 
     * @returns object with resources you can use in sparql queries.
     */
    resource :function (subjectFragment, objectFragment) {
        var annotationObjectType = sparql.PREFIX_SEMANN + 'AnnotationObject';
        var fileURI = sparql.PREFIX_FILE + encodeURI(document.title.toString());
        var annotationURI, annotationObjectURI;
        if (!sparql.triple.property.uri && sparql.triple.property.label) {
            var localUri = sparql.PREFIX_PUB + sparql.camelCase(sparql.triple.property.label, true);
            sparql.triple.property.uri = localUri;
        }
        if (!sparql.triple.object.uri && sparql.triple.object.label) {
            var localUri = sparql.PREFIX_PUB +sparql.camelCase(sparql.triple.object.label, false);
            sparql.triple.object.uri = localUri;
        }
        if (sparql.triple.object.uri) annotationObjectURI = sparql.triple.object.uri; //object is not another annotation
        if (subjectFragment) annotationURI = fileURI + subjectFragment;
        if (objectFragment) { //object is another annotation
            annotationObjectURI = fileURI + objectFragment;
            annotationObjectType = sparql.PREFIX_SEMANN+'Annotation';
        }

        return {
            Publication:			        '<'+fileURI+'>',
            PublicationType:		    '<'+sparql.PREFIX_SEMANN+'Publication>',
            Annotation:		            '<'+annotationURI+'>',
            AnnotationType:		    '<'+sparql.PREFIX_SEMANN+'Annotation>',
            AnnotationObject:		'<'+annotationObjectURI+'>',
            AnnotationObjectType: '<'+annotationObjectType+'>',
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
