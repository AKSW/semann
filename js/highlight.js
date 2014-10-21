/**
 * This code produces highlights in PDF. Uses Rangy API: https://code.google.com/p/rangy/
 * TODO: tooltip or link for extra information
 *
 * @authors : A Q M Saiful Islam, Jaana Takis
 * @dependency: none
 */

var highlight  = {
    savedSel: null,
    savedSelActiveElement: null,
    highlightRanges : null, //imported annotations
    userHighlightRanges : null, //user's annotations
    importedAnnotations: { //keeps track of all annotations per page that still need to be applied
        fragments: {}, //rangy's serialised selections
        set: function(pageNum, fragment) {
            if (!this.fragments[pageNum]) {
                this.fragments[pageNum] = []; //add new key
            }
            this.fragments[pageNum].push(fragment); // append values
        },
        get: function(pageNum) { //returns rangy's serialised selections for the given page as an array
            return this.fragments[pageNum];
        },
        empty: function(pageNum) { //delete this entry for the given page
            delete this.fragments[pageNum];
        },
        emptyAll: function() { //reset
            this.fragments = {};
        }
    },
    
    /**
     * Serializes active window selection into Rangy format. TODO: add immediately to existing highlights
     *
     * @param void
     * @returns object {Page, Rangy} 
     */
    rangy_serialize: function () {
        
        var selection = rangy.getSelection();
        if (!selection) return null;
        var selectionRange = selection.getRangeAt(0);
        var pos = highlight.selectionPosition(selection);
        var s = this.stripRangeOfDomModifications(selectionRange);
        var ds = rangy.deserializePosition(s,  scientificAnnotation.DIV_VIEWER.get(0));
        var page = this.currentPageNo(ds.node);
        highlight.userHighlightRanges.push(selectionRange);
        myCssApplier.applyToRange(selectionRange);
        if (scientificAnnotation.DEBUG) console.log('Serialised position: '+s);
        return {
            page:	           page,
            domPosition:	       s,
            start:           pos.start,
            end:             pos.end
        }
    },
    
    /**
     * Return active window selection with correct whitespace. 
     *
     * @param void
     * @returns {String} text representation of the selection
     */
    fixWhitespace: function () {
        var sel = rangy.getSelection();
        var startOffset = sel.anchorOffset;
        var endOffset = sel.focusOffset;
        var ranges = sel.getAllRanges();
        var textNodes, textNode, i, len, j, jLen, textFragment;
        var text = '';
        for (i = 0, len = ranges.length; i < len; ++i) {
            var range = ranges[i];
            // The first parameter below is an array of valid nodeTypes (text nodes)
            textNodes = range.getNodes([3]);
            for (j = 0, jLen = textNodes.length; j < jLen; ++j) {
                textNode = textNodes[j];
                var isHypenated = false;
                if (/\S/.test(textNode.nodeValue)) { //we exclude nodes with only whitespace
                    var nodeValueLength = textNode.nodeValue.length;
                    var lastChar = textNode.nodeValue.substring(nodeValueLength-1, nodeValueLength);
                    var isLastNode = (j == jLen-1) ? true: false;
                    var isFirstNode = (j == 0) ? true: false;
                    if (isFirstNode && isLastNode) {
                        textFragment = textNode.nodeValue.substring(startOffset, endOffset); //selection within the same node
                    } else if (isFirstNode) {
                        textFragment = textNode.nodeValue.substring(startOffset); //start of partial selection within first node
                        if (lastChar == '-') isHypenated = true;
                    } else if (isLastNode) {
                        textFragment = textNode.nodeValue.substring(0, endOffset); //end of partial selection within last node
                    } else {
                        textFragment = textNode.nodeValue;
                        if (lastChar == '-') isHypenated = true;
                    }
                    textFragment = textFragment.replace(/\s{2,}/g, ' '); //remove extra spaces
                    textFragment = textFragment.replace(/\t/g, ' '); //remove tabs
                    textFragment = textFragment.toString().trim().replace(/(\r\n|\n|\r)/g,""); //remove line breaks
                    //if (scientificAnnotation.DEBUG) console.log(j + ': ('+isHypenated+') - ' +textFragment);
                    if (isHypenated) {
                        text = text + textFragment.substring(0, textFragment.length-1); //exclude hyphenation
                    } else {
                        text = text + textFragment;
                        if (!isLastNode) text = text + ' '; //replace newlines with space
                    }
                }
            }
        }
        if (scientificAnnotation.DEBUG) console.log("Cleaned up user selection: '" + text + "'");
        return text;
    },
    
    /**
     * Checks if active selection was made in PDF. 
     * @return {Boolean}
     */
    isSelectionInPDF: function(){
        var selection = rangy.getSelection();
        var node;
        if (selection) {
            node = selection.anchorNode;
        }
        if ($(node).closest(scientificAnnotation.DIV_VIEWER).length > 0) { //if node exists
            return true;
        } else { 
            return false; //avoids the problem where selection is not made in PDF but mouse released over PDF file. We want to ignore these cases.
        }
    },
    
    /**
     * Takes a selection and calculates the start and end positions with respect to the page's text. 
     * @param {RangySelection} 
     * @return {Object} object with start and end parameters
     */
    selectionPosition: function(selection){
        var range = selection.getRangeAt(0);
        var selectionStart = 0;
        var selectionEnd = 0;
        var parentDivNode = $(selection.anchorNode).closest('div.textLayer')[0];  //parent div node of the problem node
        var prevPageNo = highlight.currentPageNo(parentDivNode)-1;
        var prevPageNoIndex = prevPageNo - 1;
        var cumulativeChars = scientificAnnotation.pageLengths[prevPageNoIndex];
        if (!cumulativeChars) cumulativeChars = 0;
        var preCaretRange = rangy.createRange();
        preCaretRange.selectNodeContents(parentDivNode);
        preCaretRange.setEnd(range.startContainer, range.startOffset); //move end offset till the selection
        selectionStart = preCaretRange.toString().length;
        selectionEnd = selection.toString().length + selectionStart;
        var ascArray = [];
        ascArray.push(selectionStart);
        ascArray.push(selectionEnd);
        if (selection.isBackwards()) {
            ascArray.sort(function(a, b){return a-b}); //sort ascending
        }
        return {
            start:  cumulativeChars+ascArray[0],
            end:    cumulativeChars+ascArray[1]
        }
    },
    
    
    /**
     * Takes the node and offset of the given range and recalculates its serialised position if its parent DIV did not contain existing highlights. This clears given node and offset positions from any potential DOM modification impacts.
     *
     * @param node, integer
     * @returns string
     */
    originalPosition: function (problemNode, problemOffset) {
        var offset = 0;
        var parentDivNode = $(problemNode).closest('div')[0];  //parent div node of the problem node
        var parentDivRange = rangy.createRange();
        parentDivRange.selectNode(parentDivNode); //take node as range
        //if (scientificAnnotation.DEBUG) console.log("length="+parentDivRange.toString().length+": "+parentDivRange.toString());
        //if (scientificAnnotation.DEBUG) console.log(parentDivRange.toHtml());
        var preCaretRange = rangy.createRange();
        preCaretRange.selectNodeContents(parentDivNode);
        preCaretRange.setEnd(problemNode, problemOffset); //move end offset till the selection
        offset = preCaretRange.toString().length;
        var serialisedPos = rangy.serializePosition(parentDivNode.firstChild, offset, scientificAnnotation.DIV_VIEWER.get(0));
        //alert(serialisedPos);
        return serialisedPos;
    },
    
    /**
     * Takes the range of the active win selection and finds its serialised position in respect to a DOM withouth modification occurred during highlighting (<span class="highlight"/> elements). This ensures the position is not corrupted when it is uploaded.
     *
     * @param range of the selection
     * @returns string
     */
    stripRangeOfDomModifications: function (unstrippedRange) {
        var correctedStartPos = this.originalPosition(unstrippedRange.startContainer, unstrippedRange.startOffset);
        var correctedEndPos = this.originalPosition(unstrippedRange.endContainer, unstrippedRange.endOffset);
        var correctedPos = correctedStartPos+","+correctedEndPos;
        //if (scientificAnnotation.DEBUG) console.log("Selected range when stripped of DOM modifications: "+correctedPos);
        return correctedPos;
    },

    /**
     * Returns current page number with the help of rangy.
     *
     * @param element
     * @returns integer
     */
    currentPageNo: function (element) { //returns the current page number that the given element belongs to
        var classname, index;
        while (element = element.parentNode) {
            classname = element.className;
            if (classname == "page") {
                index = $(".page").index(element) + 1;
                break;
            }
        }
        return index;
    },


    /**
     * Deserializes strings into rangy ranges. 
     *
     * @param array
     * @returns Range 
     */
    deserializeArray: function (array) { //deserialise "&rangyFragment" parameter value in the URI, return rangy range array
        var rangy_base = scientificAnnotation.DIV_VIEWER.get(0);
        //highlightRanges = new Array();
        for (i=0; i<array.length; i++) {
//            console.log("	&rangyFragment="+array[i]);
            if (array[i] != undefined) { //filter out URIs without &rangyFragment parameter value
                var r;
        if (rangy.canDeserializeRange(array[i], rangy_base)) { //BUG: potential rangy bug as it does not seem to catch deserialisation errors
            r = rangy.deserializeRange(array[i], rangy_base);
            highlight.highlightRanges.push(r);
        } else {
//            console.log("	"+array[i]+" is not serializable!");
        }
            }
        }
        return highlight.highlightRanges;
    },

    /**
     * Highlights given rangy positions with rangy. 
     *
     * @param array
     * @returns void
     */
    rangy_highlight : function(rangyFragments) { //given rangy fragments (eg. ["0/3/3/1:0,0/3/3/1:9","0/1/3/1:17,0/1/3/1:21"]), apply highlights
        //remove all highlights
        myCssApplier.undoToRanges(highlight.userHighlightRanges);
        highlight.userHighlightRanges = [];
        cssApplier.undoToRanges(highlight.highlightRanges);
        try {
            highlightRanges = highlight.deserializeArray(rangyFragments);
            cssApplier.applyToRanges(highlightRanges);
        } catch(err) {
            if (scientificAnnotation.DEBUG) console.error("There was an error during highlighting. Potentially corrupted data in '"+rangyFragments+"'. "+err.message);
        }
//        console.log(highlight.highlightRanges.length+' highlights were applied! If some are missing there might be an overlap in which case they get discarded.');
    },
    
    /**
     * Highlights off for the range. 
     *
     * @param {RangyRange} 
     * @returns void
     */
    undoRangeHighlight: function(range) {
        myCssApplier.undoToRange(range);
        cssApplier.undoToRange(range);
    },
    
    /**
     * User's highlights off for the given array of ranges. 
     *
     * @param {Array} of RangyRange
     * @returns void
     */
    undoMyHighlights: function(rangeArray) {
        myCssApplier.undoToRanges(rangeArray);        
    },
    
    
    /**
     * Destroys active selection. This is needed when buttons are pressed, otherwise it interferes with rangy operations. Input fields automatically destroy it.
     *
     * @returns void
     */
    destroyActiveSelection: function() {
        var selection = rangy.getSelection();
        if (selection) selection.removeAllRanges();
    },
    
    init: function() { //rangy related objects that need initialisation
        rangy.init();
        cssApplier = rangy.createCssClassApplier("dbhighlight", {normalize: true});
        myCssApplier = rangy.createCssClassApplier("myhighlight", {normalize: true});
        highlight.highlightRanges = new Array();
        highlight.userHighlightRanges = new Array();
    }
    
};
