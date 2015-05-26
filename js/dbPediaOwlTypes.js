/**
 This file contain all the necessary DBpedia Lookup (https://github.com/dbpedia/lookup) related queries,

 @authors : AQM Saiful Islam
 @dependency
 {
    progressbar.js
    messageHandler.js
 }
 */

var dbPediaOwlType  = {

    /**
     * cache the dbPedia owl class typ
     */
    owlClassList : {},

    /**
     * Load the list of ontology classes from dbpedia.org to support user selection for search vocabularies.
     *
     * @return {void}
     */

    loadClasses: function() {

        if (!$.isEmptyObject(dbPediaOwlType.owlClassList)){
            return;
        }

        progressbar.showProgressBar('Please wait a moment!! Loading owl class types from dbpedia.org');

        var selectQuery = "SELECT distinct str(LCASE(?label)) as ?name, ?type " + '\n' +
            "WHERE " + '\n' +
                "{ " + '\n' +
                    "?type a owl:Class . " + '\n' +
                    "?type rdfs:label  ?label " + '\n' +
                    "FILTER (lang(?label) = 'en') " + '\n' +
                "}" + '\n' +
            "Order by (str(LCASE(?name)))";
        $.ajax({
            type: "POST",
            url: sparql.DBPEDIA_SERVER_ADDRESS,
            data: {
                query: selectQuery,
                format: "application/json"
            },
            success: function(response){
                dbPediaOwlType.parseResponse(response);
                progressbar.hideProgressBar();
            },
            error: function(jqXHR, exception){
                var errorTxt= messageHandler.getStandardErrorMessage(jqXHR,exception,sparql.DBPEDIA_SERVER_ADDRESS);
                progressbar.hideProgressBar();
                messageHandler.showErrorMessage(errorTxt);
            }
        });
    },

    /**
     * Parse the response the return the URIs with their label
     *
     * @param {JSON} response object.
     *
     * @return String containing formatted DBpedia response,
     */
    parseResponse : function(response){

        var typeName = '', typeUri = '';

        $.each(response, function(name, value) {
            if(name == 'results'){
                dbPediaOwlType.owlClassList[dbPediaLookupUIOptions.CLASS_NO_SELECTION] = dbPediaLookupUIOptions.CLASS_NO_SELECTION;
                dbPediaOwlType.owlClassList[dbPediaLookupUIOptions.CLASS_CUSTOM_SELECTION] = dbPediaLookupUIOptions.CLASS_CUSTOM_SELECTION;
                dbPediaOwlType.owlClassList[dbPediaLookupUIOptions.CLASS_AUTO_SELECTION] = dbPediaLookupUIOptions.CLASS_AUTO_SELECTION;
                $.each(value.bindings, function(index,item) {
                    typeName = dbPediaOwlType.capitalise(item.name.value);
                    typeUri = item.type.value;
                    if (typeUri.indexOf('http://dbpedia.org')!== -1 && dbPediaOwlType.owlClassList[typeName] === undefined) {
                        dbPediaOwlType.owlClassList[typeName] = typeUri;
                    }
                });
            }
        });
    },

    /**
     * Capitalize as camel case
     * @param string
     * @returns {string}
     */
    capitalise : function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
};
