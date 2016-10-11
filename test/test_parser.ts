/// <reference path="../typings/index.d.ts" />

import * as fs from 'fs';
import * as assert from 'assert';
import { Graph, GraphMLParser, AttributeMap } from '../src/parser';

describe('graphml parser', function() {
  it('basic', function() {
    let graphmlText = fs.readFileSync('test/data/test0.graphml', 'utf8');
    let parser = new GraphMLParser();

    parser.parse(graphmlText, function(err: any, graph: Graph) {
        assert(graph.nodes !== undefined);

        let attr: AttributeMap;

        assert.strictEqual(graph.nodes.length, 37);

        assert.strictEqual(graph.nodes[0].id, "n0");
        attr = graph.nodes[0].attributes;
        assert.strictEqual(attr['group'], 0);
        assert.strictEqual(attr['label'], "GL-unknown");

        assert.strictEqual(graph.nodes[1].id, "n1");
        attr = graph.nodes[1].attributes;
        assert.strictEqual(attr['group'], 1);
        assert.strictEqual(attr['label'], "GL-1");

        assert.strictEqual(graph.nodes[36].id, "n36");
        attr = graph.nodes[36].attributes;
        assert.strictEqual(attr['group'], 1);
        assert.strictEqual(attr['label'], "LB-NA12012:Solexa-012");

        assert(graph.edges !== undefined);

        const edges = graph.edges;

        assert.strictEqual(edges.length, 27);

        assert.strictEqual(edges[0].id, "e0");
        assert.strictEqual(edges[0].source, "n1");
        assert.strictEqual(edges[0].target, "n2");
        attr = edges[0].attributes;
        assert.strictEqual(attr['family'], 13);
        assert.strictEqual(attr['length'], 0);

        assert.strictEqual(edges[1].id, "e1");
        assert.strictEqual(edges[1].source, "n2");
        assert.strictEqual(edges[1].target, "n7");
        attr = edges[1].attributes;
        assert.strictEqual(attr['family'], 13);
        assert.strictEqual(attr['length'], 1e-08);

        assert.strictEqual(edges[26].id, "e26");
        assert.strictEqual(edges[26].source, "n7");
        assert.strictEqual(edges[26].target, "n31");
        attr = edges[26].attributes;
        assert.strictEqual(attr['family'], 10);
        assert.strictEqual(attr['length'], 3e-08);
    });
  });
});
