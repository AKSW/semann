/**
This file is the main entry point for this tools for all the event
 that need to perform.

 @dependency

 sparql.js
 highlight.js

 */


var scientificAnnotation  = {

    GRAPH_NAME : 'scientificAnnotation',

    // selected text position info
    selectedTextPosition:null,


    /**
     * bind the click event for add annotation
     */
    bindClickEventForAddAnnotationButton: function () {

        $("#addAnnotationBtn").bind("click", function () {
            scientificAnnotation.addAnnotation();

        });

        $("#queryBtn").bind("click", function () {
            sparql.showDataFromSparql();
        });

    },

    /**
     * Set auto compute data for property field
     * @param properties
     */
    setAutoComputeDataForPropertyField :function(properties){

        var propertyField = $('#propertyValueInput');
        propertyField.typeahead('destroy');
        propertyField.typeahead(
            {
                local: properties
             }
        );

    },

    /**
     * Set auto compute data for object field
     * @param properties
     */
    setAutoComputeDataForObjectField :function(properties){

        var propertyField = $('#objectValueInput');
        propertyField.typeahead('destroy');
        propertyField.typeahead(
            {
                local: properties
             }
        );

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
        console.log(PDFFindController.pdfPageSource.pages[pageIndex]);
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
                console.log('previousPagesCharCount:'+previousPagesCharCount);
            }
        return previousPagesCharCount;
    },

    /**
     * bind mouse event for click in the page for select the document
     */
    bindMouseUpEventForPDFViewer: function () {

        $("#viewer").bind("mouseup", function () {

            var text=scientificAnnotation.getSelectedTextFromPDF();
            if (text!='') {
                scientificAnnotation.setTextValue(text);
                scientificAnnotation.selectedTextPosition = scientificAnnotation.getSelectionCharOffsetsWithin();
            }
        });

    },

    /**
     * bind the mouse click event in the displayed table rows to
     * highlight the subject part in the whole document
     */
    bindAnnotationTableSubjectClickEvent: function () {

        $('#sparqlTable').on('click', 'tr', function() {
            var subject = this.cells[0];  // the first <td>
            subject = subject.innerHTML
            console.log(subject);
            if(subject != ''){
                subject = $.trim(subject);
                PDFFindBar.searchAndHighlight(subject);
            }
        });


    },

    /**
     * clear the values of input text field
     */
    clearInputField:function (){
        $('#propertyValueInput').val('');
        $('#subjectValueInput').val('');
        $('#objectValueInput').val('');
    },

    /**
     * set the input
     * @param selectedText
     */
    setTextValue:function(selectedText) {

        selectedText =selectedText.replace(/(\r\n|\n|\r)/gm,"");
        $('#subjectValueInput').val(selectedText);
    },

    /**
     * Get the selected text form pdf doc
     * @returns {string}
     */
    getSelectedTextFromPDF : function(){
        if (window.getSelection) {
            return window.getSelection().toString();
        } else if (document.selection) {
            return document.selection.createRange().text;
        }
        return '';
    },

    /**
     * perform the adding of  annotation
     */
    addAnnotation:function(){
        
       var propertyValue = $('#propertyValueInput').val();
       var subjectValue = $('#subjectValueInput').val();
       var objectValue = $('#objectValueInput').val();

        propertyValue = $.trim(propertyValue);
        subjectValue = $.trim(subjectValue);
        objectValue = $.trim(objectValue);

        var rangyFragment = null;
        var rangyPage = null;

        var textPosition = scientificAnnotation.selectedTextPosition;
        var startPos = 0, endPos = 0;

        if(textPosition != null){
            startPos = textPosition.start;
            endPos = textPosition.end;
            rangyFragment = textPosition.rangyFragment;
            rangyPage = textPosition.rangyPage;
        }
	
       if(propertyValue != '' && subjectValue!= '' && objectValue!= '') {
           scientificAnnotation.appendAnnotationInDisplayPanel(propertyValue,subjectValue, objectValue);
           sparql.addAnnotation(propertyValue,subjectValue, objectValue, startPos, endPos, rangyPage, rangyFragment);
           scientificAnnotation.clearInputField();
       }

    },

    /**
     * Show the added annotation of the document
     * @param propertyValue
     * @param subjectValue
     * @param objectiveValue
     */
    appendAnnotationInDisplayPanel : function (propertyValue, subjectValue, objectValue){

        var previousHtml = $('#displayAnnotationResult').html();
        $('#displayAnnotationResult').empty();
        $('#displayAnnotationResult').append(
                '<p><strong>Subject:</strong></br>'+subjectValue+'</p>' +
                '<p><strong>Property:</strong></br>'+propertyValue+'</p>' +
                '<p><strong>Object:</strong></br>'+objectValue+'</p></br>'+
                 previousHtml
        );
    },

    /**
     * Reset the annotation display tables
     */
    resetAnnotationTable:function (){
        $('#displaySparqlTable1').empty();
        $('#displaySparqlTable2').empty();
    },

    /**
     * Show the added annotation of the document from spaql
     * @param propertyValue
     * @param subjectValue
     * @param objectiveValue
     */
    addDataToSparqlTableView : function (subjectValue ,propertyValue, objectValue){

        $('#sparqlTable tr:last').after(
            '<tr>' +
                '<td>'+subjectValue+'</td>' +
                '<td>'+propertyValue+'</td>' +
                '<td>'+objectValue+'</td>' +
                '</tr>'
        );
    },

    /**
     * Create the tables for viewing the available data from the db
     */
    createSparqlTable:function(){
        $('#displaySparqlTable1').empty();
        $('#displaySparqlTable1').append(
            '<br><p>Available annotation of this file:::</p><br>'
        );

        $('#displaySparqlTable2').empty();
        $('#displaySparqlTable2').append(
            "<table id='sparqlTable' width='100%'>"+
                "<tr>"+
                    "<th width='50%'> Subject </th> <th width='20%'> Property </th> <th width='30%'> Object </th>"+
                "</tr>"+
            "</table>"
        );

        scientificAnnotation.bindAnnotationTableSubjectClickEvent();
    },

    /**
     * Showing the available annotation tables
     */
    displayAvailableAnnotationFromSparql:function(){
        $('#displayAnnotationResult').empty();
        $('#displaySparqlTable1').show();
        scientificAnnotation.createSparqlTable();
        $('#displaySparqlTable2').show();
    },

    /**
     * Showing the available annotation tables
     */
    noAvailableAnnotationFromSparql:function(){
        $('#displaySparqlTable1').empty();
        $('#displaySparqlTable1').append(
            '<br><p>No available  annotation found  of this file.</p><br>'
        );
        $('#displaySparqlTable1').show();
    },

    /**
     * Hide the available annotation table
     */
    hideAnnotationDisplayTable:function(){
        $('#displaySparqlTable1').hide();
        $('#displaySparqlTable2').hide();
    },

    /**
     * Initialize the document
     */
    init:function(){
        scientificAnnotation.bindClickEventForAddAnnotationButton();
        scientificAnnotation.bindMouseUpEventForPDFViewer();
        sparql.bindAutoCompleteProperty();
        sparql.bindAutoCompleteObject();
    }
};


/**
 * document on ready method
 */
$(function () {
    scientificAnnotation.init();
    highlight.init();

});