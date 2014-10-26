/**
This file serves for testing purposes only

@authors : Jaana Takis
 */
 
"use strict";
var test  = {

    NO_INTERNET: false, //Allows you to emulate online DBpedia Lookup requests via dummy json response
    //DBpedia Lookup dummy json string for when there is no internet
    DB_JSON: {
        results: [
            {
                uri: "http://dbpedia.org/resource/Berlin",
                label: "Berlin",
                description: "Berlin is the capital city of Germany and one of the 16 states of Germany. With a population of 3.5 million people, Berlin is Germany's largest city and is the second most populous city proper and the eighth most populous urban area in the European Union. Located in northeastern Germany, it is the center of the Berlin-Brandenburg Metropolitan Region, which has 5.9 million residents from over 190 nations. Located in the European Plains, Berlin is influenced by a temperate seasonal climate.",
                refCount: 18984,
                classes: [
                    {
                        uri: "http://dbpedia.org/ontology/Place",
                        label: "place"
                    },
                    {
                        uri: "http://schema.org/City",
                        label: "city"
                    },
                    {
                        uri: "http://schema.org/Place",
                        label: "place"
                    },
                    {
                        uri: "http://dbpedia.org/ontology/City",
                        label: "city"
                    },
                    {
                        uri: "http://www.w3.org/2002/07/owl#Thing",
                        label: "owl#Thing"
                    },
                    {
                        uri: "http://dbpedia.org/ontology/PopulatedPlace",
                        label: "populated place"
                    },
                    {
                        uri: "http://dbpedia.org/ontology/Settlement",
                        label: "settlement"
                    }
                ],
                categories: [
                    {
                        uri: "http://dbpedia.org/resource/Category:States_and_territories_established_in_1237",
                        label: "States and territories established in 1237"
                    },
                    {
                        uri: "http://dbpedia.org/resource/Category:City-states",
                        label: "City-states"
                    },
                    {
                        uri: "http://dbpedia.org/resource/Category:States_of_Germany",
                        label: "States of Germany"
                    },
                    {
                        uri: "http://dbpedia.org/resource/Category:Populated_places_established_in_the_13th_century",
                        label: "Populated places established in the 13th century"
                    },
                    {
                        uri: "http://dbpedia.org/resource/Category:German_state_capitals",
                        label: "German state capitals"
                    },
                    {
                        uri: "http://dbpedia.org/resource/Category:Berlin",
                        label: "Berlin"
                    },
                    {
                        uri: "http://dbpedia.org/resource/Category:Host_cities_of_the_Summer_Olympic_Games",
                        label: "Host cities of the Summer Olympic Games"
                    },
                    {
                        uri: "http://dbpedia.org/resource/Category:Members_of_the_Hanseatic_League",
                        label: "Members of the Hanseatic League"
                    },
                    {
                        uri: "http://dbpedia.org/resource/Category:Capitals_in_Europe",
                        label: "Capitals in Europe"
                    },
                    {
                        uri: "http://dbpedia.org/resource/Category:European_Capitals_of_Culture",
                        label: "European Capitals of Culture"
                    }
                ],
                templates: [],
                redirects: []
            }
        ]
    }, 
    pageLengths: [],
    
    /**
     * bypasses dbLookup.showDataFromDBlookup ajax 
     *
     * @return void
     */
    bypassAjaxCall: function (targetInfoElement){
        if (test.NO_INTERNET) {
            var fakeResponse;
            if (targetInfoElement.is(scientificAnnotation.DIV_SUBJECTS)) {
                dbLookup.dbSubjectResponse = test.DB_JSON;
                fakeResponse = test.DB_JSON;
            }
            else if (targetInfoElement.is(scientificAnnotation.DIV_OBJECTS)) {
                dbLookup.dbObjectResponse = test.DB_JSON;
                fakeResponse = test.DB_JSON;
            }
            if (scientificAnnotation.DEBUG) console.log(JSON.stringify(fakeResponse, null, 4));
            var message = dbLookup.formatResponse(fakeResponse, targetInfoElement);
            if (message) {
                messageHandler.displayInfo(message, targetInfoElement);
            } else {
                messageHandler.displayInfo("No matches found in DBpedia.org.", targetInfoElement, true);
            }
            return; //break
        }
    },
        
    /**
     * bind the click event for buttons
     *
     * @return void
     */
    bindEvents: function () {
                
        $("#test").bind("click", function () {
            var myDBpediaRecommendations = sparql.makeAjaxRequest(sparql.selectRecommendationsByDBpediaQuery());
            myDBpediaRecommendations.done( function(response) {
                if( response && response.results.bindings.length >0) {
                    console.log(response);
                    var r = sparqlResponseParser.parseRecommendationsByDBpedia(response);
                    console.log(JSON.stringify(r, null, 4));
                } else {
                    messageHandler.showWarningMessage('No recommendations found for this file.');
                }
            });
            
            var mySkosRecommendations = sparql.makeAjaxRequest(sparql.selectRecommendationsBySKOSCategoryQuery());
            //var mySkosRecommendations = sparql.makeAjaxRequest(sparql.selectRecommendationsBySKOSCategoryQuery());
            //var mySkosRecommendations = sparql.makeAjaxRequest(sparql.selectRecommendationsBySKOSCategoryQueryNew());
            mySkosRecommendations.done( function(response) {
                if( response && response.results.bindings.length >0) {
                    console.log(response);
                    var r = sparqlResponseParser.parseRecommendationsBySKOSCategory(response);
                    console.log(JSON.stringify(r, null, 4));
                    
                } else {
                    messageHandler.showWarningMessage('No recommendations found for this file.');
                }
            });
            
            var myRecommendationInfo;
            
            $.when( //when both ajax calls are done
                myDBpediaRecommendations,
                mySkosRecommendations
            ).then(function(){
                alert("all done");
                test.getContext();
                for (var paper in sparql.recommendations.papers) {
                    var splitArray = paper.split("/");
                    scientificAnnotation.addRecommendation(splitArray[splitArray.length-1]);
                }
            });
            /*
            var s = window.getSelection();
            var oRange = s.getRangeAt(0); //get the text range
            var oRect = oRange.getBoundingClientRect();
            console.log(oRect);
            */
        });
    },
    
    /**
     * Retrieves the context of recommendations
     *
     * @return void
     */
    getContext: function () {
        var contexts = [];
        for (var paper in sparql.recommendations.papers) {
            for (var annotation in sparql.recommendations.papers[paper].annotations) {
                contexts.push(annotation);
            }
        }
        console.log(contexts);
    },
    
    ajaxHandler: function (response) {
        if( response!= null && response.results.bindings.length >0) {
            alert("success: "+response.results.bindings.length);
            console.log(JSON.stringify(response, null, 4));
        } else {
            alert("0 length");
        }
    },
    
    /**
     * Finds the length of text per page. Values are cumulative and are assigned to the global array and are assigned asynchronously
     *
     * @return void
     */
    
    countPageLengths: function () {
            var pageTotal = PDFView.pages.length;
            test.pageLengths = [];
            var str = "";
            for (var j = 1; j <= pageTotal; j++) {
                var page = PDFView.getPage(j);
                var processPageText = function processPageText(pageIndex) {
                  return function(pageData, content) {
                    return function(text) {
                      for (var i = 0; i < text.bidiTexts.length; i++) {
                        str += text.bidiTexts[i].str;
                      }
                        test.pageLengths.push(str.length);
                      //if (pageData.pageInfo.pageIndex === currentPage - 1) {
                        // later this will insert into an index
                        //console.log("\n"+str);
                        console.log("Cumulative["+j+"] page length = "+str.length);
                      //}
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
    
    //not working properly for the whole document, does one page at a time
    renderPDF: function () {
        var func,
            def = $.Deferred(),
            promise = $.Deferred().resolve().promise(),         
            makeRunner = function(func, args) {
                return function() {
                    return func.call(null, args);
                };
            };
        
        function renderPage(page) {
            if (scientificAnnotation.DEBUG) console.log("\tRendering page["+page.id+"] state: "+page.renderingState);
            var def = $.Deferred();
            PDFView.renderView(page, "page");
            if (PDFView.isViewFinished(page)) {
                if (scientificAnnotation.DEBUG) console.log("\tRendering finished! page["+page.id+"] state: "+page.renderingState);
                //def.resolve();
            }
            def.done(function() {
                alert("This page done! "+page.id);
            });
            return def.promise();
        }
        
        function renderPages(pdfDoc) {
            //alert("entered renderPages");
            $.each(PDFView.pages, function(index, page) {
                if (scientificAnnotation.DEBUG) console.log("Loop page["+page.id+"] state="+page.renderingState);
                if (!PDFView.isViewFinished(page)) {
                    func = renderPage;
                    promise = promise.then(makeRunner(func, page))
                    
                    if (scientificAnnotation.DEBUG) console.log("\tPage["+page.id+"] state="+page.renderingState);
                }
            });
        }
        
        function test(ms) {
              var deferred = $.Deferred();
              setTimeout(deferred.resolve, ms);

             // We just need to return the promise not the whole deferred.
             return deferred.promise();
          }
        
        PDFJS.disableWorker = true;
          /*
        var pagePromise = PDFView.pdfDocument.getPage(1);
        pagePromise.then(function(page) {
            alert("**");
            var output = '';
            for (property in page) {
              output += property + ': ' + page[property]+'; ';
            }
            console.log(output);
        });
        //console.log("\n pagePromise: "+JSON.stringify(pagePromise.state(), null, 4));
          */
        renderPages(PDFView.pages);
        promise.done(function() {
            alert("All pages done!");
        });
    },
    
    
    /**
     * Initialize the document
     *
     * @return void
     */
    init:function(){
        test.bindEvents();
        /*
        test.def.done(function() {
            alert("Deferred resolved and will stay resolved unless you change status!");
        });*/
    }
};