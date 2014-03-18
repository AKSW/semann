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
		            fragments.push(highlight.getURLParameters(item.excerpt.value, "rangyFragment"));
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
    }

};

