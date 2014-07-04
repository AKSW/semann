# Semantic Annotation Tool for PDF documents

Semann is a web-based semantic annotation tool for PDF files.<br>
This tool allows you to semantically annotate (as RDF triples) text in PDFs which is then used for recommending similar PDF documents that the end user might find relevant. 

## Project Current state
This project is a prototype.

### Currently working features:
- Load and render a PDF file within half-page and render other half with custom GUI.
- [Add annotation](https://github.com/AKSW/semann/wiki/Documentation#how-to-add-annotations)
- [View available annotation of currently loaded documents](https://github.com/AKSW/semann/wiki/Documentation#how-to-fetch-existing-annotations)
- [Find similar publications](https://github.com/saifulnipo/eis-semantic-annotation/wiki/Documentation#find-similar-publications)

### Work in progress:
This project is concurrently further developed on the following forks:
- https://github.com/saifulnipo/eis-semantic-annotation concentrates on annotating tables in PDF
- https://github.com/jaanatak/eis-semantic-annotation concentrates on the further development of the [find similar publications](https://github.com/AKSW/semann/wiki/Documentation#find-similar-publications) functionality. 
Eventually the two parallel forks will be merged into here.

## Documentation
- [Documentation](https://github.com/AKSW/semann/wiki/Documentation)

## Used libraries

[PDF.js](http://mozilla.github.io/pdf.js/) - Viewer Example is used as a base for the project  
[Twitter bootstrap](http://getbootstrap.com/) - used for UI  
[jQuery](http://jquery.com/) - used for DOM manipulations, required by Twitter bootstrap  
[Typeahead.js](https://github.com/twitter/typeahead.js) - used for autosuggestion in input boxes  
[Rangy](https://code.google.com/p/rangy/) - A cross-browser JavaScript range and selection library.

## Backend Database Used
- [virtuoso](http://virtuoso.openlinksw.com/)
