# Intro

`graphml-js` is a simple [GraphML](http://graphml.graphdrawing.org/) parser written in TypeScript, for use in
JavaScript projects. It is far from feature complete, and currently only includes the
minimum functionality I need for a project I'm working on. However, it should be
easy to add features in the future as needed by me or others.

# Example Usage

`graphml-js` takes in a GraphML file, and returns a `Graph` object, which contains
`nodes` and `edges` properties, which are both arrays of `Node` and `Edge` objects,
respectively.

The following example is included in the examples directory.

Given the following graph taken from the [GraphML Primer](http://graphml.graphdrawing.org/primer/graphml-primer.html):

`primer.graphml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns"  
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns 
        http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">
  <key id="d0" for="node" attr.name="color" attr.type="string">
    <default>yellow</default>
  </key>
  <key id="d1" for="edge" attr.name="weight" attr.type="double"/>
  <graph id="G" edgedefault="undirected">
    <node id="n0">
      <data key="d0">green</data>
    </node>
    <node id="n1"/>
    <node id="n2">
      <data key="d0">blue</data>
    </node>
    <node id="n3">
      <data key="d0">red</data>
    </node>
    <node id="n4"/>
    <node id="n5">
      <data key="d0">turquoise</data>
    </node>
    <edge id="e0" source="n0" target="n2">
      <data key="d1">1.0</data>
    </edge>
    <edge id="e1" source="n0" target="n1">
      <data key="d1">1.0</data>
    </edge>
    <edge id="e2" source="n1" target="n3">
      <data key="d1">2.0</data>
    </edge>
    <edge id="e3" source="n3" target="n2"/>
    <edge id="e4" source="n2" target="n4"/>
    <edge id="e5" source="n3" target="n5"/>
    <edge id="e6" source="n5" target="n4">
      <data key="d1">1.1</data>
    </edge>
  </graph>
</graphml>
```

And the following node code:

`simple_example.js`:
```javascript
var graphml = require('graphml-js');
var fs = require('fs');

var graphmlText = fs.readFileSync('primer.graphml');
var parser = new graphml.GraphMLParser();

parser.parse(graphmlText, function(err, graph) {
    console.log(graph);
});
```

The output is:

```
Graph {
  nodes: 
   [ Node { _id: 'n0', _attributes: [Object] },
     Node { _id: 'n1', _attributes: {} },
     Node { _id: 'n2', _attributes: [Object] },
     Node { _id: 'n3', _attributes: [Object] },
     Node { _id: 'n4', _attributes: {} },
     Node { _id: 'n5', _attributes: [Object] } ],
  edges: 
   [ Edge { _id: 'e0', _attributes: [Object], _source: 'n0', _target: 'n2' },
     Edge { _id: 'e1', _attributes: [Object], _source: 'n0', _target: 'n1' },
     Edge { _id: 'e2', _attributes: [Object], _source: 'n1', _target: 'n3' },
     Edge { _id: 'e3', _attributes: {}, _source: 'n3', _target: 'n2' },
     Edge { _id: 'e4', _attributes: {}, _source: 'n2', _target: 'n4' },
     Edge { _id: 'e5', _attributes: {}, _source: 'n3', _target: 'n5' },
     Edge { _id: 'e6', _attributes: [Object], _source: 'n5', _target: 'n4' } ] }
```