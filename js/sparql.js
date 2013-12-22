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

        var selectQuery = 'SELECT * FROM <'+scientificAnnotation.GRAPH_NAME+'> WHERE { ?SUBJECT ?PROPERTY  ?OBJECT }';

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
                console.log("error occur while select :"+ textStatus + "," + ex + "," + jqXHR.responseText);
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



        var insertQuery = 'INSERT DATA { GRAPH <'+scientificAnnotation.GRAPH_NAME+'> { <' + subject + '> <' + property + '> <' + object + '> } }';

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
                //scientificAnnotation.displayAvailableAnnotationFromSparql();
                alert('successfully add to sparql :-)');
            },
            error: function(jqXHR, textStatus, ex){
                console.log("error occur while insert data:"+ textStatus + "," + ex + "," + jqXHR.responseText);
            }
        });

    },


    parseResponse:function(response){

        $.each(response, function(name, value) {
            if(name == 'results'){

                console.log(value.bindings);
                $.each(value.bindings, function(index,item) {

                    scientificAnnotation.addDataToSparqlTableView(
                        item.PROPERTY.value,
                        item.SUBJECT.value,
                        item.SUBJECT.value
                    );
//                        console.log(item.PROPERTY.value);
//                        console.log(item.SUBJECT.value);
//                        console.log(item.SUBJECT.value);
                });
            }
        });
    }


};

