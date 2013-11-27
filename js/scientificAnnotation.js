/**
 * Created with JetBrains PhpStorm.
 * User: Islam_s
 * Date: 21.11.13
 * Time: 11:32
 * To change this template use File | Settings | File Templates.
 */


var scientificAnnotation  = {


    /**
     * bind the click event
     */
    bindClickEventForAddAnnotationButton: function () {

        $("#addAnnotationBtn").bind("click", function () {
            //scientificAnnotation.displayAnnotationInputArea();
            scientificAnnotation.addAnnotation();
        });

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
     * clear the values of input text field
     */
    clearInputField:function (){
        $('#propertyValueInput').val('');
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

       if(propertyValue != '' && subjectValue!= '' && objectValue!= '') {
           scientificAnnotation.appendAnnotationInDisplayPanel(propertyValue,subjectValue, objectValue);
           scientificAnnotation.clearInputField();
       }

    },

    /**
     * Show the added annotation of the document
     * @param propertyValue
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