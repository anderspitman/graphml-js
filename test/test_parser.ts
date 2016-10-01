/// <reference path="../typings/index.d.ts" />

import * as fs from 'fs';
import * as assert from 'assert';
import { Graph, GraphMLParser } from '../src/graphml_parser';

describe('graphml parser', function() {
  it('graph constructor', function() {
    let graphmlText = fs.readFileSync('test/data/test0.graphml', 'utf8');
    let parser = new GraphMLParser();

    parser.parse(graphmlText, function(err: any, graph: Graph) {
        assert(graph.nodes !== undefined);
        assert(graph.edges !== undefined);
        assert.equal(graph.nodes.length, 37);
        assert.equal(graph.nodes[0].getId(), "n0");
        assert.equal(graph.nodes[1].getId(), "n1");
        assert.equal(graph.nodes[36].getId(), "n36");
    });
  });
});
