## Test Dataset 1
This folder contains the test data set for the evaluation of the tool:
- The mindmap file contains a graphical overview of the test data, i.e. what annotations exist for each paper within the data set. 
- 10 PDF files that have been annotated (annotations are contained in the XML files)
- 2 XML files with initial annotations of the 10 PDF files that can be loaded into the following graphs
    - `testdata.graph.meta.evaluation.xml` -> http://eis.iai.uni-bonn.de/semann/graph/meta
    - `testdata.graph.evaluation.xml` -> http://eis.iai.uni-bonn.de/semann/graph
    
The data was extracted from the database with the following SPARQL queries (note that evaluation data was kept in the below mentioned graphs):

```
#extract information about the annotations themselves
CONSTRUCT {?s ?p ?o}
from <http://eis.iai.uni-bonn.de/semann/graph/evaluation>
where {?s ?p ?o}
```

```
#extract the hierarchy of annotations
CONSTRUCT {?s ?p ?o}
from <http://eis.iai.uni-bonn.de/semann/graph/meta/evaluation>
where {?s ?p ?o}
```