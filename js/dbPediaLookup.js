/**
 This file contain all the necessary DBpedia Lookup (https://github.com/dbpedia/lookup) related queries,

 @authors : Jaana Takis, AQM Saiful Islam
 @dependency
 {
    scientificAnnotation.js
    progressbar.js
    messageHandler.js
 }
 */

var dbPediaLookup  = {

    SERVICE_ADDRESS : "http://lookup.dbpedia.org/api/search/",
    REQUEST_TYPE_AUTO_SEARCH : "PrefixSearch",
    REQUEST_TYPE_QUERY_CLASS : "KeywordSearch",
    PARAM_STRING: "QueryString",
    PARAM_CLASS: "QueryClass",
    PARAM_MAXHITS: "MaxHits",
    MAX_HITS_COUNT: 5,
    dbResponse: null,
    dbSubjectResponse: null,
    dbObjectResponse: null,

    /**
     * cache the dbpedia lookup searched result
     */
    lookUpResult : {},
    /**
     * prepare an ajax call for contacting DBpedia Lookup service. This allows us to transform literals into classes.
     *
     * @param {String} keyword to be passed on as a parameter to the service
     *
     * @return {object}
     */

    getResources: function(keyword, queryClass) {

        if (keyword === null || keyword === '') {
            return dbPediaLookup.parseResponse(null);
        }

        if (dbPediaLookup.isNumeric(keyword) || (queryClass && queryClass === dbPediaLookupUIOptions.CLASS_NO_SELECTION)) {
            return {
                URIs     : [keyword],
                labels   : [keyword],
                classUri : [keyword]
            }
        }

        var lookupResponseOutput = null;

        var queryParameters = dbPediaLookup.queryParametersForAutoSearch(keyword);
        if(queryClass && queryClass !== dbPediaLookupUIOptions.CLASS_AUTO_SELECTION) {
            queryParameters = dbPediaLookup.queryParametersForQueryClass(keyword, queryClass);
        }

        var settings = {
            type: "GET",
            url: dbPediaLookup.SERVICE_ADDRESS + queryParameters,
            async: false,
            dataType: "json",
            cache: false,
            beforeSend: function(xhr) {
                xhr.withCredentials = true;
            }
        }
        $.ajax(settings)
            .fail(function(jqXHR, exception) { //what to do in case of error
                messageHandler.showErrorMessage('Auto search is currenty not avaialble. Please try manual search.');
                progressbar.hideProgressBar();
                lookupResponseOutput = dbPediaLookup.parseResponse(null);

            })
            .success(function(response) {
                lookupResponseOutput = dbPediaLookup.parseResponse(response);
            });

        return lookupResponseOutput;
    },

    /**
     * Return the URL parameters to be used in auto search querying.
     *
     * @param {string} searchKey search key
     *
     * @returns {string} query parameter
     */
    queryParametersForAutoSearch :function (searchKey) {
        var parameters = dbPediaLookup.REQUEST_TYPE_AUTO_SEARCH + '?' + dbPediaLookup.PARAM_MAXHITS + '=' + dbPediaLookup.MAX_HITS_COUNT + '&' + dbPediaLookup.PARAM_STRING + "=" + encodeURIComponent(searchKey);
        return parameters;
    },

    /**
     * Return the URL parameters to be used in class search querying.
     *
     * @param {string} searchKey search key
     * @param {string} className class name where to search
     *
     * @returns {string} query parameter
     */
    queryParametersForQueryClass :function (searchKey, className) {
        var parameters = dbPediaLookup.REQUEST_TYPE_QUERY_CLASS + '?' + dbPediaLookup.PARAM_CLASS + '=' + className + '&' + dbPediaLookup.PARAM_STRING + "=" + encodeURIComponent(searchKey);
        return parameters;
    },

    /**
     * Parse the response the return the URIs with their label
     *
     * @param {JSON} response object.
     *
     * @return String containing formatted DBpedia response,
     */
    parseResponse : function(response){

        var uris = [], uriLabels = [], classUri = [], uriContents = null ;

        if (response === null || response.results.length === 0) {

            return {
                URIs:       [''],
                labels:     [''],
                classUri:   ['']
             }
        }

        if (response.results.length > 0) {

            $.each(response.results, function(i, item) {
                uris.push(item.uri);
                uriLabels.push(item.label);
                classUri.push(dbPediaLookup.getClassUri(item.classes));
            });

            return {
                URIs:       uris,
                labels:     uriLabels,
                classUri:   classUri
            }
        }
    },

    /**
     * fetches data associated with key = "classes" from json response based on given filter.
     * @param JSON object
     * @return {string} class uri
     */
    getClassUri : function(classlist){

        if ($.isEmptyObject(classlist)) {
            return '';
        }
        return classlist[0].uri;
    },

    /**
     * Clear the looked up cache
     */
    clearDbPediaLookupResultCache : function() {
        dbPediaLookup.lookUpResult = {};
        dbPediaLookupUIOptions.searchKeyValueRadioInputMap = {};
        dbPediaLookupUIOptions.IS_AUTO_SEARCHED_TRIGGERED_YET = false;
    },

    /**
     * Is string is a number or not
     * @param n
     * @returns {boolean}
     */
    isNumeric : function (n) {

        if (n === undefined || n === null) {
            return false;
        }
        // keeping only the numbers and all other chars will be replaced
        n = n.replace(/[^\d\.]/g, '');
        return $.isNumeric(n);
    }
};
