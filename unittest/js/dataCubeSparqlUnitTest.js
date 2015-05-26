
/*global $:false, tableAnnotator:false, console:flase, scientificAnnotation :false,dataCubeSparql:false, confirm: false,
 progressbar : false, sparql:false, messageHandler:false, plusplus: false  */

/*jslint plusplus: true */
var dataCubeSparqlUnitTest = {


    /**
     * Sample data to to insert
     */
    sampleData : [
        ['columnHeader1', 'columnHeader2', 'columnHeader3'],
        ['Hello',         'World', 'Sample'],
        ['data',          'is', 'Inserted'],
        ['Hope',          'it', 'works']
    ],

    /**
     * Test all the main
     * @param QUnit
     * @return {void}
     */
    testDataCube : function (QUnit) {

        var temp_name = sparql.GRAPH_NAME_EIS;
        sparql.GRAPH_NAME_EIS = 'TestEisAnnotation';
        dataCubeSparql.addAnnotation(dataCubeSparqlUnitTest.sampleData, true);

        QUnit.test("Testing Dimension and property insertion", function (assert) {
            stop();
            expect(1);
            dataCubeSparqlUnitTest.isDimensionPropertyAvailable(assert);
                setTimeout(function () {
                start();
            }, 500);
        });

        QUnit.test("Testing Data set insertion", function (assert) {
            stop();
            expect(1);
            dataCubeSparqlUnitTest.isDataSetInserted(assert);
            setTimeout(function () {
                start();
            }, 500);
        });

        QUnit.test("Testing observation insertion", function (assert) {
            stop();
            expect(1);
            dataCubeSparqlUnitTest.isObserverInserted(assert);
            setTimeout(function () {
                start();
            }, 500);
        });

        QUnit.test("Testing column header insertion", function (assert) {
            stop();
            expect(1);
            dataCubeSparqlUnitTest.isColumnHeaderInserted(assert);
            setTimeout(function () {
                start();
            }, 500);
        });

        QUnit.test("Cleaning up the test database ", function (assert) {
            stop();
            expect(1);
            dataCubeSparqlUnitTest.clearGraph(sparql.GRAPH_NAME_EIS, assert);
            sparql.GRAPH_NAME_EIS = temp_name;
            setTimeout(function () {
                start();
            }, 500);
        });
    },

    /**
     * This test check if the inserted column header is available in the datacube
     * @param {Object} assert
     * @return {void}
     */
    isColumnHeaderInserted: function (assert) {
        var query =
                'prefix semann: <' + dataCubeSparql.PREFIX_SEMANN + '>' + '\n' +
                'prefix ex: <' + dataCubeSparql.PREFIX_EX + '>' + '\n' +
                'ASK ' + '\n' +
                '{' + '\n' +
                    'ex:table1SliceC1 semann:columnHeader "columnHeader1".' + '\n' +
                    'ex:table1SliceC2 semann:columnHeader "columnHeader2".' + '\n' +
                    'ex:table1SliceC3 semann:columnHeader "columnHeader3"' + '\n' +
                '}';

        $.ajax({
            type: "POST",
            url: sparql.SERVER_ADDRESS,
            data: {
                query: query,
                format: "application/json"
            },
            success: function (response) {
                assert.ok(response.boolean, 'Column header successfully inserted');
            },
            error: function (jqXHR, exception) {
                assert.ok(false, 'Column header was not inserted');
            }
        });
    },

    /**
     * Check if the inserted item rows available
     * Note: here we are checking the 1st rows is available or not
     * @param {Object} assert
     * @return {void}
     *
     */
    isObserverInserted: function (assert) {
        var query =
            'prefix semann: <' + dataCubeSparql.PREFIX_SEMANN + '>' + '\n' +
            'prefix ex: <' + dataCubeSparql.PREFIX_EX + '>' + '\n' +
            'ASK ' + '\n' +
            '{' + '\n' +
                'ex:table1R1C1 semann:value "Hello".' + '\n' +
                'ex:table1R1C2 semann:value "World".' + '\n' +
                'ex:table1R1C3 semann:value "Sample"' + '\n' +
            '}';

        $.ajax({
            type: "POST",
            url: sparql.SERVER_ADDRESS,
            data: {
                query: query,
                format: "application/json"
            },
            success: function (response) {
                assert.ok(response.boolean, 'Observation successfully inserted');
            },
            error: function (jqXHR, exception) {
                assert.ok(false, 'Failed to insert observation');
            }
        });
    },

    /**
     * Check if the data set is part of the table or not.
     * Here we are checking a row 1 and column 1 of the table 1
     * @param {Object} assert
     * @return {void}
     */
    isDataSetInserted: function (assert) {
        var query =
            'prefix qb: <' + dataCubeSparql.PREFIX_CUBE + '>' + '\n' +
            'prefix ex: <' + dataCubeSparql.PREFIX_EX + '>' + '\n' +
            'prefix ex: <' + dataCubeSparql.PREFIX_EX + '>' + '\n' +
            'ASK ' + '\n' +
            '{' + '\n' +
                'ex:table1R1C1 qb:dataSet ex:table1.' + '\n' +
            '}';

        $.ajax({
            type: "POST",
            url: sparql.SERVER_ADDRESS,
            data: {
                query: query,
                format: "application/json"
            },
            success: function (response) {
                assert.ok(response.boolean, 'Data Set Inserted success');
            },
            error: function (jqXHR, exception) {
                assert.ok(false, 'Failed to insert data set');
            }
        });
    },

    /**
     * Check if the dimensions property is available in the backend
     * @param {Object} assert
     * @return {void}
     */
    isDimensionPropertyAvailable: function (assert) {
        var query =
            'prefix qb: <' + dataCubeSparql.PREFIX_CUBE + '>' + '\n' +
                'prefix semann: <' + dataCubeSparql.PREFIX_SEMANN + '>' + '\n' +
                'ASK ' + '\n' +
                '{' + '\n' +
                    'semann:column ?o qb:DimensionProperty.' + '\n' +
                    'semann:row ?o qb:DimensionProperty.' + '\n' +
                    'semann:value ?o qb:MeasureProperty' + '\n' +
                '}';

        $.ajax({
            type: "POST",
            url: sparql.SERVER_ADDRESS,
            data: {
                query: query,
                format: "application/json"
            },
            success: function (response) {
                assert.ok(response.boolean, 'Dimension and property found success test data');
            },
            error: function (jqXHR, exception) {
                assert.ok(false, 'Failed to insert dimension and property');
            }
        });
    },

    /**
     * Clean up the test data base
     *
     * @param {string} graphName
     * @param {Object} assert
     * @return {void}
     */
    clearGraph : function (graphName, assert) {

        if (graphName === null || $.trim(graphName) === '') {
            return;
        }

        var query = "CLEAR GRAPH <" + graphName + ">";

        $.ajax({
            type: "POST",
            url: sparql.SERVER_ADDRESS,
            data: {
                query: query,
                format: "application/json"
            },

            success: function (response) {
                assert.ok(true, 'Successfully clean up test data');
            },

            error: function (jqXHR, exception) {
                assert.ok(false, 'Failed to clean up data');
            }
        });
    }
};