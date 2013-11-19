# Semantic Annotation Tool for PDF documents

Semann is a web-based semantic annotation tool for pdf documents. 

## Current state

Currently project is in very early development stage.  
You can call available code a prototype.  

Curretly working features:  
- Load and render a PDF file within half-page and render other half with custom GUI
- Detect selected text on the page using window.getSelection() method and add a new annotation for snippet
- Store annotations as json, as pseudo-triples ( {s: {p: [o1, o2]}} )

What needs to be done
- Triples need to be saved and loaded from some sort of server, [Storing and loading of triples](https://github.com/AKSW/semann/issues/1)
- Created annotation snippets should be highlighted in the PDF display, [Highlight annotation snippets in PDF](https://github.com/AKSW/semann/issues/2)
- Better UI for creating / managin annotations, [UI improvements](https://github.com/AKSW/semann/issues/3).

## Used libraries

[PDF.js](http://mozilla.github.io/pdf.js/) - Viewer Example is used as a base for the project  
[Twitter bootstrap](http://getbootstrap.com/) - used for UI  
[jQuery](http://jquery.com/) - used for DOM manipulations, required by Twitter bootstrap  
[Typeahead.js](https://github.com/twitter/typeahead.js) - used for autosuggestion in input boxes  
