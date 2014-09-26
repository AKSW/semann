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
    
    /**
     * bypasses dbLookup.showDataFromDBlookup ajax 
     *
     * @return void
     */
    bypassAjaxCall: function (targetInfoElement){
        if (test.NO_INTERNET) {
            alert();
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
                scientificAnnotation.displayInfo(message, targetInfoElement);
            } else {
                scientificAnnotation.displayInfo("No matches found in DBpedia.org.", targetInfoElement, true);
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
        
        $("#tripleView").bind("click", function () { //jaana test - delete when done testing userTriple
            if (scientificAnnotation.DEBUG) console.log("Triple view: \n" +JSON.stringify(sparql.triple, null, 4));
        });
        
        $("#test").bind("click", function () { //jaana test - delete when done testing userTriple
            alert();
        });
    },
    
    /**
     * Initialize the document
     *
     * @return void
     */
    init:function(){
        //alert("Initialising test.init()");
        test.bindEvents();
    }
};