
/*global $:false, tableAnnotator:false, console:flase, scientificAnnotation :false,dataCubeSparql:false, confirm: false,
 progressbar : false, sparql:false, messageHandler:false, plusplus: false  */

/*jslint plusplus: true */
var tableAnnotationUnitTest = {

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
     * Raw html elements that has been stored after the user select via mouse
     * it will be used to simulate the user selection
     */
    sampleHTMLSelectedData :
        '<div  style=" left: 231.529px; top: 224.672px;"  data-font-name="g_font_9_0" data-canvas-width="89.93345064926147">Column1</div>' +
            '<div  style=" left: 555.429px; top: 224.672px;"  data-font-name="g_font_9_0" data-canvas-width="89.93345064926147">Column2</div>' +
            '<div  style=" left: 879.529px; top: 224.672px;"  data-font-name="g_font_9_0" data-canvas-width="89.93345064926147">Column3</div>' +
            '<div  style=" left: 120.202px; top: 262.79px;"  data-font-name="g_font_9_0" data-canvas-width="53.63092751312256">Hello</div>' +
            '<div  style=" left: 444.101px; top: 262.79px;"  data-font-name="g_font_9_0" data-canvas-width="61.71428933143616">World</div>' +
            '<div  style=" left: 768px; top: 262.79px;"  data-font-name="g_font_9_0" data-canvas-width="42.88538066482545">This</div>' +
            '<div  style=" left: 120.202px; top: 300.706px;" data-font-name="g_font_9_0" data-canvas-width="17.280001012802124">Is</div>' +
            '<div  style=" left: 444.101px; top: 300.706px;" data-font-name="g_font_9_0" data-canvas-width="46.97546493816375">awesome</div>' +
            '<div  style=" left: 768px; top: 300.706px;"  data-font-name="g_font_9_0" data-canvas-width="161.86084982299803">Programming!</div>' +
            '<div  style=" left: 120.202px; top: 338.823px;"  data-font-name="g_font_9_0" data-canvas-width="33.5193296957016">We</div>' +
            '<div  style=" left: 444.101px; top: 338.823px;"  data-font-name="g_font_9_0" data-canvas-width="59.0763059835434">Could</div>' +
            '<div  style=" left: 768px; top: 338.823px;"  data-font-name="g_font_9_0" data-canvas-width="35.50386762714386">Do</div>',

    /**
     * Test all the main test of the selection of table
     * @param QUnit
     * @return {void}
     */
    testTableAnnotation : function (QUnit) {

        QUnit.test("Testing user selected items validation", function (assert) {
            stop();
            expect(5);
            tableAnnotationUnitTest.testUserSelectionValidation(assert);
            setTimeout(function () {
                start();
            }, 500);
        });

        QUnit.test("Testing user selected parse data", function (assert) {
            stop();
            expect(3);
            tableAnnotationUnitTest.testUserSelectedInfo(assert);
            setTimeout(function () {
                start();
            }, 500);
        });
    },

    /**
     * Test the validation of the user selected items.
     * Here we simulate the exact idea of validation of the selected divs
     * @param {Object} assert
     * @return {void}
     */
    testUserSelectionValidation : function (assert) {

        var htmlElement = $($.parseHTML(tableAnnotationUnitTest.sampleHTMLSelectedData));
        var validation = tableAnnotator.getValidatedTableSelectedInfo(htmlElement);
        assert.ok(validation.isGetTableRangeSuccess, 'Table range successfully calculated');
        assert.ok((false === validation.isSelectionSuggestionPossible), 'No table suggestion applied here');
        assert.ok((validation.selectedElements.length === 12), 'Same number of element is found after the validation');
        assert.ok((validation.selectedElements[0].innerHTML === 'Column1'), 'First item match of the selected elements after validation');
        assert.ok((validation.selectedElements[validation.selectedElements.length - 1].innerHTML === 'Do'),
            'Last item match of the selected elements after validation');
    },

    /**
     * Get the selected div's value and check their exact value
     * @param {Object} assert
     * @return {void}
     */
    testUserSelectedInfo : function (assert) {
        var htmlElement = $($.parseHTML(tableAnnotationUnitTest.sampleHTMLSelectedData));
        var selectedItems = tableAnnotator.getSelectedTableInfo(htmlElement);
        console.log(selectedItems);
        assert.ok((selectedItems[0].length === 3), 'Parsed element matched with exact number of column selection');
        assert.ok((selectedItems[0][0] === 'Column1'), 'Selected element matched with table first column header');
        assert.ok((selectedItems[selectedItems.length - 1][2] === 'Do'), 'Selected element matched with last selected cell');

    }
};