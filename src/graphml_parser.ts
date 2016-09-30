/// <reference path="../typings/index.d.ts" />

import { Parser } from 'xml2js';

export class Node {
}

export class Edge {
}

export class Graph {
    nodes: Array<Node>;
    edges: Array<Edge>;

    constructor() {
        this.nodes = new Array<Node>();
        this.edges = new Array<Edge>();
    }
}

export class GraphMLParser {
    private keys: Array<any>;

    public constructor() {
        this.keys = Array<any>();
    }

    public parse(text: string, cb?: Function) {

        let parser = new Parser();

        parser.parseString(text, (err: any, data: any) => {
            let graph = new Graph();
            this.buildKeys(data);
            this.buildNodes(data);

            for (let key of this.keys) {
                console.log(key);
            }

            cb(err, graph);
        });
    }

    private buildKeys(data: any) {
        for (let i in data.graphml.key) {
            this.keys.push(data.graphml.key[i]['$']);
        }
    }

    private buildNodes(data: any) {
        const nodes: any = data.graphml.graph[0].node;
        for (let node of nodes) {
            console.log(node);
        }
    }
}

