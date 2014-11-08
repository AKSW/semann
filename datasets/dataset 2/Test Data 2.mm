<map version="0.9.0">
<!-- To view this file, download free mind mapping software FreeMind from http://freemind.sourceforge.net -->
<node CREATED="1415444172308" ID="ID_110097279" MODIFIED="1415444973156" TEXT="Test Data 2">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Query to retrieve annotations that are instances of DBpedia resources:
    </p>
    <p>
      
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;SELECT *
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;WHERE
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;{
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;{
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;SELECT DISTINCT ?file ?curr_aType
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;FROM &lt;http://eis.iai.uni-bonn.de/semann/graph/evaluation/extra&gt;
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;WHERE
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;{
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;?file &lt;http://eis.iai.uni-bonn.de/semann/0.2/owl#hasAnnotation&gt; ?curr_a .
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;?curr_a a ?curr_aType .
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;FILTER (STRSTARTS(STR(?curr_aType), &quot;http://dbpedia.org&quot;))
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;}
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;order by ?file LIMIT 1000
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;}
    </p>
    <p>
      }
    </p>
  </body>
</html>
</richcontent>
<node CREATED="1415444208089" ID="ID_1589049863" MODIFIED="1415444213155" POSITION="right" TEXT="Related papers">
<node CREATED="1415444304194" ID="ID_13152635" MODIFIED="1415444308101" TEXT="KIM &#x2013; Semantic Annotation Platform "/>
<node CREATED="1415444313896" ID="ID_1723754492" MODIFIED="1415444315358" TEXT="PDFtab in Prot&#xe9;g&#xe9; "/>
<node CREATED="1415444319185" ID="ID_24391726" MODIFIED="1415444320045" TEXT="Gate Architecture "/>
<node CREATED="1415444324438" ID="ID_800092017" MODIFIED="1415444326565" TEXT="gontongle"/>
<node CREATED="1415444400364" ID="ID_6687754" MODIFIED="1415444401856" TEXT="metarel ontology "/>
<node CREATED="1415444405663" ID="ID_1920772403" MODIFIED="1415444406950" TEXT="faceted semantic "/>
<node CREATED="1415444412314" ID="ID_905090488" MODIFIED="1415444413296" TEXT="crowsourced semantics "/>
<node CREATED="1415444418931" ID="ID_1869255407" MODIFIED="1415444420698" TEXT="folksonomy "/>
<node CREATED="1415444476815" ID="ID_1302589548" MODIFIED="1415444477782" TEXT="docear pdf inspector "/>
<node CREATED="1415444480795" ID="ID_1858053352" MODIFIED="1415444481767" TEXT="real time semantic web "/>
<node CREATED="1415444485149" ID="ID_510360808" MODIFIED="1415444486232" TEXT="linked data "/>
<node CREATED="1415444490695" ID="ID_1147718176" MODIFIED="1415444491915" TEXT="user driven quality evaluation of Dbpedia "/>
</node>
<node CREATED="1415444213583" ID="ID_900288277" MODIFIED="1415444219736" POSITION="right" TEXT="Unrelated papers">
<node CREATED="1415444376364" FOLDED="true" ID="ID_626616497" MODIFIED="1415444691622" TEXT="cosmology">
<node CREATED="1415444661162" ID="ID_1989370488" MODIFIED="1415444663164" TEXT="http://dbpedia.org/resource/Big_Bang_nucleosynthesis"/>
<node CREATED="1415444668381" ID="ID_833228411" MODIFIED="1415444669417" TEXT="http://dbpedia.org/resource/Cosmology"/>
<node CREATED="1415444673540" ID="ID_1772199306" MODIFIED="1415444674282" TEXT="http://dbpedia.org/resource/Wilkinson_Microwave_Anisotropy_Probe"/>
<node CREATED="1415444679626" ID="ID_1007846590" MODIFIED="1415444680456" TEXT="http://dbpedia.org/resource/Hubble_Space_Telescope"/>
<node CREATED="1415444685765" ID="ID_1457452006" MODIFIED="1415444686584" TEXT="http://dbpedia.org/resource/Sterile_neutrino"/>
</node>
<node CREATED="1415444386508" ID="ID_307308798" MODIFIED="1415444387475" TEXT="oceanography "/>
<node CREATED="1415444391053" ID="ID_693027725" MODIFIED="1415444391925" TEXT="sociology "/>
<node CREATED="1415444458798" ID="ID_413918537" MODIFIED="1415444459845" TEXT="evidence based io psychology "/>
<node CREATED="1415444463609" ID="ID_820179470" MODIFIED="1415444464981" TEXT="Thymic Carcinoma in Children "/>
<node CREATED="1415444468897" ID="ID_985332183" MODIFIED="1415444470139" TEXT="bayesian inference of phylogeny and evolutinoary biology "/>
<node CREATED="1415444519745" ID="ID_520624922" MODIFIED="1415444776555" TEXT="Thermo">
<node CREATED="1415444784224" ID="ID_1562376634" MODIFIED="1415444785411" TEXT="http://dbpedia.org/resource/Superfluid_helium-4"/>
<node CREATED="1415444789491" ID="ID_922780183" MODIFIED="1415444790003" TEXT="http://dbpedia.org/resource/Fermi_gas"/>
<node CREATED="1415444793841" ID="ID_578827672" MODIFIED="1415444794479" TEXT="http://dbpedia.org/resource/High-temperature_superconductivity"/>
<node CREATED="1415444800736" ID="ID_1612184077" MODIFIED="1415444801278" TEXT="http://dbpedia.org/resource/Phase_transition"/>
<node CREATED="1415444805789" ID="ID_1780962976" MODIFIED="1415444806431" TEXT="http://dbpedia.org/resource/Fermi_liquid_theory"/>
</node>
<node CREATED="1415444525828" ID="ID_19242472" MODIFIED="1415444526965" TEXT="chemical reactions of polymer crosslinking "/>
<node CREATED="1415444532690" ID="ID_324741998" MODIFIED="1415444533752" TEXT="yaldiz "/>
</node>
<node CREATED="1415444220359" ID="ID_696592524" MODIFIED="1415444235911" POSITION="right" TEXT="Vaguely related papers">
<node CREATED="1415444360209" ID="ID_1442029222" MODIFIED="1415444361450" TEXT="Productivity in CS subareas "/>
<node CREATED="1415444366814" ID="ID_935798374" MODIFIED="1415444367996" TEXT="Logic and the challenge of computer science "/>
<node CREATED="1415444371344" ID="ID_576642368" MODIFIED="1415444373474" TEXT="exploring the role of visualisation "/>
<node CREATED="1415444437520" ID="ID_1585926051" MODIFIED="1415444438797" TEXT="design natural sciences "/>
<node CREATED="1415444442473" ID="ID_278437162" MODIFIED="1415444443496" TEXT="constructivism "/>
<node CREATED="1415444449945" ID="ID_1440571537" MODIFIED="1415444451027" TEXT="object first "/>
<node CREATED="1415444501527" FOLDED="true" ID="ID_1717338941" MODIFIED="1415444769171" TEXT="Survey of Trust in Computer Science">
<node CREATED="1415444727806" ID="ID_1884171693" MODIFIED="1415444728893" TEXT="http://dbpedia.org/resource/Semantic_Web"/>
<node CREATED="1415444734857" ID="ID_1792754202" MODIFIED="1415444735604" TEXT="http://dbpedia.org/resource/Computer_science"/>
<node CREATED="1415444749421" ID="ID_1295350188" MODIFIED="1415444749985" TEXT="http://dbpedia.org/resource/Web_of_trust"/>
<node CREATED="1415444753978" ID="ID_915897094" MODIFIED="1415444754580" TEXT="http://dbpedia.org/resource/Reputation"/>
<node CREATED="1415444758692" ID="ID_138845189" MODIFIED="1415444759374" TEXT="http://dbpedia.org/resource/Semantic_Web_Stack"/>
</node>
<node CREATED="1415444507689" ID="ID_1491279082" MODIFIED="1415444508671" TEXT="ubiquitous computing "/>
<node CREATED="1415444512469" ID="ID_1943309798" MODIFIED="1415444513481" TEXT="newell simon turing "/>
</node>
<node CREATED="1415444999818" ID="ID_1355409214" MODIFIED="1415445423770" POSITION="left" TEXT="recommendations per user">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Query for retrieving results:
    </p>
    <p>
      
    </p>
    <p>
      SELECT distinct ?file
    </p>
    <p>
      {
    </p>
    <p>
      &#160;&#160;&#160;&#160;{
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;SELECT ?file ?curr_aType
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;WHERE
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;{
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;{
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;SELECT DISTINCT ?curr_aType
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;FROM &lt;http://eis.iai.uni-bonn.de/semann/graph/evaluation/user10&gt;
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;WHERE
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;{
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;http://eis.iai.uni-bonn.de/semann/pdf/what%20are%20semantic%20annotations.pdf&gt; &lt;http://eis.iai.uni-bonn.de/semann/0.2/owl#hasAnnotation&gt; ?curr_a .
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;?curr_a a ?curr_aType .
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;}
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;LIMIT 100
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;}
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;{
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;SELECT DISTINCT ?file ?aType
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;FROM &lt;http://eis.iai.uni-bonn.de/semann/graph/evaluation/extra&gt;
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;WHERE
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;{
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;?file &lt;http://eis.iai.uni-bonn.de/semann/0.2/owl#hasAnnotation&gt; ?a .
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;?a a ?aType .
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;FILTER (STRSTARTS(STR(?aType), &quot;http://dbpedia.org&quot;))
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;}
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;LIMIT 1000
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;}
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;FILTER (!sameTerm(&lt;http://eis.iai.uni-bonn.de/semann/pdf/what%20are%20semantic%20annotations.pdf&gt;,?file))
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;FILTER (?curr_aType = ?aType)
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;}
    </p>
    <p>
      &#160;&#160;&#160;&#160;}
    </p>
    <p>
      &#160;&#160;&#160;&#160;union
    </p>
    <p>
      &#160;&#160;&#160;&#160;{
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;SELECT ?file ?curr_aType ?aType ?curr_category
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;WHERE
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;{
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;{
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;SELECT DISTINCT ?curr_aType
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;FROM &lt;http://eis.iai.uni-bonn.de/semann/graph/evaluation/user10&gt;
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;WHERE
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;{
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;http://eis.iai.uni-bonn.de/semann/pdf/what%20are%20semantic%20annotations.pdf&gt; &lt;http://eis.iai.uni-bonn.de/semann/0.2/owl#hasAnnotation&gt; ?curr_a .
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;?curr_a a ?curr_aType .
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;FILTER (STRSTARTS(STR(?curr_aType), &quot;http://dbpedia.org&quot;))
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;}
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;LIMIT 100
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;}
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;{
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;SELECT DISTINCT ?file ?aType
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;FROM &lt;http://eis.iai.uni-bonn.de/semann/graph/evaluation/extra&gt;
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;WHERE
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;{
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;?file &lt;http://eis.iai.uni-bonn.de/semann/0.2/owl#hasAnnotation&gt; ?a .
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;?a a ?aType .
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;FILTER (STRSTARTS(STR(?aType), &quot;http://dbpedia.org&quot;))
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;}
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;LIMIT 1000
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;}
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;FILTER (!sameTerm(&lt;http://eis.iai.uni-bonn.de/semann/pdf/what%20are%20semantic%20annotations.pdf&gt;,?file))
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;FILTER (?curr_aType != ?aType)
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;GRAPH &lt;http://dbpedia.org&gt; {
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;?curr_aType &lt;http://purl.org/dc/terms/subject&gt; ?curr_category .
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;?aType &lt;http://purl.org/dc/terms/subject&gt; ?curr_category .
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;}
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;}
    </p>
    <p>
      &#160;&#160;&#160;&#160;}
    </p>
    <p>
      }
    </p>
  </body>
</html>
</richcontent>
<node CREATED="1415445009200" FOLDED="true" ID="ID_1523248125" MODIFIED="1415445666976" TEXT="user 1">
<node CREATED="1415445665788" ID="ID_1087139873" MODIFIED="1415445665788">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <table class="sparql" style="word-spacing: 0px; text-indent: 0px; text-transform: none; letter-spacing: normal; font-family: Times New Roman" border="1">
      <tr>
        <th>
          file
        </th>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf">http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf">http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf">http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Real-time">http://eis.iai.uni-bonn.de/semann/pdf/Real-time</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf">http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf">http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf">http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf</a>
        </td>
      </tr>
    </table>
  </body>
</html>
</richcontent>
</node>
</node>
<node CREATED="1415445011805" FOLDED="true" ID="ID_1118550427" MODIFIED="1415445646500" TEXT="user 2">
<node CREATED="1415445645192" ID="ID_183525868" MODIFIED="1415445645192">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <table class="sparql" style="word-spacing: 0px; text-indent: 0px; text-transform: none; letter-spacing: normal; font-family: Times New Roman" border="1">
      <tr>
        <th>
          file
        </th>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf">http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf">http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf">http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf">http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf">http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf">http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Real-time">http://eis.iai.uni-bonn.de/semann/pdf/Real-time</a>
        </td>
      </tr>
    </table>
  </body>
</html>
</richcontent>
</node>
</node>
<node CREATED="1415445013660" FOLDED="true" ID="ID_253374491" MODIFIED="1415445619405" TEXT="user 3">
<node CREATED="1415445618122" ID="ID_1225691832" MODIFIED="1415445618122">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <table class="sparql" style="word-spacing: 0px; text-indent: 0px; text-transform: none; letter-spacing: normal; font-family: Times New Roman" border="1">
      <tr>
        <th>
          file
        </th>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf">http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf">http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf">http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf">http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf">http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Newell+Simon-cacm-76.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Newell+Simon-cacm-76.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf">http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Real-time">http://eis.iai.uni-bonn.de/semann/pdf/Real-time</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Docear's%20PDF%20Inspector:%20Title%20Extraction%20from%20PDF%20files%20-%20Docear's_PDF_Inspector_--_Title_Extraction_from_PDF_files.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Docear's%20PDF%20Inspector:%20Title%20Extraction%20from%20PDF%20files%20-%20Docear's_PDF_Inspector_--_Title_Extraction_from_PDF_files.pdf</a>
        </td>
      </tr>
    </table>
  </body>
</html>
</richcontent>
</node>
</node>
<node CREATED="1415445015835" FOLDED="true" ID="ID_718427465" MODIFIED="1415445598017" TEXT="user 4">
<node CREATED="1415445596719" ID="ID_1465302998" MODIFIED="1415445596719">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <table class="sparql" style="word-spacing: 0px; text-indent: 0px; text-transform: none; letter-spacing: normal; font-family: Times New Roman" border="1">
      <tr>
        <th>
          file
        </th>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf">http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf">http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf">http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf">http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf">http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Communications%20of%20the%20ACM%20-%20August%202013%20-%20areas-wainer%20productivity%20across%20cs%20fields.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Communications%20of%20the%20ACM%20-%20August%202013%20-%20areas-wainer%20productivity%20across%20cs%20fields.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf">http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Real-time">http://eis.iai.uni-bonn.de/semann/pdf/Real-time</a>
        </td>
      </tr>
    </table>
  </body>
</html>
</richcontent>
</node>
</node>
<node CREATED="1415445018287" FOLDED="true" ID="ID_1250876229" MODIFIED="1415445575832" TEXT="user 5">
<node CREATED="1415445574463" ID="ID_41642114" MODIFIED="1415445574463">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <table class="sparql" style="word-spacing: 0px; text-indent: 0px; text-transform: none; letter-spacing: normal; font-family: Times New Roman" border="1">
      <tr>
        <th>
          file
        </th>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf">http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf">http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf">http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Real-time">http://eis.iai.uni-bonn.de/semann/pdf/Real-time</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf">http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf">http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf">http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf</a>
        </td>
      </tr>
    </table>
  </body>
</html>
</richcontent>
</node>
</node>
<node CREATED="1415445020518" FOLDED="true" ID="ID_439861471" MODIFIED="1415445550283" TEXT="user 6">
<node CREATED="1415445549305" ID="ID_1496047095" MODIFIED="1415445549305">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <table class="sparql" style="word-spacing: 0px; text-indent: 0px; text-transform: none; letter-spacing: normal; font-family: Times New Roman" border="1">
      <tr>
        <th>
          file
        </th>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf">http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf">http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf">http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Real-time">http://eis.iai.uni-bonn.de/semann/pdf/Real-time</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf">http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf">http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf">http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Docear's%20PDF%20Inspector:%20Title%20Extraction%20from%20PDF%20files%20-%20Docear's_PDF_Inspector_--_Title_Extraction_from_PDF_files.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Docear's%20PDF%20Inspector:%20Title%20Extraction%20from%20PDF%20files%20-%20Docear's_PDF_Inspector_--_Title_Extraction_from_PDF_files.pdf</a>
        </td>
      </tr>
    </table>
  </body>
</html>
</richcontent>
</node>
</node>
<node CREATED="1415445022983" FOLDED="true" ID="ID_1118008070" MODIFIED="1415445532209" TEXT="user 7">
<node CREATED="1415445530721" ID="ID_285351524" MODIFIED="1415445530721">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <table class="sparql" style="word-spacing: 0px; text-indent: 0px; text-transform: none; letter-spacing: normal; font-family: Times New Roman" border="1">
      <tr>
        <th>
          file
        </th>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf">http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf">http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf">http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Real-time">http://eis.iai.uni-bonn.de/semann/pdf/Real-time</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf">http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf">http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf">http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Docear's%20PDF%20Inspector:%20Title%20Extraction%20from%20PDF%20files%20-%20Docear's_PDF_Inspector_--_Title_Extraction_from_PDF_files.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Docear's%20PDF%20Inspector:%20Title%20Extraction%20from%20PDF%20files%20-%20Docear's_PDF_Inspector_--_Title_Extraction_from_PDF_files.pdf</a>
        </td>
      </tr>
    </table>
  </body>
</html>
</richcontent>
</node>
</node>
<node CREATED="1415445025264" FOLDED="true" ID="ID_1586002772" MODIFIED="1415445510343" TEXT="user 8">
<node CREATED="1415445506885" ID="ID_1822659819" MODIFIED="1415445506885">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <table class="sparql" style="word-spacing: 0px; text-indent: 0px; text-transform: none; letter-spacing: normal; font-family: Times New Roman" border="1">
      <tr>
        <th>
          file
        </th>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf">http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf">http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf">http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf">http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf">http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf">http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Real-time">http://eis.iai.uni-bonn.de/semann/pdf/Real-time</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Docear's%20PDF%20Inspector:%20Title%20Extraction%20from%20PDF%20files%20-%20Docear's_PDF_Inspector_--_Title_Extraction_from_PDF_files.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Docear's%20PDF%20Inspector:%20Title%20Extraction%20from%20PDF%20files%20-%20Docear's_PDF_Inspector_--_Title_Extraction_from_PDF_files.pdf</a>
        </td>
      </tr>
    </table>
  </body>
</html>
</richcontent>
</node>
</node>
<node CREATED="1415445028069" FOLDED="true" ID="ID_795180484" MODIFIED="1415445487633" TEXT="user 9">
<node CREATED="1415445482713" ID="ID_1262828957" MODIFIED="1415445482713">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <table class="sparql" style="word-spacing: 0px; text-indent: 0px; text-transform: none; letter-spacing: normal; font-family: Times New Roman" border="1">
      <tr>
        <th>
          file
        </th>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf">http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf">http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf">http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf">http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf</a>
        </td>
      </tr>
    </table>
  </body>
</html>
</richcontent>
</node>
</node>
<node CREATED="1415445030874" FOLDED="true" ID="ID_1061966254" MODIFIED="1415445485733" TEXT="user 10">
<node CREATED="1415445438487" ID="ID_902240347" MODIFIED="1415445438487">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <table class="sparql" style="word-spacing: 0px; text-indent: 0px; text-transform: none; letter-spacing: normal; font-family: Times New Roman" border="1">
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf">http://eis.iai.uni-bonn.de/semann/pdf/KIM_SAP_168.PDF%20-%20kim%20-%20semantic%20annotation%20platform.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf">http://eis.iai.uni-bonn.de/semann/pdf/gate%20architecture.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Microsoft%20Word%20-%20Paper%20I-Semantics2013%20OQT%20FJ%2020130624%20Camera%20Ready.doc%20-%20S.Auer%20-%20User-driven%20quality%20evaluation%20of%20DBpedia.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf">http://eis.iai.uni-bonn.de/semann/pdf/110%20A%20survey%20of%20trust%20in%20computer%20science.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Real-time">http://eis.iai.uni-bonn.de/semann/pdf/Real-time</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf">http://eis.iai.uni-bonn.de/semann/pdf/owl%20sameAs%20and%20Linked%20Data%20-%20An%20Empirical%20Study.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Using%20Aspect-Oriented%20Programming%20to%20extend%20Prot%C3%A9g%C3%A9%20-%20pdftab%20in%20protege.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Integrating%20Keywords%20and%20Semantics%20on%20Document%20Annotation%20and%20Search%20-%20gontogle_full.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Metarel%20ontology.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf">http://eis.iai.uni-bonn.de/semann/pdf/Faceted%20Semantic%20Search%20for%20Scientific%20Publications.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf">http://eis.iai.uni-bonn.de/semann/pdf/CrowdSem13-formatted%20-%20crowdsourced%20semantics%20with%20semantic%20tagging.pdf</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf">http://eis.iai.uni-bonn.de/semann/pdf/sps_sigir2008.dvi%20-%20Exploring%20folksonomy%20for%20personalized%20search.pdf</a>
        </td>
      </tr>
    </table>
  </body>
</html>
</richcontent>
</node>
</node>
</node>
</node>
</map>
