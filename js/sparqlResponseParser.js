/**
Parse the json response form sqarql querey

 @dependency
 null
 */


var sparqlResponseParser  = {

    /**
     * Parse the json response form db and render the tabular view, while display available annotations
     * @param response
     */
    parseResponse:function(response){
	var fragments = [];
        $.each(response, function(name, value) {
            if(name == 'results'){
                $.each(value.bindings, function(index,item) {
                    scientificAnnotation.addDataToSparqlTableView(
                        item.SUBJECT.value,
                        item.PROPERTY.value,
                        item.OBJECT.value
                    );
		            fragments.push(sparqlResponseParser.getURLParameters(item.excerpt.value, "rangyFragment"));
                });
            }
        });
	return fragments;
    },

    /**
     * Parse the json response and return as array
     *
     * @param response
     * @returns {Array}
     */
    parseProperty:function(response) {

        var items = [];

        $.each(response, function(name, value) {
            if(name == 'results'){
                $.each(value.bindings, function(index,item) {
                    items.push(item.PROPERTY.value);
                });
            }
        });
        return items;
    },

    /**
     * Parse the json response and return as array
     *
     * @param response
     * @returns {Array}
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
     * @param response
     * @returns {Array}
     */
    parseObject:function(response) {

        var items = [];

        $.each(response, function(name, value) {
            if(name == 'results'){
                $.each(value.bindings, function(index,item) {
                    items.push(item.OBJECT.value);
                });
            }
        });
        return items;
    },
    
    /**
     * Filters out given URI parameter value from the sURL and returns the values as a string array.
     *
     * @param string, string
     * @returns array
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
    }

};

