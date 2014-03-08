/**
 * Created with JetBrains PhpStorm.
 * User: Islam_s
 * Date: 21.11.13
 * Time: 11:32
 * To change this template use File | Settings | File Templates.
 */


var sparql  = {


SERVER_ADDRESS : "http://localhost:8890/sparql",


    /**
     *Read data form sparql table and dispaly
     *
     */
    showDataFromSparql:function (){

        // select query
        /*
         SELECT ?excerpt ?s ?p ?o FROM <scientificAnnotation> WHERE
         {
             <http://eis.iai.uni-bonn.de/semann/pdf/test6.pdf> <http://eis.iai.uni-bonn.de/semann/publication/hasExcerpt> ?excerpt .
             ?excerpt <http://www.w3.org/2000/rdf-schema#label> ?s. ?excerpt ?prop ?obj.
             ?prop <http://www.w3.org/2000/rdf-schema#label> ?p.
             ?obj <http://www.w3.org/2000/rdf-schema#label> ?o.
         }
        * */

        var fileName = document.title.toString();
        var selectQuery = 'SELECT distinct str(?SUBJECT) as ?SUBJECT str(?PROPERTY) as ?PROPERTY str(?OBJECT) as ?OBJECT FROM  <'+scientificAnnotation.GRAPH_NAME+'> WHERE ' +
            '{ ' +
                '<http://eis.iai.uni-bonn.de/semann/pdf/'+fileName+'> <http://eis.iai.uni-bonn.de/semann/publication/hasExcerpt> ?excerpt . ' +
                '?excerpt <http://www.w3.org/2000/rdf-schema#label> ?SUBJECT. ?excerpt ?prop ?obj. ' +
                '?prop <http://www.w3.org/2000/rdf-schema#label> ?PROPERTY. ' +
                '?obj <http://www.w3.org/2000/rdf-schema#label> ?OBJECT.' +
            '}';

        $.ajax({
            type: "GET",
            url: sparql.SERVER_ADDRESS,
            data: {
                query: selectQuery,
                format: "application/json"
            },
            async: true,
            dataType: "jsonp",
            crossDomain: true,
            cache: false,
            success: function(response){
                scientificAnnotation.displayAvailableAnnotationFromSparql();
                sparql.parseResponse(response);
            },
            error: function(jqXHR, textStatus, ex){
                //console.log("error occur while select :"+ textStatus + "," + ex + "," + jqXHR.responseText);
                alert("Error occur while reading using Sparql :"+ textStatus + "," + ex + "," + jqXHR.responseText);
            }
        });
    },

    /**
     *
     * @param subject
     * @param property
     * @param object
     */
    addAnnotation:function(property, subject, object){

        // insert query
        /*
         prefix semann: <http://eis.iai.uni-bonn.de/semann/owl#>
         prefix semannp: <http://eis.iai.uni-bonn.de/semann/property#>
         prefix semannpub: <http://eis.iai.uni-bonn.de/semann/publication/>
         prefix semannpdf: <http://eis.iai.uni-bonn.de/semann/pdf/>
         prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns>
         prefix rdfs: <http://www.w3.org/2000/rdf-schema#>

         INSERT DATA
         {
         GRAPH <scientificAnnotation>
         {
         semannpdf:test6.pdf rdf:type semannpub:Publication.
         semannpdf:test6.pdf semannpub:hasExcerpt <http://eis.iai.uni-bonn.de/semann/pdf/test6.pdf#page=2&char=100,20;length=10,UTF-8> .
         <http://eis.iai.uni-bonn.de/semann/pdf/test6.pdf#page=2&char=100,20;length=10,UTF-8> rdfs:label "santa."@en;
         semannp:isAbstact4 semann:Abstract4.
         semannp:isAbstact4 rdfs:label "is busy na"@en.
         semann:Abstract4 rdfs:label "sleeping na"@en.
         }
         }
         */

        var fileName = document.title.toString();
        var uri = 'semannpdf:'+fileName;
        var currentPage = $('#pageNumber').val();
        var charStart = 10, charEnd=10, length=15;

        var URIs = '<http://eis.iai.uni-bonn.de/semann/pdf/'+fileName+'#page='+currentPage+'&char='+charStart+','+charEnd+';length='+length+',UTF-8>';

        var insertQuery =
                'prefix semann: <http://eis.iai.uni-bonn.de/semann/owl#>' +'\n'+
                'prefix semannp: <http://eis.iai.uni-bonn.de/semann/property#>'+'\n'+
                'prefix semannpub: <http://eis.iai.uni-bonn.de/semann/publication/>' +'\n'+
                'prefix semannpdf: <http://eis.iai.uni-bonn.de/semann/pdf/>' +'\n'+
                'prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns>' +'\n'+
                'prefix rdfs: <http://www.w3.org/2000/rdf-schema#>'+'\n'+
            'INSERT DATA ' +'\n'+
            '{ ' +'\n'+
                'GRAPH <'+scientificAnnotation.GRAPH_NAME+'> ' +'\n'+
                '{ ' +'\n'+
                        uri+' rdf:type semannpub:Publication. '+'\n'+
                        uri+' semannpub:hasExcerpt '+ URIs +' .'+'\n'+
                        URIs +' rdfs:label "'+subject+'"@en; ' +'\n'+
                        'semannp:isAbstact semann:Abstract. '+'\n'+
                        'semannp:isAbstact rdfs:label "'+property+'"@en. '+'\n'+
                        'semann:Abstract rdfs:label "'+object+'"@en. '+'\n'+
                '} ' +'\n'+
            '}';


        $.ajax({
            type: "GET",
            url: sparql.SERVER_ADDRESS,
            data: {
                query: insertQuery,
                format: "application/json"
            },
            async: true,
            dataType: "jsonp",
            crossDomain: true,
            cache: false,
            success: function(response){
                console.log('add successfully');
                alert('successfully add to sparql :-)');
            },
            error: function(jqXHR, textStatus, ex){
                //console.log("error occur while insert data:"+ textStatus + "," + ex + "," + jqXHR.responseText);
                alert("Error occur while insert data using Sparql :"+ textStatus + "," + ex + "," + jqXHR.responseText);

            }
        });

    },


    parseResponse:function(response){

        $.each(response, function(name, value) {
            if(name == 'results'){

//                console.log(value.bindings);
                $.each(value.bindings, function(index,item) {
                    scientificAnnotation.addDataToSparqlTableView(
                        item.SUBJECT.value,
                        item.PROPERTY.value,
                        item.OBJECT.value
                    );

//                        console.log(item.PROPERTY.value);
//                        console.log(item.SUBJECT.value);
//                        console.log(item.SUBJECT.value);
                });
            }
        });
    }


};

