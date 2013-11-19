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
- Triples need to be saved and loaded from some sort of server.
Original idea was to make server.T.js provider, where T can be any custom backend user implements.
By default we can provide something like server.sparql.js (uses sparql queries to load-save data) and server.ontowiki.js (uses ontowiki for save-load).
- Created annotation snippets should be highlighted in the PDF display.
Main problem here is that while window.getSelection() returns proper text, PDF.js renders given text line-by-line in different spans.
I haven't figured out what would be the best way to highlight the text after it has been selected.
Shouldn't be too hard, but it's slightly tricky.
- Better UI for creating / managin annotations.
Current UI is very-very-very bad. We need something better. Not sure where to start though.

## Used libraries

[PDF.js](http://mozilla.github.io/pdf.js/) - Viewer Example is used as a base for the project  
[Twitter bootstrap](http://getbootstrap.com/) - used for UI  
[jQuery](http://jquery.com/) - used for DOM manipulations, required by Twitter bootstrap  
[Typeahead.js](https://github.com/twitter/typeahead.js) - used for autosuggestion in input boxes  
