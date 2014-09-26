
/**
* Created by nipo on 7/8/14.
* */

/*global QUnit:false, sparqlUnitTest:false, sparqlResponseParserUnitTest :false */

QUnit.module( "Sparql Unit Test for our EIS Lab" );
QUnit.test( "Sparql Server Url Validity", function( assert ) {
    var serverUrl = "http://localhost:8890/sparql";
    assert.ok( true === sparqlUnitTest.testIsSparqlServerUrlValid(serverUrl), "Sparql End point URL is valid!" );
});

QUnit.test( " Camel Case test ", function( assert ) {
    assert.ok( true === sparqlUnitTest.convertCamelCaseSuccessTest(), " Camel case test success!" );
    assert.ok( false === sparqlUnitTest.convertCamelCaseFailTest(), " Camel case test fail!" );

});

QUnit.module("DataCube testing");
dataCubeSparqlUnitTest.testDataCube(QUnit);

 
