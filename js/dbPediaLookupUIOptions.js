/**
 This file prepare the UI for  dbpedia lookup, so that user can select ontology classed

 @authors :AQM Saiful Islam
 @dependency
 {
    dbPediaLookup.js
    progressbar.js
 }
 */

var dbPediaLookupUIOptions  = {

    CLASS_NO_SELECTION   : '--None--',

    CLASS_AUTO_SELECTION : 'Auto',

    CLASS_CUSTOM_SELECTION : '-- Custom --',

    /**
     * Cache current selected tab's class name
     */
    selectedTabClass : null,

    /**
     * Map the the search key with radio items id, names and values
     */
    searchKeyValueRadioInputMap : {},


    IS_AUTO_SEARCHED_TRIGGERED_YET : false,

    /**
     * Show the ontology class for each column
     *
     * @param {array} columnNames
     *
     * @return void
     */
    showOntologyListOptions : function (columnNames) {

        var ontologyDisplayOptionContainer = $('#ontologyClassSelectionContainer'),
            ontologyDisplayOptionPanel = $('#ontologyClassSelectionPanel');

        ontologyDisplayOptionContainer.show();

        ontologyDisplayOptionPanel.empty();
        ontologyDisplayOptionPanel.show();

        var columnValue = '',i = 0,ontologyClassListId = '';
        for (i = 0; i < columnNames.length; i++) {
            ontologyClassListId = dbPediaLookupUIOptions.getCustomId(columnNames[i]);
            columnValue += "<tr class = 'showResult'>";
            columnValue += "<td class = 'showResult'>" + columnNames[i] + "</td>";
            columnValue += "<td class = 'showResult'>" + dbPediaLookupUIOptions.getListOptions() + "</td>";
            columnValue += "<td class = 'showResult'>" + dbPediaLookupUIOptions.getCustomClassInputField(ontologyClassListId) + "</td>";
            columnValue += "</tr>";
        }

        ontologyDisplayOptionPanel.append(
            "<table class = 'showResult' width='auto'>" + columnValue + "</table>"
        );

        dbPediaLookupUIOptions.bindOntologyClassListChangeEvent();
    },

    /**
     * Get the html for a list
     *
     * @param {string} id html id
     *
     * @returns {string} html
     */
    getListOptions : function() {

        var html = '<select class="ontologyClassSelection">\n';
        $.each(dbPediaOwlType.owlClassList, function(index, value) {
            html += '<option value="' + value + '" >' + index + '</option>\n';
        });
        html += '</select>';
        return html;
    },


    /**
     * Return html input text field
     *
     * @param {string} id
     *
     * @returns {string}
     */
    getCustomClassInputField : function (id) {
        id = 'customClassInput_'+id;
        return '<input type="text" class="form-control" id="'+ id +'" placeholder="Custom Class" disabled  style="width:200px; height: 30px;" >';
    },

    /**
     * Build the modal view to select the class URIS
     * @param {object} selectedElements
     *
     * @return void
     */
    buildOntologySelectionModal : function (selectedElements) {

        var i = 0, j = 0, listValues = [], firstSearchKey = null, columnName = '',
            tabId = null, tabLeftContent = '', tabRightContent = '', tabContent = '',
            radioInputName = '', isActiveTab = false;

        for (i = 0; i<selectedElements[0].length; i++) {

            isActiveTab = false;
            if (i === 0) {
                isActiveTab = true ;
            }

            listValues = [];
            for (j = 1;j<selectedElements.length;j++) { // skipping the column names
                listValues.push(selectedElements[j][i]);
            }
            firstSearchKey = listValues[0];
            columnName = selectedElements[0][i];
            tabId = dbPediaLookupUIOptions.getCustomId(columnName);

            // assign the 1st tab class name
            if (dbPediaLookupUIOptions.selectedTabClass === null) {
                dbPediaLookupUIOptions.selectedTabClass = tabId;
            }

            var rightClass = 'modal-right '+tabId;

            tabLeftContent = "<div class='modal-left' style='height: 200px; overflow:auto;'>" + dbPediaLookupUIOptions.getRowsAsListView(listValues) +"</div>",
                tabRightContent = "<div class='" + rightClass +"'>" + dbPediaLookupUIOptions.getTabTable(tabId, firstSearchKey)+ '</div>';
            tabContent = tabLeftContent+ tabRightContent;
            dbPediaLookupUIOptions.addTabContent(tabId, columnName, tabContent, isActiveTab);
        }

        dbPediaLookupUIOptions.bindListItemClickEvent();
        dbPediaLookupUIOptions.bindTabSelectEvent();
        dbPediaLookupUIOptions.bindCellRadioSelection();
    },

    /**
     * Bind the list item click event
     *
     * @return void
     */
    bindOntologyClassListChangeEvent : function() {
        $(".ontologyClassSelection").bind("change", function () {
            googleAnalytics.logEvent('send', 'event', 'ontology class selection',$(this).val());
            dbPediaLookupUIOptions.deactivateManualSearchButton();
            dbPediaLookup.clearDbPediaLookupResultCache();

            var nextTextField = $(this).closest('td').next('td').find('input:text');
            nextTextField.prop( "disabled", true );
            nextTextField.val('');

            if ($(this).val() == dbPediaLookupUIOptions.CLASS_CUSTOM_SELECTION) {
                nextTextField.prop( "disabled", false );
            }

            var count = 0;
            $(".ontologyClassSelection").each(function(){

                if ($(this).val() === dbPediaLookupUIOptions.CLASS_NO_SELECTION
                    || $(this).val() === dbPediaLookupUIOptions.CLASS_CUSTOM_SELECTION
                ) {
                    count++;
                }
            });

            if (count === $(".ontologyClassSelection").length) {
                return;
            }

            dbPediaLookupUIOptions.activateURIManualSearchButton();
        });
    },

    /**
     * Bind the list item click event
     *
     * @return void
     */
    bindListItemClickEvent : function() {
        $("#ontologySelectionModel .list").bind("click", function () {
            dbPediaLookupUIOptions.showTableOnListItemClick($(this).text());
            dbPediaLookupUIOptions.changeListItemBackGroundColor($(this));
            googleAnalytics.logEvent('send', 'event', 'Item clicked in ontology selection list',$(this).text());

        });
    },

    /**
     * Change list item background color
     * @param selectedItem
     */
    changeListItemBackGroundColor : function(selectedItem) {
        $('#ontologySelectionModel .list').css('color','#2a9fd6');
        $('#ontologySelectionModel .list-group-item').css('background-color','white');
        selectedItem.css('color', 'white'); // change the text color
        selectedItem.parent().css('background-color', '#2a9fd6'); // change the background color
    },

    /**
     * Bind the tab selection event
     *
     * @return void
     */
    bindTabSelectEvent : function () {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            dbPediaLookupUIOptions.selectedTabClass  = $(this).attr('class');
            googleAnalytics.logEvent('send', 'event', 'Ontology Tab selected', $(this).text());
        });
    },

    /**
     * Bind the list item click event
     *
     * @return void
     */
    bindCellRadioSelection : function() {
        $("#ontologySelectionModel .cellRadioSelection").bind("click", function () {
            var name = $(this).attr('name'),
                id = $(this).attr('id'),
                value = $(this).val();

            var previous = dbPediaLookupUIOptions.searchKeyValueRadioInputMap[name];
                previous.id = id;
                previous.value = value;
                dbPediaLookupUIOptions.searchKeyValueRadioInputMap[name] = previous;

            googleAnalytics.logEvent('send', 'event', 'Resource URI selected',$(this).text());
        });
    },

    /**
     * Bind the click event for each list item
     *
     * @param item
     *
     * @return void
     */
    showTableOnListItemClick : function (item) {
        var selectClass = '.modal-right.' + dbPediaLookupUIOptions.selectedTabClass;
        $(selectClass).html(
            dbPediaLookupUIOptions.getTabTable(dbPediaLookupUIOptions.selectedTabClass, item)
        );
        dbPediaLookupUIOptions.bindCellRadioSelection();
    },

    /**
     * Build the modal to select the class URIS
     *
     * @param {string} tabId
     * @param {object} uriClasses uri with labels
     *
     * @return {string} html
     */
    getTabTable : function (tabId, searchKey) {

        var uriClasses = dbPediaLookup.lookUpResult[searchKey];
        if (uriClasses === null || uriClasses === undefined) {
            return '';
        }

        var uriRadioInputName = dbPediaLookupUIOptions.getCustomId(searchKey), checked = '';

        var uris = uriClasses.URIs,
            classLabel =  uriClasses.labels, i = 0, tableHtml = '';

        if ($.isEmptyObject(uris)) {
            return '';
        }



        tableHtml += "<tr class = 'showResult'>" +
            "<th class = 'showResult'>Class Label " + "</th>" +
            "<th class = 'showResult'>Class URIs</th>" +
            "</tr>";

        for (i = 0; i < uris.length; i++) {

            checked = '';

            if (i === dbPediaLookupUIOptions.getIndexFromId(uriRadioInputName)) {
                checked = 'checked';
            }
            tableHtml += "<tr class = 'showResult'>";
            tableHtml += "" +
                "<td class = 'showResult'>" +
                    "<input " +
                        "type='radio' " +
                        "id='" + uriRadioInputName + "_" + i + "' " + // keep track of the index id: name_index (loop)
                        "class='cellRadioSelection' " +
                        "name='" + uriRadioInputName +"' " +
                        "value = '" + uris[i] + "'" +
                        checked +
                    ">&nbsp;&nbsp;" + classLabel[i]
                "</td>";

            tableHtml += "<td class = 'showResult'><a href='" + uris[i] + "' target='_blank'>" + uris[i] + "</a></td>";

            tableHtml += "</tr>";
        }

        return "<table class = 'showResult' width='100%'>" + tableHtml + "</table>";
    },


    /**
     * Request to the dbpedia lookup to get all the result with uri and label and build the modal window
     *
     * @param {object} selectedElements
     *
     * @return void
     */
    getResultFromDbPediaLookup : function(selectedElements) {

        if ($.isEmptyObject(selectedElements)) {
            return;
        }

        var classNames = [], dbPediaResult = null, i = 0, j = 0,
            columnArrayValues = null, keyword = null, className = '';

        $( "#ontologySelectionModel .ontologyClassSelection" ).each(function() {
            classNames.push($( this ).find('option:selected').text().trim());
        });
        dbPediaLookupUIOptions.resetOntologySelectionModalTabContent();
        for (i = 1; i < selectedElements.length; i++) {
            columnArrayValues = selectedElements[i];
            className = classNames[i];

            for (j = 0; j < columnArrayValues.length; j++) {
                keyword = columnArrayValues[j]

                progressbar.showProgressBar('Querying in DBpedia Lookup..' + keyword);

                if (dbPediaLookup.lookUpResult[keyword]  === undefined) {
                    dbPediaResult = dbPediaLookup.getResources(keyword, classNames[j]);
                    dbPediaLookup.lookUpResult[keyword] = dbPediaResult;
                    dbPediaLookupUIOptions.mapDbPediaResultWithSearchKey(keyword, dbPediaResult);
                }
            }
        }
        dbPediaLookupUIOptions.buildOntologySelectionModal(selectedElements);
        progressbar.hideProgressBar();
    },

    /**
     * Request to the dbpedia lookup to get all the auto search result
     *
     * @param {object} selectedElements
     *
     * @return void
     */
    getResultFromDbPediaLookupUsingAutoSearch : function(selectedElements) {

        if ($.isEmptyObject(selectedElements)) {
            return;
        }

        var classNames = [], dbPediaResult = null ,i = 0, j = 0,
            columnArrayValues = null, keyword = null, className = '';

        dbPediaLookupUIOptions.deactivateManualSearchButton();

        if (!dbPediaLookupUIOptions.IS_AUTO_SEARCHED_TRIGGERED_YET) {
            dbPediaLookup.clearDbPediaLookupResultCache();
        }

        for (i = 1; i < selectedElements.length; i++) {
            columnArrayValues = selectedElements[i];
            className = classNames[i];

            for (j = 0; j < columnArrayValues.length; j++) {
                keyword = columnArrayValues[j]

                progressbar.showProgressBar('Querying in DBpedia Lookup..' + keyword);

                if (dbPediaLookup.lookUpResult[keyword]  === undefined) {
                    dbPediaResult = dbPediaLookup.getResources(keyword, dbPediaLookupUIOptions.CLASS_AUTO_SELECTION);
                    dbPediaLookup.lookUpResult[keyword] = dbPediaResult;
                    dbPediaLookupUIOptions.mapDbPediaResultWithSearchKey(keyword, dbPediaResult);
                }
            }
        }
        tableAnnotator.generateHtmlTableForSelectedInfo(tableAnnotator.storedData);
        progressbar.hideProgressBar();
        dbPediaLookupUIOptions.IS_AUTO_SEARCHED_TRIGGERED_YET = true;
    },

    /**
     * Get the list view for each column's rows
     *
     * @param {object} rows
     *
     * @returns {string} html
     */
    getRowsAsListView : function (rows) {

        var listHtml = '<ui class="list-group">',i = 0;
        for (i = 0; i < rows.length; i++) {
            listHtml += '<li class = "list-group-item"><a href="#" class="list">'+ rows[i] + '</a></li>';
        }
        listHtml += '<ui>';

        return listHtml;
    },

    /**
     * Add html content of each tab in the model
     *
     * @param {string} tabId tab id
     * @param {string} tabTitle tab title
     * @param {string} tabContent html content
     * @param {boolean} isActive
     *
     * @return void
     */
    addTabContent : function (tabId, tabTitle, tabContent, isActive) {

        var activeClass = '';
        if(isActive) {
            activeClass = 'active'
        }

        $('#ontologySelectionModel .nav-tabs').append(
            $('<li class="' + activeClass + '"></li>').append(
                $("<a>"+ tabTitle +"</a>").attr('href','#'+tabId).attr('data-toggle','tab').addClass(tabId)
            )
        );

        $('#ontologySelectionModel .tab-content').append(
            $('<div></div>').addClass('tab-pane ' + activeClass).attr('id', tabId).append(tabContent)
        );
    },

    /**
     * Reset the ontology selection tab model
     * @return void
     */
    resetOntologySelectionModalTabContent : function () {
        $('#ontologySelectionModel .modal-left').html('');
        $('#ontologySelectionModel .modal-right').html('');
        $('#ontologySelectionModel .nav-tabs').html('');
        $('#ontologySelectionModel .tab-content').html('');
        dbPediaLookupUIOptions.searchKeyValueRadioInputMap = {}; // clear the cache
    },

    /**
     * Get tab id after removing all the spaces between words
     * @param str
     * @returns {string}
     */
    getCustomId : function (str) {
        return str.split(" ").join("");
    },

    /**
     * Return the index from the id name i.e. 'sample_10' will return 10
     * @return int
     */
    getIndexFromId : function (radioInputId) {

        radioInputId = dbPediaLookupUIOptions.searchKeyValueRadioInputMap[radioInputId];

        if (radioInputId === null || radioInputId === undefined){
            return 0;
        }

        var i = 0, index = 0, sub_str = '', id = radioInputId.id;

        if ((i = id.indexOf('_')) !== -1) {
            sub_str = id.substring(i + 1);
            index = parseInt(sub_str);
        }

        if (isNaN(index)) {
            index = 0;
        }

        return index;
    },

    /**
     * Map the dbPediaResult with searched keys
     * @param {string} searchKey
     * @param {object} dbPediaResult
     * @return void
     */
    mapDbPediaResultWithSearchKey : function(searchKey, dbPediaResult) {

        var uriRadioInputName  = dbPediaLookupUIOptions.getCustomId(searchKey);
        dbPediaLookupUIOptions.searchKeyValueRadioInputMap[uriRadioInputName] = {
            id        : '',
            value     : dbPediaResult.URIs[0],
            classUri  : dbPediaResult.classUri[0],
            searchKey : searchKey
        }
    },

    /**
     * Get all the value from the model
     */
    getSelectedValueFromModel : function() {
        tableAnnotator.generateHtmlTableForSelectedInfo(tableAnnotator.storedData);
    },

    /**
     * Activate the manual search button
     * @return void
     */
    activateURIManualSearchButton : function () {
        $("#getResourceUriButton").attr('disabled' , false);
    },

    /**
     * Deactivate the manual search button
     * @return void
     */
    deactivateManualSearchButton : function () {
        $("#getResourceUriButton").attr('disabled' , true);
    }
};