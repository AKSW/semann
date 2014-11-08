## User Annotations from the Evaluation
This folder contains the user annotations of the ["What are semantic annotations?" PDF file](./pdf/what%20are%20semantic%20annotations.pdf) from the evaluation of the tool. They have been separated from the rest of the test data for your own convenience and better overview. 

Overview of the contents of the folder:
- 10 user annotations (user1 - user10) separated between the following 2 files:
    - `testdata.graph.evaluation.userX.xml` contains information about the annotations themselves. To be loaded into the graph -> http://eis.iai.uni-bonn.de/semann/graph
    - `testdata.graph.meta.evaluation.userX.xml` contains the hierarchy of annotations.  To be loaded into the graph -> http://eis.iai.uni-bonn.de/semann/graph/meta
    
The data was extracted from the database with the following SPARQL queries (note that evaluation data was kept in the below mentioned graphs):

```
#extract information about the annotations themselves
CONSTRUCT {?file ?fileP ?fileO. ?fileO ?p ?o. ?p ?pp ?po. ?o ?op ?oo .}
from <http://eis.iai.uni-bonn.de/semann/graph/evaluation/userX>
where {
?file ?fileP ?fileO.
OPTIONAL {?fileO ?p ?o. }
OPTIONAL {?p ?pp ?po. }
OPTIONAL {?o ?op ?oo .}
FILTER (?file = <http://eis.iai.uni-bonn.de/semann/pdf/what%20are%20semantic%20annotations.pdf>)
}
```

```
#extract the hierarchy of annotations
CONSTRUCT {?file ?fileP ?fileO. ?fileO ?p ?o. }
from <http://eis.iai.uni-bonn.de/semann/graph/meta/evaluation/userX>
where {
?file ?fileP ?fileO.
OPTIONAL {?fileO ?p ?o.}
FILTER (?file = <http://eis.iai.uni-bonn.de/semann/pdf/what%20are%20semantic%20annotations.pdf>)
}
```