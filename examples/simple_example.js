var graphml = require('graphml-js');
var fs = require('fs');

var graphmlText = fs.readFileSync('primer.graphml');
var parser = new graphml.GraphMLParser();

parser.parse(graphmlText, function(err, graph) {
    console.log(graph);
});
