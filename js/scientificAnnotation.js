/**
 * Created with JetBrains PhpStorm.
 * User: Islam_s
 * Date: 21.11.13
 * Time: 11:32
 * To change this template use File | Settings | File Templates.
 */


var scientificAnnotation  = {


    GRAPH_NAME : 'scientificAnnotation',


    /**
     * bind the click event
     */
    bindClickEventForAddAnnotationButton: function () {

        $("#addAnnotationBtn").bind("click", function () {
            //scientificAnnotation.displayAnnotationInputArea();
            scientificAnnotation.addAnnotation();
//            var currentPage = $('#pageNumber').val();
//            console.log('currentPage::'+currentPage);
//            var url = window.location;
            //var filename = getPDFFileNameFromURL(url);

//            var searchItem = $('#subjectValueInput').val();
////            console.log(searchItem);
//            PDFFindBar.searchAndHighlight(searchItem.toString());
        });

        $("#queryBtn").bind("click", function () {
            sparql.showDataFromSparql();
        });

    },

    getSelectionCharOffsetsWithin: function (element) {
    var start = 0, end = 0;
    var sel, range, priorRange;
//        console.log(element[0]);
//        return;
    if (typeof window.getSelection != "undefined") {
        range = window.getSelection().getRangeAt(0);
        priorRange = range.cloneRange();
//        priorRange.selectNodeContents(element);
        priorRange.moveToElementText(element);
        priorRange.setEnd(range.startContainer, range.startOffset);
        start = priorRange.toString().length;
        end = start + range.toString().length;
    } else if (typeof document.selection != "undefined" &&
        (sel = document.selection).type != "Control") {
        range = sel.createRange();
        priorRange = document.body.createTextRange();
        priorRange.moveToElementText(element);
        priorRange.setEndPoint("EndToStart", range);
        start = priorRange.text.length;
        end = start + range.text.length;
    }
    return {
        start: start,
        end: end
    };
},


    /**
     * bind the mouse up event
     */
    bindMouseUpEventForPDFViewer: function () {

        $("#viewer").bind("mouseup", function () {

            var text=scientificAnnotation.getSelectedTextFromPDF();
            if (text!='') {
                scientificAnnotation.setTextValue(text);
            }
        });

    },

    /**
     * bind the mouse up event
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

       if(propertyValue != '' && subjectValue!= '' && objectValue!= '') {
           scientificAnnotation.appendAnnotationInDisplayPanel(propertyValue,subjectValue, objectValue);
           sparql.addAnnotation(propertyValue,subjectValue, objectValue);
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
     * 
     */
    createSparqlTable:function(){
        $('#displaySparqlTable1').empty();
        $('#displaySparqlTable1').append(
            '<br><p>Available annotation of this file:::</p><br>'
        );

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
     * 
     */
    displayAvailableAnnotationFromSparql:function(){
        $('#displayAnnotationResult').empty();
        scientificAnnotation.createSparqlTable();
        $('#displaySparqlTable2').show();
    },

    /**
     * Initialize the document
     */
    init:function(){
        scientificAnnotation.bindClickEventForAddAnnotationButton();
        scientificAnnotation.bindMouseUpEventForPDFViewer();

    }

};


/**
 * document on ready method
 */
$(function () {
    scientificAnnotation.init();

});