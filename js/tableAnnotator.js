/**
 * This js file contains functionality for table annotation.
 *
 @authors : A Q M Saiful Islam (Nipo)
 @dependency:
 {
  dataCubeSparql.js
  messageHandler.sj
 }
 */
/*global $:false, scientificAnnotation :false, confirm: false,
 progressbar : false, sparql:false, messageHandler:false, plusplus: false  */

/*jslint plusplus: true */

var tableAnnotator  = {

    ITEM_POSITION_FIRST     : 'first',
    ITEM_POSITION_LAST      : 'last',
    TABLE_ANNOTATION_COUNT  : 1,
    INF                     : 100000,
    TABLE_SELECTION_ABORT   : 2000,
    TABLE_COLUMN_STEP: 2000,
    INVALID                 : -1,
    NEW_COLUMN: 2,
    storedData              : null,
    deactivateTableSuggestion : false,
    COLUMN_WIDTH_THRESHOLD: 0,
    CSV_FILE_NAME : 'pdfdata.csv',

    /**
     * Get the selected info from the pdf and generate the data cube vocabulary
     * and finally add it to the backend
     *
     * @return void
     */
    annotateSelectedTable : function () {

        var selectedElements = tableAnnotator.getSelectedElementTags(window),
            isConfirmSuggestion = false,
            validatedTableInfo = null;
        messageHandler.clearMessage();

        if ($.isEmptyObject(selectedElements)) {
            googleAnalytics.logEvent('send', 'event', 'Button', 'Try to annotate without selection');
	    messageHandler.showErrorMessage('Please select a table to annotate and try again!', true);
            return;
        }

        var selectedTableValue = tableAnnotator.getSelectedTableValues(selectedElements);

        tableAnnotator.showSelectedTableInHtml(selectedTableValue);
        googleAnalytics.logEvent('send', 'event', 'Button', 'Preview the table');
	
    },

    /**
     * Display the user selected pdf info in to html view
     *
     * @param {Array} selectedElements
     * @return {void}
     */
    showSelectedTableInHtml: function (selectedElements) {
        tableAnnotator.storedData = selectedElements;
        if ($.isEmptyObject(selectedElements)) {
            messageHandler.showErrorMessage('No selected data found to display', true);
            return;
        }
        tableAnnotator.generateHtmlTableForSelectedInfo(selectedElements);
        dbPediaLookupUIOptions.showOntologyListOptions(selectedElements[0]);
    },

    /**
     * Display the user selected pdf info in to html view
     *
     * @param {Array} selectedElements
     * @return {void}
     */
    displayInfoIntoTable : function (selectedElements) {
        var tableInfo = tableAnnotator.getSelectedTableInfo(selectedElements);
        tableAnnotator.storedData = tableInfo;
        if ($.isEmptyObject(selectedElements)) {
            messageHandler.showErrorMessage('No selected data found to display', true);
            return;
        }
        tableAnnotator.generateHtmlTableForSelectedInfo(tableInfo);
	dbPediaLookupUIOptions.showOntologyListOptions(tableInfo[0]);
    },

    /**
     * Return intersected item as Nodes
     *
     * @param range
     * @param node
     * @returns {*}
     */
    rangeIntersectsNode: function (range, node) {
        var nodeRange;
        if (range.intersectsNode) {
            return range.intersectsNode(node);
        } else {
            nodeRange = node.ownerDocument.createRange();
            try {
                nodeRange.selectNode(node);
            } catch (e) {
                nodeRange.selectNodeContents(node);
            }

            return range.compareBoundaryPoints(Range.END_TO_START, nodeRange) === tableAnnotator.INVALID &&
                range.compareBoundaryPoints(Range.START_TO_END, nodeRange) === 1;
        }
    },

    /**
     * Return all the selected element of the table which contain only text
     *
     * @param {window} win
     * @returns {Array}
     */
    getSelectedElementTags: function (win) {
        var range, sel, selectedElements = [], treeWalker, containerElement;
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            range = sel.getRangeAt(0);
        }

        if (range) {
            containerElement = range.commonAncestorContainer;
            if (containerElement.nodeType !== 1) {
                containerElement = containerElement.parentNode;
            }

            treeWalker = win.document.createTreeWalker(
                containerElement,
                NodeFilter.SHOW_ELEMENT,
                function (node) {
                    return tableAnnotator.rangeIntersectsNode(range, node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                },
                false
            );

            if (tableAnnotator.isDivContainText(treeWalker.currentNode)) {
                selectedElements.push(treeWalker.currentNode);
            }

            while (treeWalker.nextNode()) {
                if (tableAnnotator.isDivContainText(treeWalker.currentNode)) {
                    selectedElements.push(treeWalker.currentNode);
                }
            }
        }
        return selectedElements;
    },

    /**
     * Check if the selected div contain the text items
     *
     * @param {HTMLElement} div
     * @returns {boolean}
     */
    isDivContainText : function (div) {

        if (div === undefined || div === null) {
            return false;
        }

        return div.hasAttribute('data-font-name');
    },

    /**
     * Get refined table information from the initial selected elements which may contain all many broken elements
     *
     * @param {Array} selectedElements
     * @returns {Array}
     */
    getSelectedTableInfo: function (selectedElements) {

        if (selectedElements === undefined) {
            return [];
        }

        var tableStruct = tableAnnotator.getTableColumnStructureForEveryRows(selectedElements),
            columnStartPoints = tableAnnotator.getRefinedColumnStructure(tableStruct),
            selectedTableInfo = tableAnnotator.getSelectedRowsWithColumnValues(tableStruct, columnStartPoints),
            tableRowsAndColumn = [], rows = '';

        for (rows in selectedTableInfo) {
            tableRowsAndColumn.push(
                selectedTableInfo[rows]
            );

        }

        return tableRowsAndColumn;
    },


    /**
     * Get the all the broken columns structures of every selected rows
     *
     * @param {Array} selectedElements
     * @returns {Array}
     */
    getTableColumnStructureForEveryRows : function (selectedElements) {
        var x, y, tableStruct = {}, lastInsertedKey = null;
        $.each(selectedElements, function (index, value) {

            x = value.style.top;
            y = value.style.left;

            if (tableStruct[x] === undefined) {
                lastInsertedKey = tableAnnotator.getLastInsertedKey(tableStruct);

                var currentX = tableAnnotator.getIntegerValue(x),
                    lastX = tableAnnotator.getIntegerValue(lastInsertedKey),
                    currentY = tableAnnotator.getIntegerValue(y),
                    lastY = -1;

                if (tableStruct[lastInsertedKey] !== undefined) {
                    lastY = tableAnnotator.getIntegerValue(tableStruct[lastInsertedKey][0].y);
                }

                if (lastInsertedKey !== null && (currentX !== lastX) && (currentY > lastY)) {
                    tableStruct[lastInsertedKey].push({ y : y, cellText : value.textContent });
                    return true; // works as loop continuation, here skipping the loop
                } else {
                    tableStruct[x] = [];
                }
            }
            tableStruct[x].push({ y : y, cellText : value.textContent });
        });

        return tableStruct;
    },

    getSelectedTableValues: function (selectedElements) {


        var i = 0, nextDivStartPoint = 0, currentDiv = null, nextDiv = null, tempText = '',
            tableStructure = [], rows = [], currentDivStartPoint = 0;


        for (i = 0; i < selectedElements.length; i++) {

            currentDiv = selectedElements[i];
            currentDivStartPoint = tableAnnotator.getIntegerValue(currentDiv.style.left);
            if ((i + 1) < selectedElements.length) {
                nextDiv = selectedElements[i + 1];
                nextDivStartPoint = tableAnnotator.getIntegerValue(currentDiv.style.left);
            } else {
                nextDiv = null;
            }

            if (tempText === '') {
                tempText = currentDiv.textContent;
            }

            if (tableAnnotator.isInSameCell(currentDiv, nextDiv)) {
                tempText += ' ' + nextDiv.textContent;
            } else {
                if (tableAnnotator.isNewRow(currentDiv, nextDiv)) {
                    rows.push ($.trim(tempText));
                    tableStructure.push(rows);
                    rows = [];
                } else {
                    rows.push ($.trim(tempText));
                }
                tempText = '';
            }
        }

        if (!$.isEmptyObject(rows)) {
            tableStructure.push(rows);
        }
        return tableStructure;
    },


    /**
     * Get the all the broken columns structures of every selected rows
     *
     * @param {Array} selectedElements
     * @returns {Array}
     */
    getTableColumnStructureForEveryRowsModified: function (selectedElements) {
        var x, y = 0, updateTableStruct = {}, tableStruct = {},
            lastInsertedKey = null, added = '', i = 0, previousDivStartPos = 0,
            currentDiv = null, preDiv = null, nextDiv = null, lastRowValue = null, rowIndex = 0,
            currentColumn = 0, columnPosWithWidth = 0, columnStartPos = 0, currentDivStartPoint = 0;

        for (i = 0; i < selectedElements.length; i++) {
            currentDiv = selectedElements[i];
            if ((i + 1) < selectedElements.length) {
                nextDiv = selectedElements[i + 1];
            }

            preDiv = null;
            if ((i - 1) > 0) {
                preDiv = selectedElements[i - 1];
            }

            x = currentDiv.style.top;
            currentDivStartPoint = tableAnnotator.getIntegerValue(currentDiv.style.left);

            if (preDiv === null) {
                previousDivStartPos = 0;
            } else {
                previousDivStartPos = tableAnnotator.getIntegerValue(preDiv.style.left);
            }

            lastRowValue = tableAnnotator.getLastRowItemValue(x, tableStruct, columnStartPos, currentDivStartPoint);
            currentColumn = lastRowValue.y + currentDivStartPoint;
            console.log(lastRowValue);

            if (preDiv !== null && preDiv.style.left === currentDiv.style.left) {
                var row = tableStruct[preDiv.style.top];
                if (row === undefined) {
                    y = tableAnnotator.TABLE_COLUMN_STEP;
                } else {
                    y = row[row.length - 1].y;
                }
            } else if (lastRowValue.y === 0) { // new row
                y = tableAnnotator.TABLE_COLUMN_STEP;
            } else if (currentColumn > lastRowValue.y && lastRowValue.status === 0) {
                y = lastRowValue.y + tableAnnotator.TABLE_COLUMN_STEP;
            } else if (currentColumn === lastRowValue.y) {
                y = currentColumn - currentDivStartPoint;
            } else if (lastRowValue.status === 1) {
                y = lastRowValue.y;
                updateTableStruct = tableAnnotator.mergeSplitRows(lastRowValue.x, updateTableStruct, currentDiv.textContent);
                continue;
            }

            if (lastRowValue.status === tableAnnotator.NEW_COLUMN) {
                rowIndex++;
            }

            if (y === tableAnnotator.TABLE_COLUMN_STEP) {
                columnStartPos = currentDivStartPoint;
            }

            if (lastRowValue.status === 1) {
                lastInsertedKey = lastRowValue.x;
            } else {
                lastInsertedKey = x;
            }

            if (tableStruct[x] === undefined) {
                tableStruct[x] = [];
            }

            if (updateTableStruct[lastInsertedKey] === undefined) {
                updateTableStruct[lastInsertedKey] = [];
            }

            updateTableStruct[lastInsertedKey].push({ y: y, cellText: currentDiv.textContent, index: rowIndex});
            tableStruct[x].push({ y: y, cellText: currentDiv.textContent });
        }

        console.log(updateTableStruct);
        return updateTableStruct;
    },

    /**
     *
     * @param tableStruct
     */
    getRowValues: function (tableStruct) {

        var cols = [], columnStartPoints = [],
            allColumnsIndex = [], previous = '', keys = '';
        for (keys in tableStruct) {
            cols = tableStruct[keys];
        }

    },

    /**
     * Return the list of all the column start points after eliminating un-necessary start points
     *
     * @param {Array} tableStruct
     * @returns {Array}
     */
    getRefinedColumnStructure : function (tableStruct) {

        var cols = [], columnStartPoints = [],
            allColumnsIndex = [], previous = '', keys = '';
        for (keys in tableStruct) {
            cols = tableStruct[keys];
            $.each(cols, function (index, value) {
                var searchedItem = $.grep(allColumnsIndex, function (obj) { return obj.y === value.y; });
               // console.log(searchedItem);
                if (!$.isEmptyObject(searchedItem) && value.y !== previous) {
                    if (columnStartPoints[value.y] === undefined) {
                        columnStartPoints[value.y] = 1;
                    } else {
                        columnStartPoints[value.y]++;
                    }
                    previous = value.y;
                }
            });
            allColumnsIndex = cols;
        }

        return tableAnnotator.discardUnwantedStartPoints(columnStartPoints);
    },

    /**
     * Return the selected text based on new column start points values
     *
     * @param {Array} tableStruct
     * @param columnStartPoints
     * @returns {{}}
     */
    getSelectedRowsWithColumnValues : function (tableStruct, columnStartPoints) {

        var indexCount = 0,
            previousColumnStartPoint = 0,
            nextColumnStartPoint = 0,
            tempColumnStartPoint = '',
            columnValue = '',
            rows = '', cols = null,
            currentColumnStartPoint = 0,
            selectedRowsAndColumn = {};
        
        for (rows in tableStruct) {
            cols = tableStruct[rows];
            indexCount = 0;
            columnValue = '';
            selectedRowsAndColumn[rows] = [];

            previousColumnStartPoint = tableAnnotator.INF; // assigned a big(unrealistic ) value
            tempColumnStartPoint = columnStartPoints[indexCount];
            if (tempColumnStartPoint !== undefined) {
                previousColumnStartPoint = tableAnnotator.getIntegerValue(tempColumnStartPoint);
            }

            $.each(cols, function (index, column) {

                nextColumnStartPoint = tableAnnotator.INF; // assigned a big(unrealistic ) value
                tempColumnStartPoint = columnStartPoints[indexCount + 1];
                if (tempColumnStartPoint !== undefined) {
                    nextColumnStartPoint = tableAnnotator.getIntegerValue(tempColumnStartPoint);
                }

                currentColumnStartPoint = tableAnnotator.getIntegerValue(column.y);

                if (currentColumnStartPoint >= previousColumnStartPoint && currentColumnStartPoint < nextColumnStartPoint ) {
                    columnValue += column.cellText;
                } else {
                    if ($.trim(columnValue) !== '') {
                        selectedRowsAndColumn[rows].push(columnValue);
                    }
                    columnValue = '';
                    columnValue +=  column.cellText;
                    previousColumnStartPoint = nextColumnStartPoint;
                    indexCount++;
                }
            });

            if ($.trim(columnValue) !== '') {
                selectedRowsAndColumn[rows].push(columnValue);
            }
        }
        return selectedRowsAndColumn;
    },

    /**
     * Get the integer value from the string containing pixel value
     *
     * i.e 165.12px = 165
     * @param {string} str
     * @returns {int}
     */
    getIntegerValue : function (str) {

        if (isNum(str)) {
            return str;
        }
	
        if (str === null || str === undefined || $.trim(str) === '') {
            return tableAnnotator.INVALID;
        }

        return parseInt(str.substr(0, str.length - 2));
    },

    /**
     * Get the integer value from the string containing pixel value
     *
     * i.e 165.12px = 165
     * @param {string} str
     * @returns {int}
     */
    getFoatValue: function (str) {

        if (isNum(str)) {
            return str;
        }

        if (str === null || str === undefined || $.trim(str) === '') {
            return tableAnnotator.INVALID;
        }

        return parseFloat(str.substr(0, str.length - 2));
    },

    /**
     * Get the last inserted key of the associated array
     *
     * @param tableStruct
     * @returns {Array}
     */
    getLastInsertedKey : function (tableStruct) {

        if ($.isEmptyObject(tableStruct)) {
            return null;
        }

        var keys = Object.keys(tableStruct);
        return keys[keys.length - 1];
    },

    /**
     * It also traverse up and downwards and select the table remaining selection.
     *
     * @param {Array} selectedElements
     * @returns {*}
     */
    getValidatedTableSelectedInfo : function (selectedElements) {

        var isGetTableRangeSuccess = true,
            isSelectionSuggestionPossible = false,
            selectedTableRange = null,
            traversedUpItems = null,
            traversedDownItems = null;
        
        if ($.isEmptyObject(selectedElements)) {
            return null;
        }

        selectedTableRange = tableAnnotator.getSelectedTableRange(selectedElements);

        if (selectedTableRange.min === tableAnnotator.INVALID && selectedTableRange.max === tableAnnotator.INVALID) {
            isGetTableRangeSuccess = false;

            return {
                isGetTableRangeSuccess        : isGetTableRangeSuccess,
                isSelectionSuggestionPossible : isSelectionSuggestionPossible,
                selectedElements              : selectedElements
            };
        }

        if (!tableAnnotator.deactivateTableSuggestion) {
            traversedUpItems = tableAnnotator.traverseTableUp(selectedElements[0], selectedTableRange);
            traversedDownItems = tableAnnotator.traverseTableDown(
                selectedElements[selectedElements.length - 1], selectedTableRange
            );

            if (!$.isEmptyObject(traversedUpItems) || !$.isEmptyObject(traversedDownItems)) {
                isSelectionSuggestionPossible = true;
            }

            selectedElements = $.merge(traversedUpItems, selectedElements);
            selectedElements = $.merge(selectedElements, traversedDownItems);
        }

        return {
            isGetTableRangeSuccess        : isGetTableRangeSuccess,
            isSelectionSuggestionPossible : isSelectionSuggestionPossible,
            selectedElements              : selectedElements
        };
    },

    /**
     * Traverse upward until the  table top and return all the selected element inside the table
     *
     * @param {HTMLElement} firstElement
     * @param {Object} selectedTableRange
     * @returns {Array}
     */
    traverseTableUp : function (firstElement, selectedTableRange) {

        firstElement = $(firstElement);

        var itemBeforeFirst = $(firstElement.prev()),
            itemLeftPositionBeforeFirstSelectedItem = 0, safeCount = 0,
            hasMore = true, selectedItem = [];

        while (hasMore) {

            if (itemBeforeFirst === undefined) {
                hasMore = false;
                break;
            }

            itemLeftPositionBeforeFirstSelectedItem = tableAnnotator.getIntegerValue(itemBeforeFirst.css('left'));

            if (itemLeftPositionBeforeFirstSelectedItem === tableAnnotator.INVALID ||
                itemLeftPositionBeforeFirstSelectedItem < selectedTableRange.min) {
                hasMore = false;
                break;
            }
            console.log('pre::' +  itemLeftPositionBeforeFirstSelectedItem + ' txt:: ' + itemBeforeFirst[0].textContent);

            selectedItem.push(itemBeforeFirst[0]);
            itemBeforeFirst = $(itemBeforeFirst.prev());

            if (safeCount === tableAnnotator.TABLE_SELECTION_ABORT) {
                messageHandler.showErrorMessage('Error is table selection!!!');
                break;
            }
            safeCount++;
        }

        return selectedItem.reverse();
    },

    /**
     * Traverse downward until the table bottom and return all the traverse elements inside the table
     *
     * @param {HTMLElement} lastItem
     * @param {Object} selectedTableRange
     * @returns {Array}
     */
    traverseTableDown : function (lastItem, selectedTableRange) {

        var lastElement = $(lastItem),
            itemAfterLast = $(lastElement.next()),
            itemLeftPositionAfterLastSelectedItem = 0, safeCount = 0,
            hasMore = true, selectedItem = [];

        while (hasMore) {
            if (itemAfterLast === undefined) {
                hasMore = false;
                break;
            }

            itemLeftPositionAfterLastSelectedItem = tableAnnotator.getIntegerValue(itemAfterLast.css('left'));
            if (itemLeftPositionAfterLastSelectedItem === tableAnnotator.INVALID ||
                itemLeftPositionAfterLastSelectedItem < selectedTableRange.min ||
                itemLeftPositionAfterLastSelectedItem > selectedTableRange.max) {

                hasMore = false;
                break;
            }
//            console.log('next:: ' +  itemLeftPositionAfterLastSelectedItem + ' txt:: ' + itemAfterLast.next());

            selectedItem.push(itemAfterLast[0]);
            itemAfterLast = $(itemAfterLast.next());

            if (safeCount === tableAnnotator.TABLE_SELECTION_ABORT) {
                messageHandler.showErrorMessage('Error is table selection!!!');
                break;
            }
            safeCount++;
        }

        return selectedItem;
    },

    /**
     * Removed the less frequent item for column start points
     *
     * @param {Array} columnStartPoints
     * @returns {Array}
     */
    discardUnwantedStartPoints : function (columnStartPoints) {

        var max = 0, value = 0, refinedValue = [], keys = '';
        for (keys in columnStartPoints) {
            value = columnStartPoints[keys];
            if (value > max) {
                max = value;
            }
        }

        for (keys in columnStartPoints) {
            value = columnStartPoints[keys];
            if (value === max) {
                refinedValue.push(keys);
            }
        }

        return refinedValue;
    },

    /**
     * Return the range of the selected table
     *
     * @param {Array} selectedElements
     * @returns {{min: number, max: number}}
     */
    getSelectedTableRange: function (selectedElements) {

        var left = 0,
            min = null,
            max = null, i = 0,
            itemIndex = [],
            leftPix = '',
            isEnoughInformationFount = false;

        for (i = 0; i < selectedElements.length; i++) {

            leftPix = selectedElements[i].style.left;
            left = tableAnnotator.getIntegerValue(leftPix);

            if (min === null || min > left) {
                min = left;
            }

            if (max === null || max < left) {
                max = left;
            }

            if (itemIndex[leftPix] === undefined) {
                itemIndex[leftPix] = {count: 0, left: left};
            }

            itemIndex[leftPix].count++;

            if (itemIndex[leftPix].count === 2) {
                isEnoughInformationFount = true;
                break;
            }

        }

        if (!isEnoughInformationFount) {
            min = tableAnnotator.INVALID;
            max = tableAnnotator.INVALID;
        }

        return {
            min : min,
            max : max
        };
    },

    /**
     * Generate the html table from the selected elements
     *
     * @param {Array} selectedElements
     * @return {void}
     */
    generateHtmlTableForSelectedInfo : function (selectedElements) {

        $("#annotateTableButton").text('Confirm annotation');
        $('#resetAnnotationButton').show();
        $('#viewSelectedInfoFromPfdTable').empty();
        $('#viewSelectedInfoFromPfdTable').show();

        var columnNames = selectedElements[0], tableHeader = '',
            i = 0, j = 0, rowArrayValues = null, rows = '',
            tempRowValue = '',radioInputName = '', mapResult = null;

        for (i = 0; i < columnNames.length; i++) {
            tableHeader += "<th class = 'showResult'>" + columnNames[i] + "</th>";
        }

        $('#viewSelectedInfoFromPfdTable').append('<br>');
        $('#viewSelectedInfoFromPfdTable').append(
            "<table id='selectedInfoViewer' class = 'showResult' width='100%' >" +
                "<tr class = 'showResult'>" +
                    tableHeader +
                "</tr>" +
            "</table>"
        );

        i = 0;
        j = 0;
        for (i = 1; i < selectedElements.length; i++) {

            rowArrayValues = selectedElements[i];
            rows = '';

            for (j = 0; j < rowArrayValues.length; j++) {
                tempRowValue = rowArrayValues[j];
                radioInputName = dbPediaLookupUIOptions.getCustomId(tempRowValue);
                mapResult = dbPediaLookupUIOptions.searchKeyValueRadioInputMap[radioInputName];

                if (mapResult !== undefined && mapResult.value.indexOf("http://") !== -1) {
                    tempRowValue = "<a href='" + mapResult.value +"' target='_blank'>" + tempRowValue + "</a>";
                }

                rows += "<td class = 'showResult' >" + tempRowValue + "</td>";
            }

            $('#selectedInfoViewer tr:last').after(
                "<tr class = 'showResult'>" +
                    rows +
                "</tr>"
            );
        }

        tableAnnotator.tableItemBindClickEvent();
    },

    /**
     * Add google analytics to table item how has href
     */
    tableItemBindClickEvent: function() {
        $("#selectedInfoViewer td.showResult a").unbind('click');
        $("#selectedInfoViewer td.showResult a").bind("click", function () {
            googleAnalytics.logEvent('send', 'event', 'Selected Uri clicked to check', $(this).text());
        });
    },

    /**
     * Get the current div text width
     * @param div
     * @returns {*}
     */
    getDivTextWidth: function (div) {
        if (div !== undefined && div.hasAttribute('data-canvas-width')) {
            return parseInt($(div).attr('data-canvas-width'));
        }
        return 0;
    },

    /**
     *
     * @param currentIndex
     * @param tableStruct
     * @returns {int}
     */
    getLastRowItemValue: function (currentIndex, tableStruct, columnStartPos, currentDivStartPoint) {

        var status = 0, x = currentIndex, value = 0;
        if ($.isEmptyObject(tableStruct)) {
            return {
                x: x,
                y: value,
                status: status
            };
        }

        var rows = tableStruct[currentIndex];

        if (rows === undefined) {
            var lastKey = tableAnnotator.getLastInsertedKey(tableStruct);
            if (lastKey === null) {
                value = 0;
            } else {
                rows = tableStruct[lastKey];
                if (currentDivStartPoint <= columnStartPos) {
                    value = 0;
                    status = tableAnnotator.NEW_COLUMN;
                } else if (rows.length > 1) {
                    value = rows[rows.length - 1].y;
                    x = lastKey;
                    status = 1; // linked to previous rows
                }
            }
        } else {
            value = rows[rows.length - 1].y;
        }

        return {
            x: x,
            y: value,
            status: status
        };
    },

    /**
     *
     * @param x
     * @param tableStruct
     * @param mergeText
     * @returns {*}
     */
    mergeSplitRows: function (x, tableStruct, mergeText) {

        var rows = tableStruct[x],
            lastValue = rows.pop();
        lastValue.cellText += ' ' + mergeText;
        rows.push(lastValue);
        tableStruct[x] = rows;
        return tableStruct;
    },

    /**
     * Check if the column values are in the same cells
     * @param currentDiv
     * @param nextDiv
     * @returns {boolean}
     */
    isInSameCell: function (currentDiv, nextDiv) {

        if (currentDiv === null || nextDiv === null) {
            return false;
        }

        var currentDivWidth = tableAnnotator.getDivTextWidth(currentDiv),
            nextDivWidth = tableAnnotator.getDivTextWidth(nextDiv),
            currentDivStartPoint = tableAnnotator.getIntegerValue(currentDiv.style.left),
            nextDivStartPoint = tableAnnotator.getIntegerValue(nextDiv.style.left),
            currentDivEndPoint = currentDivStartPoint + currentDivWidth,
            nextDivEndPoint = nextDivStartPoint + nextDivWidth, type = '',
            output = false;

//        console.log('comparing text ::' + currentDiv.textContent + '::::' + nextDiv.textContent);

        if (currentDivStartPoint === nextDivStartPoint) {
            output = true;
            type = 'left align';
        } else if (currentDivEndPoint === nextDivEndPoint) {
            output = true;
            type = 'right align';
        } else if (currentDivStartPoint >= nextDivStartPoint && currentDivEndPoint <= nextDivEndPoint) {
            output = true;
            type = 'complete overlap bottom is big';
        } else if (currentDivStartPoint < nextDivStartPoint && currentDivEndPoint > nextDivEndPoint) {
            output = true;
            type = 'complete overlap top is big';
        } else if (currentDivStartPoint < nextDivStartPoint
            && currentDivEndPoint < nextDivEndPoint
            && currentDivEndPoint > nextDivStartPoint) {
            output = true;
            type = 'partially overlap left';
        } else if (currentDivStartPoint > nextDivStartPoint
            && currentDivEndPoint > nextDivEndPoint
            && currentDivStartPoint < nextDivEndPoint) {
            output = true;
            type = 'partially overlap right';
        } else {
            output = false;
        }
//        console.log(type);
        return output;
    },


    /**
     *  Return if it's a news rows
     *
     * @param currentDiv
     * @param nextDiv
     * @returns {boolean}
     */
    isNewRow:function (currentDiv, nextDiv) {

        if (currentDiv === null || nextDiv === null) {
            return false;
        }

        var output = false, currentDivWidth = tableAnnotator.getDivTextWidth(currentDiv),
            nextDivWidth = tableAnnotator.getDivTextWidth(nextDiv),
            currentDivStartPoint = tableAnnotator.getIntegerValue(currentDiv.style.left),
            nextDivStartPoint = tableAnnotator.getIntegerValue(nextDiv.style.left),
            currentDivEndPoint = currentDivStartPoint + currentDivWidth;

        if (currentDivEndPoint > nextDivStartPoint){
            output = true;
        }

        return output;
    },

    /**
     * Check if the table is properly selected
     * @param selectedElements
     * @returns {boolean}
     */
    isTableSelectionNotValid : function(selectedElements) {

        if ($.isEmptyObject(selectedElements)) {
            return true;
        }

        var i, tempLenght = selectedElements[0].length, output = false;
        for (i = 1; i < selectedElements.length; i++) {

            if (selectedElements[i].length !== tempLenght) {
                output = true;
                break;
            }
        }
        return output;
    }
};