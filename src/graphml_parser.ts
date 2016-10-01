/// <reference path="../typings/index.d.ts" />

import { Parser } from 'xml2js';

export class Node {
    private id: string

    public constructor(id: string) {
        this.id = id;
    }

    public getId(): string {
        return this.id;
    }
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

class AttributeKey {
    public name: string;
    public dataType: string;

    constructor(name: string, dataType: string) {
    }
}

export class GraphMLParser {
    private keys: { [key: string]: AttributeKey };
    private graph: Graph;

    public constructor() {
        //this.keys = { [key: string]: AttributeKey };
        this.graph = new Graph();
    }

    public parse(text: string, cb?: Function) {

        let parser = new Parser();

        parser.parseString(text, (err: any, data: any) => {
            this.buildKeys(data);
            this.buildNodes(data);

            //for (let key of this.keys) {
            //    console.log(key);
            //}

            cb(err, this.graph);
        });
    }

    private buildKeys(data: any) {
        for (let i in data.graphml.key) {
            const key: any = data.graphml.key[i]['$'];
            const keyId: string = key.id;
            const dataType: string = key['attr.type'];
            let newKey: AttributeKey = new AttributeKey(keyId, dataType);
            this.keys[keyId] = newKey;
        }
    }

    private buildNodes(data: any) {
        const nodes: any = data.graphml.graph[0].node;
        for (let node of nodes) {

            const id = node['$'].id;
            console.log(id);

            let newNode = new Node(id);

            for (let attribute of node.data) {
                const attributeKey: string = attribute['$'].key;
                //const attributeName: string = this.keys[attributeKey].name;
                //console.log(attributeName);
                //let attributeName: string = att
                //console.log(attribute);
            }

            this.graph.nodes.push(newNode);
        }
    }
}

