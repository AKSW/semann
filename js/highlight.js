/**
 * This code produces highlights in PDF. Uses Rangy API: https://code.google.com/p/rangy/
 * TODO: tooltip or link for extra information
 */

var highlight  = {

    /**
     * Serializes active window selection into Rangy format. TODO: add immediately to existing highlights
     *
     * @param void
     * @returns object {Page, Rangy} 
     */
    rangy_serialize: function () {
        var selection = rangy.getSelection();
        var rangy_base = document.getElementById('viewer');
        var s = rangy.serializeSelection(selection, true, rangy_base);
        //console.log('	&rangy=' + s);
        var obj = rangy.deserializePosition(s, rangy_base);
        var page = this.currentPageNo(obj.node);
        //console.log('	&page=' + page );
        return {
            Page:	page,
            Rangy:	s
        }
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
            
    init: function() { //rangy related objects that need initialisation
        rangy.init();
        cssApplier = rangy.createCssClassApplier("highlight", {normalize: true});
        highlightRanges = new Array();
    },

    /**
     * Deserializes strings into rangy ranges. 
     *
     * @param array
     * @returns Range 
     */
    deserializeArray: function (array) { //deserialise "&rangyFragment" parameter value in the URI, return rangy range array
        var rangy_base = document.getElementById('viewer');
        highlightRanges = new Array();
        for (i=0; i<array.length; i++) {
            console.log("	&rangyFragment="+array[i]);
            if (array[i] != undefined) { //filter out URIs without &rangyFragment parameter value
                var r;
        if (rangy.canDeserializeRange(array[i], rangy_base)) { //BUG: potential rangy bug as it does not seem to catch deserialisation errors
            r = rangy.deserializeRange(array[i], rangy_base);
            console.log("	isvalid="+r.isValid());
            highlightRanges.push(r);
        } else {
            console.log("	"+array[i]+" is not serializable!");
        }
            }
        }
        return highlightRanges;
    },

    /**
     * Highlights given rangy positions with rangy. 
     *
     * @param array
     * @returns void
     */
    rangy_highlight : function(rangyFragments) { //given rangy fragments (eg. ["0/3/3/1:0,0/3/3/1:9","0/1/3/1:17,0/1/3/1:21"]), apply highlights
        //remove old highlights
        cssApplier.undoToRanges(highlightRanges);
        try {
            highlightRanges = highlight.deserializeArray(rangyFragments);
            cssApplier.applyToRanges(highlightRanges);
        } catch(err) {
            console.log("There was an error during highlighting. Potentially corrupted data. "+err.message);
        }
        console.log(highlightRanges.length+' highlights were applied! If some are missing there might be an overlap in which case they get discarded.');
    }
    
};
