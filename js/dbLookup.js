/**
 This file contain all the necessary DBpedia Lookup (https://github.com/dbpedia/lookup) related queries,

 @authors : Jaana Takis
 @dependency
 {
    scientificAnnotation.js
 }

 */

"use strict";
var dbLookup  = {
    SERVICE_ADDRESS : "http://lookup.dbpedia.org/api/search/KeywordSearch",
    PARAM_CLASS: "QueryClass",
    PARAM_STRING: "QueryString",
    PARAM_MAXHITS: "MaxHits",
    dbResponse: null,
    dbSubjectResponse: null,
    dbObjectResponse: null,
    
    /**
     *Query data from DBpedia Lookup service and display in given element
     * @param {String} keyword that is queried 
     * @param {Object} element where to display the results from the query
     * @return void
     */
    showDataFromDBlookup:function (keyword, targetInfoElement){
        progressbar.showProgressBar('Querying DBpedia Lookup...');
        if (test.NO_INTERNET) return test.bypassAjaxCall(targetInfoElement); //remove from production
        var queryParameters = dbLookup.queryParameters(keyword, null, null);
        if (queryParameters) {
            var url = dbLookup.SERVICE_ADDRESS+"?"+queryParameters;
            if (scientificAnnotation.DEBUG) console.log("Contacting " + url);
            $.ajax({
                type: 'GET',
                url: url,
                //below is needed to force JSON requests against DBpedia Lookup service
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                dataType: 'json',
                xhrFields: {
                    withCredentials: false
                },
                headers: {
                },
                success: function(response) {
                    // Here's where you handle a successful response.
                    //if (scientificAnnotation.DEBUG) console.log("Success. Returned results: "+response.results.length);
                    //if (scientificAnnotation.DEBUG) console.log(JSON.stringify(response, null, 4));
                    if (targetInfoElement.is(scientificAnnotation.DIV_SUBJECTS)) {
                        dbLookup.dbSubjectResponse = response;
                    } else if (targetInfoElement.is(scientificAnnotation.DIV_OBJECTS)) {
                        dbLookup.dbObjectResponse = response;
                    }
                    var message = dbLookup.formatResponse(response, targetInfoElement);
                    if (message) {
                        messageHandler.displayInfo(message, targetInfoElement);
                    } else {
                        messageHandler.displayInfo("No matches found in DBpedia.org.", targetInfoElement, true);
                    }
                    progressbar.hideProgressBar();
                },
                error: function(jqXHR, exception){
                    var errorTxt= dbLookup.getStandardErrorMessage(jqXHR ,exception);
                    scientificAnnotation.showErrorMessage(errorTxt);
                    if (scientificAnnotation.DEBUG) console.log(errorTxt);
                    progressbar.hideProgressBar();
                }
            });
        }
    },
    
    /**
     * Return the URI parameters to be used in querying.
     *
     * @param triple subject as a string for which a DBpedia URI should be found. 
     * @param optional DBpedia class from ontology that the results should have.
     * @param optional maximum number of returned results (default: 5).
     * @returns object with resources you can use in dbLookup queries.
     */
    queryParameters :function (qString, qClass, qMaxHits) {
        var parameters;
        if (qString) {
            parameters = dbLookup.PARAM_STRING + "=" + encodeURIComponent(qString);
        } else {
            var error = "Cannot query DBpedia Lookup service - keyword is missing!";
            if (scientificAnnotation.DEBUG) console.error(error);
            scientificAnnotation.showErrorMessage(error, isHide);
            return null;
        }
        if (qClass) {
            parameters = parameters +  "&" + dbLookup.PARAM_CLASS + "=" + encodeURIComponent(qClass);
        }
        if (qMaxHits  && qMaxHits > 0) {
            parameters = parameters +  "&" + dbLookup.PARAM_MAXHITS + "=" + qMaxHits;
        }
        //if (scientificAnnotation.DEBUG) console.log("DBpedia Lookup service's query parameters: " + parameters);
        return parameters;
    },

    /**
     * Show the returned results from DBpedia Lookup in the div #displaySubjectURI.
     * @param JSON response object.
     * @return String containing formated DBpedia response,
     */
    formatResponse : function(response, targetInfoElement){
        if (response.results.length > 0) {
            var htmlTemplate;
            if (targetInfoElement.is(scientificAnnotation.DIV_SUBJECTS)) {
                htmlTemplate = "<a href='#href' onclick='dbLookup.getSubjectBindings(this, #onclick); return false;' target='_blank' title='#description'>#label #classes</a>";
            }
            if (targetInfoElement.is(scientificAnnotation.DIV_OBJECTS)) {
                htmlTemplate = "<a href='#href' onclick='dbLookup.getObjectBindings(#onclick); return false;' target='_blank' title='#description'>#label #classes</a>";
            }
            if (!htmlTemplate) { 
                console.error('No html template defined for element ID = "'+targetInfoElement.attr("id")+'"');
                scientificAnnotation.showErrorMessage('There are results from they query but no element with the name "'+targetInfoElement.attr("id")+'" to display it in.',true);
                return null;
            }
            var html = "";
            var br = "";
            $.each(response.results, function(i, item) {
                var uriClasses = dbLookup.getUriClasses(item.classes, "dbpedia.org");
                var classes = "";
                if (uriClasses.labels.length > 0) classes = "[" + uriClasses.labels.join(', ') + "]";
                html += br;
                html = html + htmlTemplate.replace("#href", item.uri).replace("#description", item.description).replace("#label", item.label).replace("#classes", classes).replace("#onclick", i);
                br = "</br>"
            });
            if (html.length > 0) html = "Is this the same as any of the below?<br/>" + html;
            return html;
        } else {
            return null;
        }
    },
    
    /**
     * fetches data associated with key = "classes" from json response based on given filter.
     * @param JSON object
     * @param String to filter uri values for, eg. "dbpedia.org"
     * @return object containing URI and label arrays for the filtered data.
     */
    getUriClasses : function(classlist, filterDomain){
        var classURIs = [];
        var classLabels = [];
        $.each(classlist, function(i, item) {
            if (filterDomain && item.uri.toLowerCase().indexOf(filterDomain) >= 0) {
                classURIs.push(item.uri);
                classLabels.push(item.label);
            }
        });
        //if (classLabels.length > 0) classLabels = "[" + classLabels + "]";
        //if (scientificAnnotation.DEBUG) console.log("classURIs: " + classURIs.toString());
        return {
            URIs:       classURIs,
            labels:     classLabels,
        }
    },
    
    /**
     * Prepares necessary data before binding of URIs to its properties can take place.
     * @param refers to results[index] in JSON object dbSubjectResponse, initialised when user selects a subject from the list.
     * @return false, avoids opening the selected <href\> link in the browser.
     */
    getSubjectBindings : function(selection, index){
        var sourceElement = $(selection).closest('div'); //looking for 
        var targetElement;
        var selectedResource;
        if (sourceElement.is(scientificAnnotation.DIV_SUBJECTS)) {
            targetElement = scientificAnnotation.INPUT_SUBJECT;
            selectedResource = dbLookup.dbSubjectResponse.results[index];
            if (scientificAnnotation.DEBUG) console.log("User selected subject URI = " + selectedResource.uri);
        }
        if (targetElement) {
            sparql.triple.set(targetElement, selectedResource.uri);
            sparql.triple.empty(scientificAnnotation.INPUT_PROPERTY);
            sparql.triple.empty(scientificAnnotation.INPUT_OBJECT);
        }
        scientificAnnotation.DIV_OBJECTS.hide();
		var relatedClasses = dbLookup.getUriClasses(selectedResource.classes, "dbpedia.org").URIs;
		sparql.bindAutoCompleteProperty(selectedResource.uri, relatedClasses);
		return false;
    },
    
    /**
     * Function is called when user selects on one of the suggested resource links for objects. Sets object uri value of a triple.
     * @param refers to results[index] in JSON object dbObjectResponse, initialised when user selects a subject from the list.
     * @return false, avoids opening the selected <href\> link in the browser.
     */
    getObjectBindings : function(index){
		var selectedResource = dbLookup.dbObjectResponse.results[index].uri;
		if (scientificAnnotation.DEBUG) console.log("User selected object URI = " + selectedResource);
        sparql.triple.set(scientificAnnotation.INPUT_OBJECT, selectedResource);
		return false;
    },
    
    /**
     * Return the standard error message if the server communication is failed
     *
     * @param exception
     * @param jqXHR
     */
    getStandardErrorMessage:function(jqXHR, exception){
        var errorTxt = "Error occurred when sending data to the server: "+ dbLookup.SERVICE_ADDRESS;

        if (jqXHR.status === 0) {
            errorTxt = errorTxt + '<br>Not connected. Verify network.';
        } else if (jqXHR.status == 404) {
            errorTxt = errorTxt + '<br>Request cannot be fulfilled by the server. Check whether the \n(a) DBpedia Lookup Service is available at the above address \n(b) query contains bad syntax.';
        } else if (jqXHR.status == 500) {
            errorTxt = errorTxt + '<br>Internal server error [500].';
        } else if (exception === 'parsererror') {
            errorTxt = errorTxt + '<br>Requested JSON parse failed, possibly due to no results being returned.';
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
