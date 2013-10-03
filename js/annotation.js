(function(){
    $(document).ready(function() {
        var
            // annotations stuff
            annotations = [],
            currentProperty,
            // toolbar stuff
            selection,
            timer,
            options = {
                delay: 100
            },
            // scroll stuff
            currentScrollPosition,
            currentToolbarTop,
            // dom pointers
            toolbar = $("#annotationToolbar"),
            addPropertyBtn = $("#addPropertyBtn"),
            propertyInput = $("#propertyInput"),
            resourceProperties = $("#resourceProperties"),
            addAnnotationBtn = $("#addAnnotationBtn"),
            newPropertyForm = $("#newPropertyForm"),
            similarPubs = $("#similarPubs"),
            findSimilarButton = $("#findSimilarButton"),
            similarPubsList = $("#similarPubsList");

        var getSelection = function(){
            newSelection = window.getSelection();
            selection = newSelection;
        };

        var renderCurrentAnnotations = function(){
            var i,
                len = annotations.length,
                sAnnotations = [];

            for(i = 0; i < len; i++){
                if(annotations[i].selection === selection){
                    sAnnotations.push(annotations[i]);
                }
            }

            if(sAnnotations.length === 0){
                resourceProperties.hide();
                return;
            }

            resourceProperties.show();

            var html = "", j, jlen, k, klen;
            len = sAnnotations.length;
            for(i = 0; i < len; i++){
                html += "<div>";
                jlen = sAnnotations[i].properties.length;
                for(j = 0; j < jlen; j++){
                    html += "&nbsp;&nbsp;<b>" + sAnnotations[i].properties[j].property + "</b>:";
                    html += '<button style="margin-left: 10px;" data-property="'+sAnnotations[i].properties[j].property+'" class="btn btn-xs btn-info addPropertyValueBtn"><span class="glyphicon glyphicon-plus"></span></button><br/>'
                    klen = sAnnotations[i].properties[j].values.length;
                    for(k = 0; k < klen; k++){
                        html += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;" + sAnnotations[i].properties[j].values[k];
                        if(k === (klen-1))
                            html += "<br/>";
                    }
                    html += "<br/>";
                }
            }

            resourceProperties.html(html);
        };

        // init typeahead for properties
        $('#propertyInput').typeahead({
            name: 'propertyInput',
            local: ['describes', 'a', 'for', 'hasProp', 'implements', 'language', 'evaluates', 'uses']
        });

        // handle add annotation button
        addAnnotationBtn.on('click', function(e){
            // get selection
            getSelection();

            var prop = {
                property: 'a',
                values: []
            };
            var ann = {
                selection: selection,
                properties: [prop]
            };
            annotations.push(ann);

            // render
            renderCurrentAnnotations();

            $($('.addPropertyValueBtn')[0]).click();

            // render ui changes
            newPropertyForm.fadeIn(50);
        });

        findSimilarButton.on('click', function(){
            similarPubsList.fadeIn(300);
            //similarPubs.animate({height: "+=30"}, 300);
        });

        // handle add property
        addPropertyBtn.on('click', function(){
            // make new property
            var newProperty = {
                property: propertyInput.val(),
                values: []
            };

            // reset value
            propertyInput.val('');

            // try to find annotation
            var i, currentAnnotation = null,
                len = annotations.length;
            for(i = 0; i < len; i++){
                if(annotations[i].selection === selection) {
                    currentAnnotation = annotations[i];
                    break;
                }
            }

            // new annotation
            if(currentAnnotation === null) {
                currentAnnotation = {
                    selection: selection,
                    properties: [newProperty]
                };
                annotations.push(currentAnnotation);
            }else{
                currentAnnotation.properties.push(newProperty);
            }

            renderCurrentAnnotations();
        });

        // hande add value
        $(document).on('click', '.addPropertyValueBtn', function(){
            currentProperty = $(this).data('property');

            $(this).parent().append('\
                <div class="form-inline" role="form" id="newValueForm">\
                    <div class="form-group">\
                        <label class="sr-only" for="valueInput">Add new value</label>\
                        <input type="text" class="form-control" id="valueInput" placeholder="Add new value">\
                    </div>\
                    <button id="addValueBtn" class="btn btn-info"><span class="glyphicon glyphicon-plus"></span></button>\
                    <button id="cancelValueBtn" class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span></button>\
                </div>');

            // init typeahead for values
            $('#valueInput').typeahead({
                name: 'valueInput',
                local: ['approach', 'implementation', 'evaluation', 'Java', 'LinkDiscovery', 'looseless', 'DBPedia']
            });
        });

        $(document).on('click', '#addValueBtn', function(){
            // try to find annotation
            var i,
                currentAnnotation = null,
                prop = null,
                len = annotations.length;
            for(i = 0; i < len; i++){
                if(annotations[i].selection === selection) {
                    currentAnnotation = annotations[i];
                    break;
                }
            }

            // new annotation
            if(currentAnnotation === null) {
                alert('error!');
            }else{
                len = currentAnnotation.properties.length;
                for(i = 0; i < len; i++){
                    if (currentAnnotation.properties[i].property === currentProperty){
                        prop = currentAnnotation.properties[i];
                        break;
                    }
                }
            }

            prop.values.push($("#valueInput").val());

            // reset value
            $("#valueInput").val('');

            // re-render
            renderCurrentAnnotations();
        });

        $(document).on('click', '#cancelValueBtn', function(){
            $(this).parent().remove();
        });
    });
})();