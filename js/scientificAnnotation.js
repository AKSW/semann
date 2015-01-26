/**
This file is the main entry point for this tools for all the event
 that need to perform.

@authors : A Q M Saiful Islam, Jaana Takis
@dependency:
 {
    sparql.js
    sparqlResponseParser.js
    highlight.js
    dbLookup.js
    dataCubeSparql.js
    applicationSettings.js
    messageHandler.js
    progressbar.js
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
    BTN_ADD_VOCABULARY: null,
    INPUT_SUBJECT: null,
    INPUT_PROPERTY: null,
    INPUT_OBJECT: null,
    INPUT_VOCABULARY: null,
    DIV_TAB_ANNOTATIONS: null,
    DIV_VIEWER: null,
    DIV_ANNOTATIONS: null,
    DIV_ANNOTATION_INPUTS: null,
    DIV_ADDED: null,
    DIV_SUBJECTS: null,
    DIV_PROPERTY_COUNT: null,
    DIV_SUBJECT_COUNT: null,
    DIV_OBJECTS: null,
    DIV_TRIPLES: null,
    DIV_DATACUBES: null,
    DIV_VOCABULARIES: null,
    DIV_DRAWING: null,
    DIV_DRAWING_SUBJECT: null,
    DIV_DRAWING_OBJECT: null,
    DIV_DRAWING_PROPERTY: null,
    DIV_DRAWING_ARROW: null,
    isObjectSelection: false,
    destroyLastSelection: true,
    pageLengths: [],
    
    
    /**
     * bind the click event for buttons
     *
     * @return void
     */
    bindClickEventForButtons: function () {

        scientificAnnotation.BTN_ADD.bind("click", function () {
            highlight.destroyActiveSelection();
            scientificAnnotation.addAnnotation();
        });

        scientificAnnotation.BTN_RECOMMENDER.bind("click", function () {
            highlight.destroyActiveSelection();
            //alert($("#57\\,\\%m\\.pdf").prop("id"));
            scientificAnnotation.hideAnnotationDisplayTable();
            scientificAnnotation.showSimilarSearchResult();
        });

        scientificAnnotation.BTN_ANNOTATIONS.bind("click", function () {
            highlight.destroyActiveSelection();
            scientificAnnotation.fetchDataFromDatabase();
        });

        scientificAnnotation.BTN_TABLE.bind("click", function () {
            scientificAnnotation.annotateTable($(this));
        });
        
        scientificAnnotation.BTN_RESET.bind("click", function () {
            highlight.destroyActiveSelection();
            scientificAnnotation.resetAnnotation($(this));
        });
        
        scientificAnnotation.BTN_SELECT_TEXT.bind("click", function () {
            highlight.destroyActiveSelection();
            scientificAnnotation.isObjectSelection = true;
        });
        
        scientificAnnotation.BTN_ADD_VOCABULARY.bind("click", function () {
            highlight.destroyActiveSelection();
            var myrequest;
            var vocabularyURL = scientificAnnotation.INPUT_VOCABULARY.val().trim();
            if (vocabularyURL && sparql.validateURL(vocabularyURL)) {
                var query = sparql.loadOntology(vocabularyURL);
                myrequest = sparql.makeAjaxRequest(query, "soft");
            } else {
                var error = "'" + vocabularyURL + "' is not a valid URL. ";
                messageHandler.showErrorMessage(error, true);
                if (scientificAnnotation.DEBUG) console.error(error);
            }
            myrequest.done( function(response) {
                var tripleCount = sparqlResponseParser.parseLoadOntology(response);
                messageHandler.showSuccessMessage('Ontology successfully loaded with ' +tripleCount+ ' triples!');
                var newCheckbox = '<input type="checkbox" checked="true" /> <a href="' +vocabularyURL+ '" target="_blank">' +vocabularyURL+ '</a><br>';
                scientificAnnotation.DIV_VOCABULARIES.append(newCheckbox);
                scientificAnnotation.INPUT_VOCABULARY.val("");
                scientificAnnotation.loadOntologyResources(vocabularyURL, true);
            });
            myrequest.fail(function(jqXHR, exception) { //what to do in case of error
                var errorTxt= "The vocabulary URL you entered is not a valid ontology.";
                messageHandler.showErrorMessage(errorTxt, true);
            })
        });
        
        scientificAnnotation.DIV_DRAWING.bind("click", function () {
            if (scientificAnnotation.DEBUG) console.log("Triple view: \n" +JSON.stringify(sparql.triple, null, 4));
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
            var keyword = ($(this).val()) ? $(this).val() : sparql.triple.subject.label;
            if (keyword) {
                var myrequest = dbLookup.makeAjaxRequest(keyword);
                myrequest.done( function(response) {
                    dbLookup.dbSubjectResponse = response;
                    var message = dbLookup.formatResponse(response, scientificAnnotation.DIV_SUBJECTS);
                    if (message) {
                        messageHandler.displayInfo(message, scientificAnnotation.DIV_SUBJECTS);
                    } else {
                        messageHandler.displayInfo("No matches found in DBpedia.org.", scientificAnnotation.DIV_SUBJECTS, true);
                    }
                });
                scientificAnnotation.BTN_ADD.prop('disabled', false);
            }
        });

        scientificAnnotation.INPUT_OBJECT.bind("change", function () {
            sparql.triple.set($(this));
            var myrequest = dbLookup.makeAjaxRequest($(this).val());
            myrequest.done( function(response) {
                dbLookup.dbObjectResponse = response;
                var message = dbLookup.formatResponse(response, scientificAnnotation.DIV_OBJECTS);
                if (message) {
                    messageHandler.displayInfo(message, scientificAnnotation.DIV_OBJECTS);
                } else {
                    messageHandler.displayInfo("No matches found in DBpedia.org.", scientificAnnotation.DIV_OBJECTS, true);
                }
            });
        });
    },

    /**
     * reset the simple annotate panel
     * @param button for which to change text
     */
    resetSimpleAnnotatePanel : function (button) {
        sparql.triple.emptyAll();
        scientificAnnotation.DIV_SUBJECTS.hide();
        scientificAnnotation.DIV_OBJECTS.hide();
        scientificAnnotation.clearAnnotationDisplayPanel();
        scientificAnnotation.resetAnnotationTable();
        if (!scientificAnnotation.DIV_ANNOTATIONS.is(':visible')) {
            scientificAnnotation.DIV_ANNOTATIONS.fadeIn(500);
        }
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
            return data.uri; //return resource URI
        });
    },


    /**
     * bind mouse event for click in the page for select the document
     *
     * @return void
     */
    bindEventsForPDF: function () {
        scientificAnnotation.DIV_VIEWER.bind("mouseup", function () {
            var targetElement;
            var hideElement;
            if (scientificAnnotation.isObjectSelection) {
                targetElement = scientificAnnotation.INPUT_OBJECT;
            } else {
                targetElement = scientificAnnotation.INPUT_SUBJECT;
                hideElement = scientificAnnotation.DIV_OBJECTS;
            }
            var proceed = highlight.isSelectionInPDF();
            if (proceed) {
                var text=scientificAnnotation.getSelectedTextFromPDF();
                if (text && scientificAnnotation.DIV_TAB_ANNOTATIONS.is(".active")) {
                    sparql.triple.setInfo(targetElement, highlight.rangy_serialize(), text);
                    targetElement.change(); //trigger change event
                    if (hideElement) hideElement.hide();
                }
            }
            scientificAnnotation.isObjectSelection = false;
        });
        
        scientificAnnotation.DIV_VIEWER.bind("mousedown", function () {
            if (!scientificAnnotation.isObjectSelection) {
                scientificAnnotation.resetSimpleAnnotatePanel();
            }
            if (scientificAnnotation.destroyLastSelection && highlight.userHighlightRanges.length > 0) {
                var lastSelectedRange = highlight.userHighlightRanges[highlight.userHighlightRanges.length-1];
                if (lastSelectedRange) {
                    highlight.undoRangeHighlight(lastSelectedRange);
                }
                highlight.userHighlightRanges.pop();
            } else {
                scientificAnnotation.destroyLastSelection = true;
            }
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
        var text = highlight.fixWhitespace();
        var annotationInputs = $('#'+scientificAnnotation.DIV_ANNOTATION_INPUTS.prop("id")+' :input'); //retrieves all input elements
        if (text.length == 0 ) { //no text was selected
            annotationInputs.prop('disabled', true);
        } else {
            annotationInputs.prop('disabled', false);
        }
        return text;
    },

    /**
     * perform the adding of annotation
     * @return void
     */
    addAnnotation:function(){
        scientificAnnotation.hideAnnotationDisplayTable();
        sparql.triple.set(scientificAnnotation.INPUT_SUBJECT, sparql.triple.subject.uri);
        sparql.triple.set(scientificAnnotation.INPUT_PROPERTY, sparql.triple.property.uri);
        sparql.triple.set(scientificAnnotation.INPUT_OBJECT, sparql.triple.object.uri);
        var hasClassificationOnly = (sparql.triple.subject.label && !sparql.triple.property.label && !sparql.triple.object.label) ? true : false;
        var hasMissingValues = (!sparql.triple.subject.label || !sparql.triple.property.label || !sparql.triple.object.label) ? true : false;
        if(hasMissingValues && !hasClassificationOnly) {
            messageHandler.showErrorMessage('Empty fields. Please provide values and try again',true);
            if (scientificAnnotation.DEBUG) console.error('Empty fields. Please provide values and try again');
        } else {
            var query = sparql.insertQuery();
            var myrequest = sparql.makeAjaxRequest(query);
            myrequest.done( function(response) {
                messageHandler.showSuccessMessage('Annotation successfully added');
                scientificAnnotation.destroyLastSelection = false;
                scientificAnnotation.appendAnnotationInDisplayPanel();
                scientificAnnotation.clearInputField();
                scientificAnnotation.refreshProperties();
            });
            
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
        scientificAnnotation.clearSimilarSearchResult();
        highlight.importedAnnotations.emptyAll(); //reset imported annotations
        highlight.init();
        scientificAnnotation.resetSimpleAnnotatePanel();
        sparql.recommendations = { papers: {} };
        scientificAnnotation.DIV_RECOMMENDATIONS.empty();
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
        scientificAnnotation.DIV_RECOMMENDATIONS.empty();
        scientificAnnotation.DIV_RECOMMENDATIONS.fadeOut(300);
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
     * Adds recommendations to the UI. Each recommendation is a collapsible accordion.
     * @return void
     */
    addRecommendation:function(paperKey){
        //scientificAnnotation.DIV_RECOMMENDATIONS.empty();
        var fileURI = paperKey.split("/");
        fileURI = fileURI[fileURI.length-1];
        var escapedId = "#" + fileURI.replace( /('|\(|\)|,|%|:|\.|\[|\])/g, "\\$1" ); //selectors don't work with chars like ".", ":". They should be escaped with "\\"
        var selector = $(escapedId);
        var dbpediaMention = "", skosMention = "", text="";
        
        //for (var paper in sparql.recommendations.papers) {
            for (var annotation in sparql.recommendations.papers[paperKey].annotations) {
                for (var grouping in sparql.recommendations.papers[paperKey].annotations[annotation]) {
                    if (grouping === "skos") {
                        for (var match in sparql.recommendations.papers[paperKey].annotations[annotation].skos) {
                            var identificator = " class='explanation' annotation='" +annotation+ "' thisAnnotation='" +sparql.recommendations.papers[paperKey].annotations[annotation].skos[match].thisAnnotation+ "'";
                            skosMention = skosMention + "<div " +identificator+ ">Shares same category <a href='" + match + "' target='_blank'>" +sparql.recommendations.papers[paperKey].annotations[annotation].skos[match].label+ "</a> (here: "+ sparql.recommendations.papers[paperKey].annotations[annotation].skos[match].thisSubjectOf +", paper: " +sparql.recommendations.papers[paperKey].annotations[annotation].skos[match].subjectOf+ ").</div>";
                            //console.log("Compare the following (that, this): " +annotation+ " - " + sparql.recommendations.papers[paper].annotations[annotation].skos[match].thisAnnotation);
                            //compareContexts.push( [ annotation, sparql.recommendations.papers[paper].annotations[annotation].skos[match].thisAnnotation ]);
                        }
                    }
                    if (grouping === "dbpedia") {
                        for (var match in sparql.recommendations.papers[paperKey].annotations[annotation].dbpedia) {
                            var dbpediaLabel = match.split("/");
                            dbpediaLabel = dbpediaLabel[dbpediaLabel.length-1];
                            dbpediaMention = dbpediaMention + "<div>Mentions <a href='" + match + "' target='_blank'>" +dbpediaLabel+ "</a>.</div>";
                            //console.log("Compare the following (that, this): " +annotation+ " - " + sparql.recommendations.papers[paper].annotations[annotation].dbpedia[match].thisAnnotation);
                            //compareContexts.push( [ annotation, sparql.recommendations.papers[paper].annotations[annotation].dbpedia[match].thisAnnotation ]);
                        }
                    }
                }
            }
        //}
        text = text + dbpediaMention + skosMention;
        //alert(text);
        var isDuplicate = (selector.length) ? true : false;
        if (!isDuplicate) {
            var htmlTemplate = '<div class="panel panel-default">' +'\n'+
                                            '<div class="panel-heading">' +'\n'+
                                                '<h4 class="panel-title">' + '\n'+
                                                    '<a data-toggle="collapse" data-parent="#accordion" href="'+escapedId+'"> ' +sparql.recommendations.papers[paperKey].label+ ' </a>' + '\n'+
                                                '</h4>' + '\n'+
                                            '</div>' + '\n'+
                                            '<div id="' +fileURI+ '" class="panel-collapse collapse in">' + '\n'+
                                                '<div class="panel-body">' +text+ '</div>' + '\n'+
                                            '</div>' + '\n'+
                                        '</div>' + '\n';
            scientificAnnotation.DIV_RECOMMENDATIONS.append(htmlTemplate);
        } else {
            alert("recommendation is duplicate!");
        }
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
        scientificAnnotation.clearSimilarSearchResult();
        var myrequest = sparql.makeAjaxRequest(sparql.selectTriplesQuery);
        myrequest.done( function(response) {
            if( response && response.results.bindings.length >0) {
                highlight.undoMyHighlights(highlight.userHighlightRanges); //active highlights off so the DOM will not corrupt
                scientificAnnotation.displayAvailableAnnotationFromSparql();
                scientificAnnotation.DIV_TRIPLES.fadeIn(500);
                sparqlResponseParser.parseResponse(response);
                scientificAnnotation.renderAnnotatedPage();
            } else {
                messageHandler.showWarningMessage('No available annotations found for this file.');
            }
        });
    },

    /**
     * Renders a page with annotations on it.  Picks the first page it finds.
     * @return void
     */
    renderAnnotatedPage : function () {
        var isLoading = false;
        var pageHighlights;
        $.each(PDFView.pages, function(index, page) {
            pageHighlights = highlight.importedAnnotations.get(page.id);
            if (pageHighlights) { //annotations exist for this page
                isLoading = scientificAnnotation.renderPage(page.id); //render page if needed
                if (isLoading) return false; //break loop, rendering started and multiple asynchronous calls are not allowed here.
            }
        });
        if (!isLoading) { //all pages with annotations are now rendered
            //apply missing highlights to pages that were already rendered
            $.each(PDFView.pages, function(index, page) {
                pageHighlights = highlight.importedAnnotations.get(page.id);
                if (pageHighlights) { //annotations exist for this page
                    highlight.rangy_highlight(pageHighlights);
                    highlight.importedAnnotations.empty(page.id); //now that highlight is applied, we can discard this
                }
            });
        }
    },
    
    /**
     * Renders a given page's view in PDF.js. When the page is successfully rendered, the 'pagerender' event is thrown.
     * @param {Integer} page number.
     * @return {Boolean} true if rendering was necessary, false if page was already rendered.
     */
    renderPage: function (pageNum) {  
        PDFJS.disableWorker = true;
        var page = PDFView.pages[pageNum-1];
        if (PDFView.isViewFinished(page)) { //don't do anything if page is already rendered
            return false;
        } else {
            if (scientificAnnotation.DEBUG) console.log("Rendering page["+page.id+"] state: "+page.renderingState);
            PDFView.renderView(page, "page"); //throws 'pagerender' event when done
            return true;
        }
    },
    
    /**
     * Finds the length of text per page. Values are cumulative and are assigned to the global array and are assigned asynchronously
     *
     * @return void
     */
    
    countPageLengths: function () {
        var pageTotal = PDFView.pages.length;
        scientificAnnotation.pageLengths = [];
        var str = "";
        for (var j = 1; j <= pageTotal; j++) {
            var page = PDFView.getPage(j);
            var processPageText = function processPageText(pageIndex) {
                return function(pageData, content) {
                    return function(text) {
                        for (var i = 0; i < text.bidiTexts.length; i++) {
                            str += text.bidiTexts[i].str;
                        }
                        scientificAnnotation.pageLengths.push(str.length);
                        //if (scientificAnnotation.DEBUG) console.log("Cumulative page length = "+str.length);
                    }
                }
            }(j);
            var processPage = function processPage(pageData) {
                var content = pageData.getTextContent();
                content.then(processPageText(pageData, content));
            }
            page.then(processPage);
        }
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
        scientificAnnotation.hideAnnotationDisplayTable();
        if (!scientificAnnotation.DIV_RECOMMENDATIONS.is(':visible')) {
            scientificAnnotation.DIV_RECOMMENDATIONS.show();
        }
        var myDBpediaRecommendations = sparql.makeAjaxRequest(sparql.selectRecommendationsByDBpediaQuery());
        myDBpediaRecommendations.done( function(response) {
            if( response && response.results.bindings.length >0) {
                messageHandler.showSuccessMessage('DBpedia recommendations have been found for this file.');
                //console.log(response);
                var r = sparqlResponseParser.parseRecommendationsByDBpedia(response);
                console.log(JSON.stringify(r, null, 4));
            } else {
                //messageHandler.showWarningMessage('No recommendations found for this file.'); //too much noise
            }
        });
            
        var mySkosRecommendations = sparql.makeAjaxRequest(sparql.selectRecommendationsBySKOSCategoryQuery());
        mySkosRecommendations.done( function(response) {
            if( response && response.results.bindings.length >0) {
                messageHandler.showSuccessMessage('SKOS category based recommendations have been found for this file.');
                //console.log(response);
                var r = sparqlResponseParser.parseRecommendationsBySKOSCategory(response);
                console.log(JSON.stringify(r, null, 4));
            } else {
                //messageHandler.showWarningMessage('No recommendations found for this file.');
            }
        });
                        
        $.when( //when both ajax calls are done
            myDBpediaRecommendations,
            mySkosRecommendations
        ).then(function(){
            //alert("all done");
            scientificAnnotation.DIV_RECOMMENDATIONS.empty();
            var checkContexts = scientificAnnotation.checkAnnotationPairForContext();
            if (checkContexts.length >  0) scientificAnnotation.recommendationContextCheck(checkContexts); //add a looping ajax call here
            
            for (var paper in sparql.recommendations.papers) {
                scientificAnnotation.addRecommendation(paper);
                //alert(paper);
            }
        });
    },
    
    /**
     * Checks pairs of annotations for common context.
     *
     * @param {Array} of annotation pairs
     * @return void
     */
    recommendationContextCheck: function (annotationPairs) {
        
        var pair = annotationPairs[annotationPairs.length-1];
        var myRecommendationContext = sparql.makeAjaxRequest(sparql.selectCommonContextQuery(pair));
        myRecommendationContext.done( function(response) {
                if( response && response.results.bindings.length >0) {
                    messageHandler.showSuccessMessage('Common context found with another paper.'); 
                    //console.log(response);
                    var r = sparqlResponseParser.parseCommonContextQuery(response);
                    //console.log(JSON.stringify(r, null, 4));
                } else {
                    //messageHandler.showWarningMessage('No context found for this annotation pair.'); //too much noide
                }
        });
        annotationPairs.pop();
        if (annotationPairs.length > 0) scientificAnnotation.recommendationContextCheck(annotationPairs);
    },
    
    /**
     * Retrieves pairs of annotations that should be checked for common context.
     *
     * @return {Array} of annotation pairs.
     */
    checkAnnotationPairForContext: function () {
        var compareContexts = [];
            
        for (var paper in sparql.recommendations.papers) {
            for (var annotation in sparql.recommendations.papers[paper].annotations) {
                for (var grouping in sparql.recommendations.papers[paper].annotations[annotation]) {
                    if (grouping === "skos") {
                        for (var match in sparql.recommendations.papers[paper].annotations[annotation].skos) {
                            //console.log("Compare the following (that, this): " +annotation+ " - " + sparql.recommendations.papers[paper].annotations[annotation].skos[match].thisAnnotation);
                            compareContexts.push( [ annotation, sparql.recommendations.papers[paper].annotations[annotation].skos[match].thisAnnotation ]);
                        }
                    }
                    if (grouping === "dbpedia") {
                        for (var match in sparql.recommendations.papers[paper].annotations[annotation].dbpedia) {
                            //console.log("Compare the following (that, this): " +annotation+ " - " + sparql.recommendations.papers[paper].annotations[annotation].dbpedia[match].thisAnnotation);
                            compareContexts.push( [ annotation, sparql.recommendations.papers[paper].annotations[annotation].dbpedia[match].thisAnnotation ]);
                        }
                    }
                }
            }
        }
        if (scientificAnnotation.DEBUG) console.log("Fetch context for the following annotations: " + console.log(JSON.stringify(compareContexts, null, 4)));
        return compareContexts;
    },
    
    /**
     * This sets up event listeners
     * @return void
     */
    bindEventListeners: function(){
        //An event that is fired by PDF.js when the pdf loads. 
        window.addEventListener("documentload", function(evt) {
            scientificAnnotation.refreshOnNewPdfFileLoad();
            messageHandler.showWarningMessage("Please select some text in the PDF.")
            scientificAnnotation.countPageLengths();
        }, false);
        
        //An event that is fired by PDF.js when the page is rendered (loaded).
        window.addEventListener("pagerender", function(evt) {
            var pageHighlights = highlight.importedAnnotations.get(evt.detail.pageNumber);
            if (pageHighlights) { //apply highlights on the rendered page
                highlight.rangy_highlight(pageHighlights);
                highlight.importedAnnotations.empty(evt.detail.pageNumber); //now that highlight is applied, we can discard this
            }
            scientificAnnotation.renderAnnotatedPage(); //see if more pages need to be rendered
        }, false);
        
    },
    
    /**
     * Retrieves default properties from the database to be suggested when there are no properties related to the class chosen
     *
     * @return void
     */
    refreshProperties: function() {
        var refreshPropertiesRequest = sparql.makeAjaxRequest(sparql.selectDefaultPropertiesQuery());
        refreshPropertiesRequest.done( function(response) {
            var properties = sparqlResponseParser.parseResource(response);
            sparql.defaultProperties = properties;
            if (properties.length > 0) {
                scientificAnnotation.setAutoComputeDataForField(properties, scientificAnnotation.INPUT_PROPERTY);
                messageHandler.displayInfo("Refreshed "+properties.length+" properties.", scientificAnnotation.DIV_PROPERTY_COUNT, true);
            } else { 
                messageHandler.showWarningMessage("No properties were found.")
            }
        });
    },
    
    /**
     * Retrieves default ontologies
     * @param {String} ontologly URL
     * @param {Boolean} if true then retrieves properties from the ontology as well.
     * @return void
     */
    loadOntologyResources: function(ontologyURL, doLoadProperties) {
        var ontologyClasses = sparql.makeAjaxRequest(sparql.selectOntologyClasses(ontologyURL));
        var ontologyProperties;
        ontologyClasses.done( function(response) {
            var autoComputeClasses = sparqlResponseParser.parseOntologyClasses(response, ontologyURL);
            if (autoComputeClasses.length > 0) {
                scientificAnnotation.setAutoComputeDataForField(autoComputeClasses, scientificAnnotation.INPUT_SUBJECT);
                messageHandler.displayInfo("Refreshed "+autoComputeClasses.length+" classes.", scientificAnnotation.DIV_SUBJECT_COUNT, true);
                scientificAnnotation.setAutoComputeDataForField(autoComputeClasses, scientificAnnotation.INPUT_OBJECT);
            } else { 
                messageHandler.showWarningMessage("No classes were extracted from '" +ontologyURL+ "' ontology.")
            }
        });
        if (doLoadProperties) {
            ontologyProperties = sparql.makeAjaxRequest(sparql.selectOntologyProperties(ontologyURL));
            ontologyProperties.done( function(response) {
                var autoComputeProperties = sparqlResponseParser.parseOntologyProperties(response, ontologyURL);
                if (autoComputeProperties.length > 0) {
                    scientificAnnotation.setAutoComputeDataForField(autoComputeProperties, scientificAnnotation.INPUT_PROPERTY);
                    messageHandler.displayInfo("Refreshed "+autoComputeProperties.length+" properties.", scientificAnnotation.DIV_PROPERTY_COUNT, true);
                } else { 
                    messageHandler.showWarningMessage("No properties were extracted from '" +ontologyURL+ "' ontology.")
                }
            });
        }
    },
    
    /**
     * Initialize the document
     *
     * @return void
     */
    init:function(){
        //UI
        scientificAnnotation.BTN_ADD = $("#addAnnotationButton");
        scientificAnnotation.BTN_RECOMMENDER = $("#showSimilarSearchButton");
        scientificAnnotation.BTN_ANNOTATIONS = $("#queryButton");
        scientificAnnotation.BTN_TABLE = $("#annotateTableButton");
        scientificAnnotation.BTN_RESET = $("#resetAnnotationButton");
        scientificAnnotation.BTN_SELECT_TEXT = $("#objectTextSelection");
        scientificAnnotation.BTN_ADD_VOCABULARY = $("#addVocabulary");
        scientificAnnotation.INPUT_SUBJECT = $("#subjectValueInput");
        scientificAnnotation.INPUT_PROPERTY = $("#propertyValueInput");
        scientificAnnotation.INPUT_OBJECT = $("#objectValueInput");
        scientificAnnotation.INPUT_VOCABULARY = $("#vocabulary");
        scientificAnnotation.DIV_TAB_ANNOTATIONS = $("#textAnnotations");
        scientificAnnotation.DIV_VIEWER = $("#viewer");
        scientificAnnotation.DIV_ANNOTATIONS = $("#simpleAnnotatePanel");
        scientificAnnotation.DIV_ANNOTATION_INPUTS = $("#annotationInputArea");
        scientificAnnotation.DIV_ADDED = $("#displayAnnotationResult");
        scientificAnnotation.DIV_SUBJECTS = $("#displaySubjectURI");
        scientificAnnotation.DIV_PROPERTY_COUNT = $("#propertyCount");
        scientificAnnotation.DIV_SUBJECT_COUNT = $("#subjectCount");
        scientificAnnotation.DIV_OBJECTS = $("#displayObjectURI");
        scientificAnnotation.DIV_RECOMMENDATIONS = $("#recommendations");
        scientificAnnotation.DIV_TRIPLES = $("#displayTriples");
        scientificAnnotation.DIV_DATACUBES = $("#viewSelectedInfoFromPfdTable");
        scientificAnnotation.DIV_VOCABULARIES = $("#vocabularyList");
        scientificAnnotation.DIV_DRAWING = $("#drawing");
        scientificAnnotation.DIV_DRAWING_SUBJECT = $("#visualSubject");
        scientificAnnotation.DIV_DRAWING_OBJECT = $("#visualObject");
        scientificAnnotation.DIV_DRAWING_PROPERTY = $("#visualProperty");
        
        messageHandler.showWarningMessage("Please open a PDF document on the left pane.")
        scientificAnnotation.bindClickEventForButtons();
        scientificAnnotation.bindEventForInputs();
        scientificAnnotation.bindEventListeners();
        scientificAnnotation.bindEventsForPDF();
        scientificAnnotation.refreshProperties();
        //$('[data-toggle=tooltip]').tooltip(); //fix div positions first and try again, currently shifts positions when you click outside of inputs
        scientificAnnotation.loadOntologyResources(sparql.ONTOLOGY_SDEO, false);
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