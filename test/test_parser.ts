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

        //assert(graph.nodes[0].id == "n0");
    });
  });
});
