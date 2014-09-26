/**
 This file contain all the necessary sparql related queries,
 that need to perform.

 @authors : A Q M Saiful Islam
 @dependency
 {
    scientificAnnotation.js
    highlight.js
 }
 */

/*global scientificAnnotation :false, tableAnnotator: false,
progressbar : false, sparql:false, messageHandler:false, plusplus: false  */

/*jslint plusplus: true */

var dataCubeSparql  = {

    // annotation prefixes
    PREFIX_CUBE     : "http://purl.org/linked-data/cube#",
    PREFIX_DCT      : "http://purl.org/dc/terms/",
    PREFIX_RDF      : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    PREFIX_RDFS     : "http://www.w3.org/2000/01/rdf-schema#",
    PREFIX_XSD      : "http://www.w3.org/2001/XMLSchema#",
    PREFIX_SEMANN   : "http://eisAnnotation/#",
    PREFIX_EX       : "http://example.org/ns#",
    PREFIX_DCTERMS  : "http://purl.org/dc/terms/",

    TABLE_NAME      : 'table' + tableAnnotator.TABLE_ANNOTATION_COUNT,

    /**
     * prepare and send the ajax request for add annotation as a data cube
     * @param selectedTableCellTexts
     *
     * @return void
     */
    addAnnotation: function (selectedTableCellTexts, isCallForTesting) {

        var isCallForTesting = isCallForTesting || false;

        if ($.isEmptyObject(selectedTableCellTexts)) {
            return;
        }

        var selectedColumns = selectedTableCellTexts[0].length,
            query = '';

        progressbar.showProgressBar('Adding annotation to the selected table...');
        query =
            'prefix qb: <' + dataCubeSparql.PREFIX_CUBE + '>' + '\n' +
            'prefix dct: <' + dataCubeSparql.PREFIX_DCT + '>' + '\n' +
            'prefix rdf: <' + dataCubeSparql.PREFIX_RDF + '>' + '\n' +
            'prefix rdfs: <' + dataCubeSparql.PREFIX_RDFS + '>' + '\n' +
            'prefix xsd: <' + dataCubeSparql.PREFIX_XSD + '>' + '\n' +
            'prefix semann: <' + dataCubeSparql.PREFIX_SEMANN + '>' + '\n' +
            'prefix ex: <' + dataCubeSparql.PREFIX_EX + '>' + '\n' +
            'prefix dcterms: <' + dataCubeSparql.PREFIX_DCTERMS + '>' + '\n' +

            'INSERT IN ' + '<' + sparql.GRAPH_NAME_EIS + '> ' + '\n' +
            '{ ' + '\n' +

                dataCubeSparql.getDataSet(selectedColumns) + '\n' +
                dataCubeSparql.assignDimensionPropertyToTable() + '\n' +
                dataCubeSparql.getDataStructureDefinition() + '\n' +
                dataCubeSparql.getObservationsWithSlices(selectedTableCellTexts) + '\n' +

            '}';

//        console.log(query);
//        return;

        $.ajax({
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
            success: function (response) {

                if (isCallForTesting) {
                    return;
                }

                scientificAnnotation.hideAnnotationDisplayTable();
                progressbar.hideProgressBar();
                messageHandler.showSuccessMessage('Table annotation successfully added');
                tableAnnotator.TABLE_ANNOTATION_COUNT++;
                tableAnnotator.storedData = null;
            },
            error: function (jqXHR, exception) {

                if (isCallForTesting) {
                    return;
                }

                var errorTxt = sparql.getStandardErrorMessage(jqXHR, exception);
                progressbar.hideProgressBar();
                messageHandler.showErrorMessage(errorTxt);
            }
        });
    },

    /**
     * Return the document URI with name
     * @returns {string}
     */
    getDocumentURI : function () {
        var pageNumber = '#page=' + $('#pageNumber').val(),
            tableName = '?name=' + dataCubeSparql.TABLE_NAME,
            documentURI = sparql.PREFIX_FILE + encodeURI(document.title.toString()) + pageNumber + tableName;
        return documentURI;
    },

    /**
     * Return the standard error message if the server communication is failed
     *
     * @param exception
     * @param jqXHR
     */
    getStandardErrorMessage : function (jqXHR, exception) {
        var errorTxt = "Error occurred when sending data to the server: " + sparql.SERVER_ADDRESS;

        if (jqXHR.status === 0) {
            errorTxt = errorTxt + '<br>Not connected. Verify network.';
        } else if (jqXHR.status === 404) {
            errorTxt = errorTxt + '<br>Request cannot be fulfilled by the server. Check whether the <br />(a) sparql endpoint is available at the above address <br>(b) query contains bad syntax.';
        } else if (jqXHR.status === 500) {
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

        return errorTxt;
    },

    /**
     * Return the data set fo the data cube structure
     * @param {int} selectedColumns
     * @param {int} tableNameCounter
     * @returns {string}
     */
    getDataSet: function (selectedColumns) {

        var slices = '', i = 0,
            query = '',
            documentURI = dataCubeSparql.getDocumentURI();
        for (i = 0; i < selectedColumns; i++) {
            slices += 'ex:' + dataCubeSparql.TABLE_NAME + 'SliceC' + (i + 1) + ',';
        }
        slices = slices.substring(0, slices.length - 1);
        query =
            'ex:' + dataCubeSparql.TABLE_NAME + ' a qb:DataSet ;' + '\n' +
            'dct:isPartOf <' + documentURI + '> ;' + '\n' +
            'qb:structure ex:dsd' + dataCubeSparql.TABLE_NAME + ' ;' + '\n' +
            'qb:slice ' + slices + ' .' + '\n\n';
        return query;
    },

    /**
     * Assign the dimension and the property
     * @returns {string}
     */
    assignDimensionPropertyToTable : function () {

        var query =
            'ex:' + dataCubeSparql.TABLE_NAME + 'Row a rdf:Property, qb:DimensionProperty ;' + '\n' +
                'rdfs:subPropertyOf semann:row .' + '\n' +

                'ex:' + dataCubeSparql.TABLE_NAME + 'Column a rdf:Property, qb:DimensionProperty ;' + '\n' +
                'rdfs:subPropertyOf semann:column .' + '\n' +

                'ex:slice' + dataCubeSparql.TABLE_NAME + 'ByRow a qb:SliceKey ;' + '\n' +
                'rdfs:label "slice by row"@en ;' + '\n' +
                'rdfs:comment "slice by grouping rows together, fixing a column value"@en ;' + '\n' +
                'qb:componentProperty ex:' + dataCubeSparql.TABLE_NAME + 'Column .' + '\n';

        return query;
    },

    /**
     * Return the structure of the data cube
     * @returns {string}
     */
    getDataStructureDefinition: function () {
        var query =
            'ex:dsd' + dataCubeSparql.TABLE_NAME + ' a qb:DataStructureDefinition ;' + '\n' +
            'qb:component [ qb:dimension ex:' + dataCubeSparql.TABLE_NAME + 'Row ; qb:order 1 ];' + '\n' +
            'qb:component [ qb:dimension ex:' + dataCubeSparql.TABLE_NAME + 'Column ;qb:order 2 ];' + '\n' +
            'qb:component [ qb:measure semann:value ] ;' + '\n' +
            'qb:sliceKey ex:slice' + dataCubeSparql.TABLE_NAME + 'ByRow .' + '\n\n';

        return query;
    },

    /**
     * Get the observation and column slices based on selection
     * @param selectedTableCellTexts
     * @returns {string}
     */
    getObservationsWithSlices: function (selectedTableCellTexts) {

        var observationTitle = '', columnNames =  selectedTableCellTexts[0],
            observationQuery = '', i = 0, j = 0, index = 0, query = '', sliceRowList = '';

        for (i = 0; i < columnNames.length; i++) {
            index = (i + 1);
            query += 'ex:' + dataCubeSparql.TABLE_NAME + 'SliceC' + index + ' a qb:Slice ; ' + '\n' +
                'qb:sliceStructure ex:sliceTable1ByRow ; ' + '\n' +
                'semann:columnHeader "' + columnNames[i] + '" ; ' + '\n' +
                'ex:' + dataCubeSparql.TABLE_NAME + 'Column ' + index + ' ;' + '\n';

            sliceRowList = '';
            observationQuery = '';

            // skipping the 1st row as that is the column header
            for (j = 1; j < selectedTableCellTexts.length; j++) {
                observationTitle = 'ex:' + dataCubeSparql.TABLE_NAME + 'R' + j + 'C' + (i + 1);

                observationQuery +=
                    observationTitle + ' a qb:Observation ;' + '\n' +
                    'qb:dataSet ex:' + dataCubeSparql.TABLE_NAME + ' ;' + '\n' +
                    'ex:' + dataCubeSparql.TABLE_NAME + 'Row ' + j + ' ;' + '\n' +
                    'ex:' + dataCubeSparql.TABLE_NAME + 'Column ' + (i + 1) + ' ;' + '\n' +
                    'semann:value "' + selectedTableCellTexts[j][i] + '" .' + '\n\n';

                sliceRowList += observationTitle + ',';
            }

            // remove the last comma from the string;
            sliceRowList = sliceRowList.substring(0, sliceRowList.length - 1);

            // adding the rows to slice definition
            query += 'qb:observation ' + sliceRowList + '.' + '\n\n';

            // adding the observation to each slices
            query += observationQuery;
        }

        return query;
    }
};