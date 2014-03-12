/**
 * This code produces highlights in PDF. Uses Rangy API: https://code.google.com/p/rangy/
 * TODO: tooltip or link for extra information
 */

var highlight  = {

    rangy_serialize: function () {
				var selection = rangy.getSelection();
				var rangy_base = document.getElementById('viewer');
				var s = rangy.serializeSelection(selection, true, rangy_base);
				//console.log('	&rangy=' + s);
				var obj = rangy.deserializePosition(s, rangy_base);
				var page = highlight.currentPageNo(obj.node);
				//console.log('	&page=' + page );
				return {
					Page:	page,
					Rangy:	s
				}
    },

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

    deserializeArray: function (array) { //deserialise "&rangyFragment" parameter value in the URI, return rangy range array
        var rangy_base = document.getElementById('viewer');
        var highlightRanges = new Array();
        for (i=0; i<array.length; i++) {
            //console.log("	&rangyFragment="+array[i]);
            if (array[i] != undefined) { //filter out URIs without &rangyFragment parameter value
                highlightRanges.push(rangy.deserializeRange(array[i], rangy_base)); //throws error when run more than once, FIX IT! potentially because DOM has changed?
            }
        }
        return highlightRanges;
    },

   rangy_highlight : function(rangyFragments) { //given rangy fragments (eg. ["0/3/3/1:0,0/3/3/1:9","0/1/3/1:17,0/1/3/1:21"]), apply highlights
        highlightRanges = highlight.deserializeArray(rangyFragments);
        for (i=0; i<highlightRanges.length; i++) {
            cssApplier.toggleRange(highlightRanges[i]); //apply highlights
        }
        console.log('Highlights were applied: ' + i);

   },

   getURLParameters: function (sURL, paramName) { //filters out givenURI parameter value from the sURL
        if (sURL.indexOf("?") > 0)
        {
           var arrParams = sURL.split("?");
           var arrURLParams = arrParams[1].split("&");
           var arrParamNames = new Array(arrURLParams.length);
           var arrParamValues = new Array(arrURLParams.length);
           var i = 0;
           for (i=0;i<arrURLParams.length;i++)
           {
        var sParam =  arrURLParams[i].split("=");
        arrParamNames[i] = sParam[0];
        if (sParam[1] != "")
            arrParamValues[i] = unescape(sParam[1]);
        else
            arrParamValues[i] = "No Value";
           }

           for (i=0;i<arrURLParams.length;i++)
           {
            if(arrParamNames[i] == paramName){
            return arrParamValues[i];
             }
           }
           return "No Parameters Found";
        }
   }
};
