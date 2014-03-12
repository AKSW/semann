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
    addAnnotation:function(property, subject, object, textStartPos, textEndPos){

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
        var charStart = textStartPos, charEnd = textEndPos,length = (textEndPos - textStartPos);

        var URIs = '<http://eis.iai.uni-bonn.de/semann/pdf/'+fileName+'#page='+currentPage+'&char='+charStart+','+charEnd+';length='+length+',UTF-8>';
        var camelProp = sparql.camelCase(property);
        var camelObject = sparql.camelCase(object);

//        console.log('camelProp::'+camelProp);
//        console.log('camelObject::'+camelObject);

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
                        'semannp:'+camelProp+' semann:'+camelObject+' .'+'\n'+
                        'semannp:'+camelProp+'  rdfs:label "'+property+'"@en. '+'\n'+
                        'semann:'+camelObject+' rdfs:label "'+object+'"@en. '+'\n'+
                '} ' +'\n'+
            '}';

//        console.log(insertQuery);
//        return;


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
                sparql.bindAutoCompleteProperty('');
                scientificAnnotation.hideAnnotationDisplayTable();
                alert('successfully add to sparql :-)');
            },
            error: function(jqXHR, textStatus, ex){
                //console.log("error occur while insert data:"+ textStatus + "," + ex + "," + jqXHR.responseText);
                alert("Error occur while insert data using Sparql :"+ textStatus + "," + ex + "," + jqXHR.responseText);

            }
        });

    },


    /**
     *
     * @param searchItem
     * @returns {Array}
     */
    bindAutoCompleteProperty :function(searchItem){

        if(searchItem == null){
            searchItem = '';
        }

        /**
         SELECT distinct  str(?label) as ?PROPERTY FROM <scientificAnnotation>
         WHERE
         {
           ?p <http://www.w3.org/2000/rdf-schema#label> ?label
           FILTER(STRSTARTS(STR(?p), "http://eis.iai.uni-bonn.de/semann/property#"))
         }
         ORDER BY fn:lower-case(?LABEL) LIMIT 200
         }
         */

        var selectQuery = 'SELECT distinct  str(?label) as ?PROPERTY FROM  <'+scientificAnnotation.GRAPH_NAME+'> ' +'\n'+
            ' WHERE ' +'\n'+
            '{ ' +'\n'+
                '?p <http://www.w3.org/2000/rdf-schema#label> ?label ' +'\n'+
                'FILTER(STRSTARTS(STR(?p), "http://eis.iai.uni-bonn.de/semann/property#"))' +'\n'+
            '} ORDER BY fn:lower-case(?LABEL) LIMIT 200';

//        console.log(selectQuery);return;

        var source = null;

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
                source = sparql.parseProperty(response);
                scientificAnnotation.setAutoComputeDataForPropertyField(source);
            },
            error: function(jqXHR, textStatus, ex){
                //console.log("error occur while select :"+ textStatus + "," + ex + "," + jqXHR.responseText);
                alert("Error occur while reading using Sparql :"+ textStatus + "," + ex + "," + jqXHR.responseText);
            }
        });

        console.log(source);

        return source;

    },

    /**
     *
     * @param str
     * @returns {XML|string|void|*}
     */
    camelCase :function (str){
        str     = $.camelCase(str.replace(/[_ ]/g, '-')).replace(/-/g, '');
        return  str;//.substring(0,1).toUpperCase()+str.substring(1);
    },


    /**
     *
     * @param response
     */
    parseResponse:function(response){

        $.each(response, function(name, value) {
            if(name == 'results'){
                $.each(value.bindings, function(index,item) {
                    scientificAnnotation.addDataToSparqlTableView(
                        item.SUBJECT.value,
                        item.PROPERTY.value,
                        item.OBJECT.value
                    );

                });
            }
        });
    },

    /**
     *
     * @param response
     * @returns {Array}
     */
    parseProperty:function(response) {

        var items = [];

        $.each(response, function(name, value) {
            if(name == 'results'){
                $.each(value.bindings, function(index,item) {
                    items.push(item.PROPERTY.value);
                });
            }
        });
        return items;
    }


};

