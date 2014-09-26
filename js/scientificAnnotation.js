/**
This file is the main entry point for this tools for all the event
 that need to perform.

@authors : A Q M Saiful Islam, Jaana Takis
@dependency:
 {
    sparql.js
    highlight.js
 }
 */
"use strict";
var scientificAnnotation  = {

    DEBUG: true, //determines whether to log to console window
    //initialised under init()
    BTN_PANEL: null,
    BTN_ADD: null,
    BTN_RECOMMENDER: null,
    BTN_ANNOTATIONS: null,
    BTN_TABLE: null,
    BTN_SELECT_TEXT: null,
    INPUT_SUBJECT: null,
    INPUT_PROPERTY: null,
    INPUT_OBJECT: null,
    DIV_VIEWER: null,
    DIV_ANNOTATIONS: null,
    DIV_ADDED: null,
    DIV_SUBJECTS: null,
    DIV_OBJECTS: null,
    DIV_RECOMMENDER: null,
    DIV_TRIPLES: null,
    DIV_DATACUBES: null,
    // selected text position info
    selectedTextPosition:null,
    isObjectSelection:false,

    /**
     * bind the click event for buttons
     *
     * @return void
     */
    bindClickEventForButtons: function () {

        scientificAnnotation.BTN_PANEL.bind("click", function () {
            scientificAnnotation.toggleSimpleAnnotatePanel($(this));
        });

        scientificAnnotation.BTN_ADD.bind("click", function () {
            scientificAnnotation.addAnnotation();
        });

        scientificAnnotation.BTN_RECOMMENDER.bind("click", function () {
            scientificAnnotation.showSimilarSearchResult();
        });

        scientificAnnotation.BTN_ANNOTATIONS.bind("click", function () {
            scientificAnnotation.fetchDataFromDatabase();
        });

        scientificAnnotation.BTN_TABLE.bind("click", function () {
            scientificAnnotation.annotateTable($(this));
        });
        
        scientificAnnotation.BTN_RESET.bind("click", function () {
            scientificAnnotation.resetAnnotation($(this));
        });
        
        scientificAnnotation.BTN_SELECT_TEXT.bind("click", function () {
            scientificAnnotation.isObjectSelection = true;
        });

    },

    /**
     * bind events for input fields
     *
     * @return void
     */
    bindEventForInputs: function () {
        scientificAnnotation.INPUT_SUBJECT.bind("change", function () {
            sparql.triple.set($(this));
            dbLookup.showDataFromDBlookup($(this).val(), scientificAnnotation.DIV_SUBJECTS);
            if (scientificAnnotation.DEBUG) console.log("Triple view: \n" +JSON.stringify(sparql.triple, null, 4));
        });

        scientificAnnotation.INPUT_OBJECT.bind("change", function () {
            sparql.triple.set($(this));
            dbLookup.showDataFromDBlookup($(this).val(), scientificAnnotation.DIV_OBJECTS);
            if (scientificAnnotation.DEBUG) console.log("Triple view: \n" +JSON.stringify(sparql.triple, null, 4));
        });
    },

    /**
     * show the simple annotate panel
     * @param button for which to change text
     */
    toggleSimpleAnnotatePanel : function (button) {
        var panel = scientificAnnotation.DIV_ANNOTATIONS;
        if (panel.is(':visible')) {
            panel.hide();
            button.text('Show Simple Annotate Panel');
        } else {
            panel.fadeIn(500);
            button.text('Hide Simple Annotate Panel');
        }
        scientificAnnotation.resetAnnotationTable();
    },

    /**
     * Set auto compute data for a given input field
     *
     * @param {Array of objects} containing query results for a requested resource (eg. properties)
     * @param {Object} input field  where to output the list of values
     * @return {String} URI of the user's selection
     *
     */
    setAutoComputeDataForField :function(resources, inputObject){
        inputObject.typeahead('destroy');
        inputObject.typeahead(
		{
			local: resources
		}
        ).on('typeahead:selected', function(event, data) { //triggers when user selects an item from the list
            sparql.triple.set(inputObject, data.uri);
            if (scientificAnnotation.DEBUG) console.log("Triple view: \n" +JSON.stringify(sparql.triple, null, 4));
            return data.uri; //return resource URI
        });
    },

    /**
     * Set similar search result
     *
     * @param searchResult
     * @param {Object} element where to display the recommendations
     * @return void
     */
    setSimilarSearchResult :function(searchResult, targetObject){
        if(searchResult.length > 0) {
            scientificAnnotation.hideAnnotationDisplayTable();
            targetObject.empty();
            for(var i = 0; i < searchResult.length; i++) {
                targetObject.append('<a href="'+searchResult[i]+'" class="list-group-item">'+searchResult[i]+'</a>');
            }
            targetObject.fadeIn(500);// show the result
        } else {
            messageHandler.showWarningMessage('No similar publications found.');
        }
    },

    /**
     * Return the selected Position details
     *
     * @returns {{start: number, end: number, rangyFragment: (highlight.rangy_serialize.Rangy|*), rangyPage: (highlight.rangy_serialize.Page|*)}}
     */
    getSelectionCharOffsetsWithin: function () {
        var currentPage =  $('#pageNumber').val();
        var element=document.body;
        var sel, range;
        var start = 0, end = 0, previousPagesCharCount = 0;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(sel.rangeCount - 1);
                start = scientificAnnotation.getBodyTextOffset(range.startContainer, range.startOffset,element);
                end = scientificAnnotation.getBodyTextOffset(range.endContainer, range.endOffset,element);
                sel.removeAllRanges();
                sel.addRange(range);
                previousPagesCharCount = scientificAnnotation.getPreviousPagesCharacterCount(currentPage);
            }
        }

        if(start > previousPagesCharCount) {
            start = start - previousPagesCharCount;
        }

        if(end > previousPagesCharCount){
            end = end - previousPagesCharCount;
        }

        var rangy_result = highlight.rangy_serialize();
	
        return {
            start: start,
            end: end,
            rangyFragment: rangy_result.Rangy,
            rangyPage: rangy_result.Page	
        };
    },

    /**
     * Get selected body text
     *
     * @param node
     * @param offset
     * @param element
     * @returns {Number}
     */
    getBodyTextOffset:function(node, offset,element) {
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        range.setEnd(node, offset);
        sel.removeAllRanges();
        sel.addRange(range);
        return sel.toString().length;
    },

    /**
     * Get the total character size of a single pdf page
     *
     * @param pageNumber
     * @returns {number}
     */
    getPageTotalCharLength : function(pageIndex){
        var count = 0;
        var textContent = PDFFindController.pdfPageSource.pages[pageIndex].getTextContent();
        if(textContent != null && textContent._value !== null){
            var lines = textContent._value.bidiTexts;
            var page_text = "";
            var last_block = null;
            for( var k = 0; k < lines.length; k++ ){
                var block = lines[k];
                if( last_block != null && last_block.str[last_block.str.length-1] != ' '){
                    if( block.x < last_block.x ){
                        page_text += "\r\n";
                    }
                    else if ( last_block.y != block.y && ( last_block.str.match(/^(\s?[a-zA-Z])$|^(.+\s[a-zA-Z])$/) == null ))
                        page_text += ' ';
                }
                page_text += block.str;
                last_block = block;
            }
            count = page_text.length;
        }
        return count;
    },

    /**
     * Get all characters before current page
     *
     * @param currentPage
     * @returns {number}
     */
    getPreviousPagesCharacterCount : function(currentPage){
        var previousPagesCharCount = 0;
            for(var i=0; i<currentPage -1;i++){
                previousPagesCharCount += scientificAnnotation.getPageTotalCharLength(i);
            }
        return previousPagesCharCount;
    },

    /**
     * bind mouse event for click in the page for select the document
     *
     * @return void
     */
    bindMouseUpEventForPDFViewer: function () {
        scientificAnnotation.DIV_VIEWER.bind("mouseup", function () {
            var targetElement, targetInfoElement;
            var hideElement;
            if (scientificAnnotation.isObjectSelection) {
                targetElement = scientificAnnotation.INPUT_OBJECT;
                targetInfoElement = scientificAnnotation.DIV_OBJECTS;
            } else {
                targetElement = scientificAnnotation.INPUT_SUBJECT;
                targetInfoElement = scientificAnnotation.DIV_SUBJECTS;
                hideElement = scientificAnnotation.DIV_OBJECTS;
            }
            var proceed = scientificAnnotation.isSelectionInPDF();
            if (proceed) {
                var text=scientificAnnotation.getSelectedTextFromPDF();
                if (text && scientificAnnotation.DIV_ANNOTATIONS.is(':visible')) {
                    targetElement.val(text);
                    sparql.triple.set(targetElement);
                    if (!scientificAnnotation.isObjectSelection) scientificAnnotation.selectedTextPosition = scientificAnnotation.getSelectionCharOffsetsWithin();
                    dbLookup.showDataFromDBlookup(targetElement.val(), targetInfoElement);
                    if (hideElement) hideElement.hide();
                }
            }
            scientificAnnotation.isObjectSelection = false;
        });
    },

    /**
     * bind the mouse click event in the given element for table rows to
     * highlight the subject part in the whole document
     * @param {Object} element under which a table is contained that needs clickable rows.
     * @return void
     */
    bindAnnotationTableSubjectClickEvent: function (targetObject) {
        var table = targetObject.find("table:first"); 
        table.on('click', 'tr', function() {
            var subject = this.cells[0];  // the first <td>
            subject = subject.innerHTML
            if(subject) {
                PDFFindBar.searchAndHighlight(subject); //PDF.js method. 
                alert('This native highlighting should be replaced with rangy methods, otherwise it corrupts the rangy highlights.');
            }
        });
    },

    /**
     * clear the values of input text field
     * @return void
     */
    clearInputField:function (){
        sparql.triple.empty(scientificAnnotation.INPUT_PROPERTY);
        sparql.triple.empty(scientificAnnotation.INPUT_OBJECT);
        //we leave subject as is in case user wants to add more statements about it
        scientificAnnotation.DIV_OBJECTS.hide();
    },

    /**
     * Get the selected text form pdf doc
     * @returns {string}
     */
    getSelectedTextFromPDF : function(){
        return highlight.fixWhitespace();
    },

    /**
     * perform the adding of annotation
     * @return void
     */
    addAnnotation:function(){
        sparql.triple.set(scientificAnnotation.INPUT_SUBJECT, sparql.triple.subject.uri);
        sparql.triple.set(scientificAnnotation.INPUT_PROPERTY, sparql.triple.property.uri);
        sparql.triple.set(scientificAnnotation.INPUT_OBJECT, sparql.triple.object.uri);
        var hasMissingValues = (!scientificAnnotation.INPUT_SUBJECT.val() || !scientificAnnotation.INPUT_PROPERTY.val() || !scientificAnnotation.INPUT_OBJECT.val()) ? true : false;
        if(hasMissingValues) {
            messageHandler.showErrorMessage('Empty fields. Please provide values and try again',true);
            if (scientificAnnotation.DEBUG) console.error('Empty fields. Please provide values and try again');
        } else {
            var rangyFragment = null;
            var rangyPage = null;
            var textPosition = scientificAnnotation.selectedTextPosition;
            var startPos = 0, endPos = 0;
            if(textPosition){
                startPos = textPosition.start;
                endPos = textPosition.end;
                rangyFragment = textPosition.rangyFragment;
                rangyPage = textPosition.rangyPage;
            }
            progressbar.showProgressBar('Adding annotation...');
            scientificAnnotation.appendAnnotationInDisplayPanel();
            var success = sparql.addAnnotation(startPos, endPos, rangyPage, rangyFragment);
            if (success) scientificAnnotation.clearInputField();
        }
    },

    /**
     * Show the added annotation of the document
     * @return void
     */
    appendAnnotationInDisplayPanel : function (){
        var subject = sparql.triple.subject.label;
        var property = sparql.triple.property.label;
        var object = sparql.triple.object.label;
        //add links where possible
        if (sparql.triple.subject.uri) {
            subject = '<a href="'+sparql.triple.subject.uri+'" target="_blank">' + subject + '</a>';
        }
        if (sparql.triple.property.uri) {
            property = '<a href="'+sparql.triple.property.uri+'" target="_blank">' + property + '</a>';
        }
        if (sparql.triple.object.uri) {
            object = '<a href="'+sparql.triple.object.uri+'" target="_blank">' + object + '</a>';
        }
        scientificAnnotation.clearAnnotationDisplayPanel();
        scientificAnnotation.DIV_ADDED.append(
                '<p><strong>Subject:</strong><br/>'+subject+'</p>' +
                '<p><strong>Property:</strong><br/>'+property+'</p>' +
                '<p><strong>Object:</strong><br/>'+object+'</p><br/>'
        );
    },

    /**
     *  Reset and refresh necessary parameter and variable once new pdf file has been laoded
     */
    refreshOnNewPdfFileLoad : function () {
        tableAnnotator.TABLE_ANNOTATION_COUNT = 1;
        scientificAnnotation.clearAnnotationDisplayPanel();
        scientificAnnotation.clearSimilarSearchResult();
        highlight.init();
        sparql.triple.emptyAll();
        scientificAnnotation.resetAnnotationTable();
        scientificAnnotation.DIV_SUBJECTS.hide();
        scientificAnnotation.DIV_OBJECTS.hide();
    },
    
    /**
     * Reset the annotation display tables, used by viewer.js
     * @return void
     */
    resetAnnotationTable:function (){
        scientificAnnotation.DIV_TRIPLES.empty();
    },
    
    /**
     * clear available annotations
     */
    clearAnnotationDisplayPanel:function (){
        scientificAnnotation.DIV_ADDED.empty();
    },

    /**
     * clear the similar search window and hide
     */
    clearSimilarSearchResult:function(){
        scientificAnnotation.DIV_RECOMMENDER.empty();
        scientificAnnotation.DIV_RECOMMENDER.fadeOut(300);
    },

    /**
     * Show the added annotation of the document from spaql
     * @param {String} property label
     * @param {String} subject label
     * @param {String} object label
     * @return void
     */
    addDataToSparqlTableView : function (subjectValue, propertyValue, objectValue){
        var tablerow = scientificAnnotation.DIV_TRIPLES.find("table:first tr:last"); 
        tablerow.after(
            '<tr>' +
                '<td>'+subjectValue+'</td>' +
                '<td>'+propertyValue+'</td>' +
                '<td>'+objectValue+'</td>' +
            '</tr>'
        );
    },

    /**
     * Showing the available annotation tables
     * @return void
     */
    displayAvailableAnnotationFromSparql:function(){
        scientificAnnotation.clearAnnotationDisplayPanel();
        var htmlTemplate = "<p>Available annotations for this file:</p>" +'\n'+
                                    "<div id='displaySparqlTableRows' style='overflow:auto; width:800px; height:300px;'>" +'\n'+
                                        "<table id='sparqlTable' width='100%'>" +'\n'+
                                            "<tbody>" +'\n'+
                                                "<tr>" +'\n'+
                                                    "<th width='50%'> Subject </th>" +'\n'+
                                                    "<th width='20%'> Property </th>" +'\n'+
                                                    "<th width='30%'> Object </th>" +'\n'+
                                                "</tr>" +'\n'+
                                            "</tbody>" +'\n'+
                                        "</table>" +'\n'+
                                    "</div>";
        scientificAnnotation.DIV_TRIPLES.html(htmlTemplate);
        scientificAnnotation.bindAnnotationTableSubjectClickEvent(scientificAnnotation.DIV_TRIPLES);
    },

    /**
     * Showing the available annotation tables
     * @return void
     */
    noAvailableAnnotationFromSparql:function(){
        messageHandler.showWarningMessage('No available annotations found for this file.');
        progressbar.hideProgressBar();
    },

    /**
     * Hide the available annotation table
     * @return void
     */
    hideAnnotationDisplayTable:function(){
        scientificAnnotation.DIV_TRIPLES.hide();
    },

    /**
     * Fetch the data from database
     * @return void
     */
    fetchDataFromDatabase : function () {
        scientificAnnotation.DIV_TRIPLES.fadeIn(500);
        scientificAnnotation.clearSimilarSearchResult();
        progressbar.showProgressBar('Loading data ....');
        sparql.showDataFromSparql();
    },

    /**
     *  Annotate tabular structure in pdf file
     *  @return void
     */
    annotateTable : function(button) {

        if (!scientificAnnotation.DIV_DATACUBES.is(':visible')) {
            tableAnnotator.annotateSelectedTable();
        } else {
            button.text('Annotate table');
            scientificAnnotation.BTN_RESET.hide();
            scientificAnnotation.DIV_DATACUBES.hide();

            if (tableAnnotator.storedData !== null) {
                dataCubeSparql.addAnnotation(tableAnnotator.storedData);
            }
        }
    },
    
    resetAnnotation : function(button) {
        scientificAnnotation.DIV_DATACUBES.empty();
        scientificAnnotation.DIV_DATACUBES.hide();
        scientificAnnotation.BTN_TABLE.text('Annotate table');
        tableAnnotator.storedData = null;
        button.hide();
    },
    
    /**
     * Display similar search
     * @return void
     */
    showSimilarSearchResult:function(){
        if (scientificAnnotation.DIV_RECOMMENDER.is(':visible')) {
            scientificAnnotation.DIV_RECOMMENDER.fadeOut(300);
        }
        progressbar.showProgressBar('Finding similar publications...');
        sparql.findSimilarFiles();
    },
    
    /**
     * Checks if active selection was made in PDF. 
     * @return {Boolean}
     */
    isSelectionInPDF: function(){
        var node, selection;
        if (window.getSelection) {
            selection = getSelection();
            node = selection.anchorNode;
        }
        if (!node && document.selection) {
            selection = document.selection;
            var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
            node = range.commonAncestorContainer ? range.commonAncestorContainer :
                    range.parentElement ? range.parentElement() : range.item(0);
        }
        if ($(node).closest(scientificAnnotation.DIV_VIEWER).length > 0) { //if node exists
            return true;
        } else { 
            return false; //avoids the problem where selection is not made in PDF but mouse released over PDF file. We want to ignore these cases.
        }
    },

    /**
     * This sets up event listeners
     * @return void
     */
    bindEventListeners: function(){
        //An event that is fired by PDF.js when the pdf loads. 
        window.addEventListener("documentload", function(evt) {
            //alert("PDF.js event - documentload");
            scientificAnnotation.refreshOnNewPdfFileLoad();
        }, false);
        
        //An event that is fired by PDF.js when the pdf.js loads
        window.addEventListener("DOMContentLoaded", function(evt) {
            //alert("PDF.js event - DOMContentLoaded");
            //console.log(evt);
        }, false);
        
    },
    
    /**
     * Initialize the document
     *
     * @return void
     */
    init:function(){
        //UI
        scientificAnnotation.BTN_PANEL = $("#simpleAnnotateButton");
        scientificAnnotation.BTN_ADD = $("#addAnnotationButton");
        scientificAnnotation.BTN_RECOMMENDER = $("#showSimilarSearchButton");
        scientificAnnotation.BTN_ANNOTATIONS = $("#queryButton");
        scientificAnnotation.BTN_TABLE = $("#annotateTableButton");
        scientificAnnotation.BTN_RESET = $("#resetAnnotationButton");
        scientificAnnotation.BTN_SELECT_TEXT = $("#objectTextSelection");
        scientificAnnotation.INPUT_SUBJECT = $("#subjectValueInput");
        scientificAnnotation.INPUT_PROPERTY = $("#propertyValueInput");
        scientificAnnotation.INPUT_OBJECT = $("#objectValueInput");
        scientificAnnotation.DIV_VIEWER = $("#viewer");
        scientificAnnotation.DIV_ANNOTATIONS = $("#simpleAnnotatePanel");
        scientificAnnotation.DIV_ADDED = $("#displayAnnotationResult");
        scientificAnnotation.DIV_SUBJECTS = $("#displaySubjectURI");
        scientificAnnotation.DIV_PROPERTIES = $("#propertyCount");
        scientificAnnotation.DIV_OBJECTS = $("#displayObjectURI");
        scientificAnnotation.DIV_RECOMMENDER = $("#similarPubsList");
        scientificAnnotation.DIV_TRIPLES = $("#displayTriples");
        scientificAnnotation.DIV_DATACUBES = $("#viewSelectedInfoFromPfdTable");

        scientificAnnotation.bindClickEventForButtons();
        scientificAnnotation.bindEventForInputs();
        scientificAnnotation.bindEventListeners();
        scientificAnnotation.bindMouseUpEventForPDFViewer();
        sparql.bindAutoCompleteProperty();
        //sparql.bindAutoCompleteObject();
        
    }
};

/**
 * document on ready method
 */
$(function () {
    applicationSettings.setUp();
    if (applicationSettings.isUnitTestOngoing) {
        return;
    }
    scientificAnnotation.init();
    test.init(); //functionality related to jaana developing. Remove this from production.
});