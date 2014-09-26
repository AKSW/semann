### Custom Library to handel the project

This directory contain all the necessary files that we used for developing for your purpose

### scientificAnnotation.js
 - System Initialization
 - Main handler class for all the event managements.
 - UI rendering
 - Apply auto completion to both property and object fields
 - <b>key words</b>: <i> bind, annotation, findsimilar, fetchData, ProgressBar</i>


### highlight.js
 - This code produces highlights in PDF. Uses Rangy API: https://code.google.com/p/rangy/
 - Serializes active window selection into Rangy format
 - Calculate selected text offset
 - <b>key words</b>: <i> highlight, offset, Serializes</i>


### sparql.js
 - This file contain all the necessary sparql related queries
 - Add annotation
 - Fetch annotation
 - Find similar result annotation
 - Perform <b>cross domain</b> ajax call to communicate with sparql endpoint
 - UI rendering based on ajax call back function
 - search limit and auto completion suggestion limit
 - <b>key words</b>: <i> sparql,ajax, success, error, limit </i>

### sparqlResponseParser.js
  - This file use to parse the ajax json response
  - <b>key words</b>: <i> json, property, object, SimilarSearch </i>

### tableAnnotator.js
This file is currently under construction.<br>
  - contains functionality for table annotation
  - user table selection validation
  - extract info from cell selection
  - <b>key words</b>: <i> TableCell, valid  </i>



