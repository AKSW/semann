/**
 This file contain all the necessary sparql related queries,
 that need to perform.

 @dependency

 scientificAnnotation.js
 highlight.js

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
         SELECT distinct ?excerpt str(?SUBJECT) as ?SUBJECT str(?PROPERTY) as ?PROPERTY str(?OBJECT) as ?OBJECT FROM  <scientificAnnotation> WHERE
         {
             <http://eis.iai.uni-bonn.de/semann/pdf/test6.pdf> <http://eis.iai.uni-bonn.de/semann/publication/hasExcerpt> ?excerpt .
             ?excerpt <http://www.w3.org/2000/rdf-schema#label> ?SUBJECT. ?excerpt ?prop ?obj.
             ?prop <http://www.w3.org/2000/rdf-schema#label> ?PROPERTY.
             ?obj <http://www.w3.org/2000/rdf-schema#label> ?OBJECT.
         }
        * */

        var fileName = encodeURI(document.title.toString());
        var selectQuery = 'SELECT distinct str(?excerpt) as ?excerpt str(?SUBJECT) as ?SUBJECT str(?PROPERTY) as ?PROPERTY str(?OBJECT) as ?OBJECT FROM  <'+scientificAnnotation.GRAPH_NAME+'> WHERE ' +
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

                if( response!= null && response.results.bindings.length >0) {
                    scientificAnnotation.displayAvailableAnnotationFromSparql();
                    var fragments = sparqlResponseParser.parseResponse(response);
//                    console.log("total fragments:" +fragments.length);
                    highlight.rangy_highlight(fragments);
                } else {
                    scientificAnnotation.noAvailableAnnotationFromSparql();
                }
            },
            error: function(jqXHR, textStatus, ex){
                //console.log("error occur while select :"+ textStatus + "," + ex + "," + jqXHR.responseText);
                alert("Error occur while reading using Sparql :"+ textStatus + "," + ex + "," + jqXHR.responseText);
            }
        });
    },

    /**
     *
     * @param property
     * @param subject
     * @param object
     * @param textStartPos
     * @param textEndPos
     * @param rangyPage
     * @param rangyFragment
     */
    addAnnotation:function(property, subject, object, textStartPos, textEndPos, rangyPage, rangyFragment){
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

        var fileName = encodeURI(document.title.toString());
	
        var uri = '<http://eis.iai.uni-bonn.de/semann/pdf/'+fileName+'>';
        var currentPage = $('#pageNumber').val();
        var charStart = textStartPos, charEnd = textEndPos,length = (textEndPos - textStartPos);

        var URIs = '<http://eis.iai.uni-bonn.de/semann/pdf/'+fileName+'#page='+currentPage+'?char='+charStart+','+charEnd+';length='+length+',UTF-8&rangyPage='+rangyPage+'&rangyFragment='+rangyFragment+'>';
        var camelProp = sparql.camelCase(property);
        var camelObject = sparql.camelCase(object);

        var insertQuery =
                'prefix semann: <http://eis.iai.uni-bonn.de/semann/owl#>' +'\n'+
                'prefix semannp: <http://eis.iai.uni-bonn.de/semann/property#>'+'\n'+
                'prefix semannpub: <http://eis.iai.uni-bonn.de/semann/publication/>' +'\n'+
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
                console.log('added successfully');
                sparql.bindAutoCompleteProperty();
                sparql.bindAutoCompleteObject();
                scientificAnnotation.hideAnnotationDisplayTable();
                alert('successfully add to sparql :-)');
            },
            error: function(jqXHR, textStatus, ex){
                alert("Error occur while insert data using Sparql :"+ textStatus + "," + ex + "," + jqXHR.responseText);
            }
        });
    },

    /**
     * Provide the data for the auto complete in the property field
     * @param searchItem
     * @returns {Array}
     */
    bindAutoCompleteProperty :function(){

        /**
         SELECT distinct  str(?label) as ?PROPERTY FROM <scientificAnnotation>
         WHERE
         {
           ?p <http://www.w3.org/2000/rdf-schema#label> ?label
           FILTER(STRSTARTS(STR(?p), "http://eis.iai.uni-bonn.de/semann/property#"))
         }
         ORDER BY fn:lower-case(?PROPERTY) LIMIT 200


         */

        var selectQuery = 'SELECT distinct  str(?label) as ?PROPERTY FROM  <'+scientificAnnotation.GRAPH_NAME+'> ' +'\n'+
            ' WHERE ' +'\n'+
            '{ ' +'\n'+
                '?p <http://www.w3.org/2000/rdf-schema#label> ?label ' +'\n'+
                'FILTER(STRSTARTS(STR(?p), "http://eis.iai.uni-bonn.de/semann/property#"))' +'\n'+
            '} ORDER BY fn:lower-case(?PROPERTY) LIMIT 200';

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
                source = sparqlResponseParser.parseProperty(response);
                scientificAnnotation.setAutoComputeDataForPropertyField(source);
            },
            error: function(jqXHR, textStatus, ex){
                //console.log("error occur while select :"+ textStatus + "," + ex + "," + jqXHR.responseText);
                alert("Error occur while reading using Sparql :"+ textStatus + "," + ex + "," + jqXHR.responseText);
            }
        });

        return source;
    },


    /**
     * Provide the data for the auto complete in the  object field
     * @param searchItem
     * @returns {Array}
     */
    bindAutoCompleteObject :function(){

        /**
         SELECT distinct  str(?label) as ?OBJECT FROM <scientificAnnotation>
         WHERE
         {
           ?o <http://www.w3.org/2000/rdf-schema#label> ?label
           FILTER(STRSTARTS(STR(?o), "http://eis.iai.uni-bonn.de/semann/owl#"))
         }
         ORDER BY fn:lower-case(?OBJECT) LIMIT 200

         */

        var selectQuery = 'SELECT distinct  str(?label) as ?OBJECT FROM  <'+scientificAnnotation.GRAPH_NAME+'> ' +'\n'+
            ' WHERE ' +'\n'+
            '{ ' +'\n'+
                '?o <http://www.w3.org/2000/rdf-schema#label> ?label ' +'\n'+
                'FILTER(STRSTARTS(STR(?o), "http://eis.iai.uni-bonn.de/semann/owl#"))' +'\n'+
            '} ORDER BY fn:lower-case(?OBJECT) LIMIT 200';

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
                source = sparqlResponseParser.parseObject(response);
                scientificAnnotation.setAutoComputeDataForObjectField(source);
            },
            error: function(jqXHR, textStatus, ex){
                alert("Error occur while reading using Sparql :"+ textStatus + "," + ex + "," + jqXHR.responseText);
            }
        });

        return source;
    },


    /**
     * Provide the data for the auto complete in the property field
     * @param searchItem
     * @returns {Array}
     */
    findSimilarFiles :function(){

        /**
         SELECT ?file WHERE
         {
            SELECT ?file ?s ?p ?o ?curr_o FROM <scientificAnnotation> WHERE
            {
              { #returns objects of currently open file
                <http://eis.iai.uni-bonn.de/semann/pdf/sample.pdf> <http://eis.iai.uni-bonn.de/semann/publication/hasExcerpt> ?curr_excerpt .
                ?curr_excerpt ?curr_prop ?curr_obj.
                ?curr_obj <http://www.w3.org/2000/rdf-schema#label> ?curr_o.
              }
              { #returns files with the same objects
                ?file <http://eis.iai.uni-bonn.de/semann/publication/hasExcerpt> ?excerpt .
                ?excerpt <http://www.w3.org/2000/rdf-schema#label> ?s. ?excerpt ?prop ?obj.
                ?prop <http://www.w3.org/2000/rdf-schema#label> ?p.
                ?obj <http://www.w3.org/2000/rdf-schema#label> ?o.
              }
              FILTER (?obj in (?curr_obj) and !sameTerm(<http://eis.iai.uni-bonn.de/semann/pdf/sample.pdf>, ?file)) #match objects in other files only
            }
         } GROUP BY ?file
                     ORDER BY DESC(count(?file)) #file ranking by no. of object hits
                     LIMIT 10
         */

        var fileName = encodeURI(document.title.toString());
        var selectQuery =
            ' SELECT ?file ' +'\n'+
                ' WHERE ' +'\n'+
                '{' +
                    'SELECT ?file ?s ?p ?o ?curr_o FROM <'+scientificAnnotation.GRAPH_NAME+'> ' +'\n'+
                    ' WHERE ' +'\n'+
                    '{' +'\n'+
                        '{' +'\n'+
                            '<http://eis.iai.uni-bonn.de/semann/pdf/'+fileName+'> <http://eis.iai.uni-bonn.de/semann/publication/hasExcerpt> ?curr_excerpt .' +'\n'+
                            '?curr_excerpt ?curr_prop ?curr_obj.' +'\n'+
                            '?curr_obj <http://www.w3.org/2000/rdf-schema#label> ?curr_o.' +'\n'+
                        '}' +'\n'+
                        '{' +'\n'+
                            '?file <http://eis.iai.uni-bonn.de/semann/publication/hasExcerpt> ?excerpt .' +'\n'+
                            '?excerpt <http://www.w3.org/2000/rdf-schema#label> ?s. ?excerpt ?prop ?obj.' +'\n'+
                            '?prop <http://www.w3.org/2000/rdf-schema#label> ?p.' +'\n'+
                            '?obj <http://www.w3.org/2000/rdf-schema#label> ?o.' +'\n'+
                        '}' +'\n'+
                        ' FILTER (?obj in (?curr_obj) and !sameTerm(<http://eis.iai.uni-bonn.de/semann/pdf/'+fileName+'>, ?file))' +'\n'+
                    '}' +'\n'+
                '}' +'\n'+
                ' GROUP BY ?file ' +'\n'+
                ' ORDER BY DESC(count(?file))  LIMIT 10'
            ;
//        console.log(selectQuery);
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
                source = sparqlResponseParser.parseSimilarSearch(response);
                scientificAnnotation.setSimilarSearchResult(source);
            },
            error: function(jqXHR, textStatus, ex){
                //console.log("error occur while select :"+ textStatus + "," + ex + "," + jqXHR.responseText);
                alert("Error occur while reading using Sparql :"+ textStatus + "," + ex + "," + jqXHR.responseText);
            }
        });

        return source;
    },

    /**
     * Return the camelCase of a sentences (Hello World --> helloWorld)
     * @param str
     * @returns {XML|string|void|*}
     */
    camelCase :function (str){
        str     = $.camelCase(str.replace(/[_ ]/g, '-')).replace(/-/g, '');
        return  str;//.substring(0,1).toUpperCase()+str.substring(1);
    }

};

