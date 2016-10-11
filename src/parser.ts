/// <reference path="../typings/index.d.ts" />

import { Parser } from 'xml2js';

export interface AttributeMap {
    [key: string]: any;
}

export abstract class GraphElement {
    private _id: string;
    private _attributes: AttributeMap;

    public get id(): string {
        return this._id;
    }

    public set id(id: string) {
        this._id = id;
    }

    public get attributes(): AttributeMap {
        return this._attributes;
    }

    public set attributes(attributes: AttributeMap) {
        this._attributes = attributes;
    }

    public constructor(id: string) {
        this.id = id;
        this.attributes = {};
    }
}

export class Node extends GraphElement {

    public constructor(id: string) {
        super(id);
    }
}

export class Edge extends GraphElement {
    private _source: string;
    private _target: string;

    public get source(): string {
        return this._source
    }

    public set source(source: string) {
        this._source = source;
    }

    public get target(): string {
        return this._target;
    }

    public set target(target: string) {
        this._target = target;
    }

    public constructor(id: string, source: string, target: string) {
        super(id);

        this.source = source;
        this.target = target;
    }
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
        this.name = name;
        this.dataType = dataType;
    }
}

interface AttributeKeyMap {
    [key: string]: AttributeKey;
}

export class GraphMLParser {
    private keys: AttributeKeyMap;
    private graph: Graph;

    public constructor() {
        this.keys = {};
        this.graph = new Graph();
    }

    public parse(text: string, cb?: Function) {

        let parser = new Parser();

        parser.parseString(text, (err: any, data: any) => {
            this.buildKeys(data);
            this.buildNodes(data);
            this.buildEdges(data);

            cb(err, this.graph);
        });
    }

    private buildKeys(data: any) {
        for (let i in data.graphml.key) {
            const key: any = data.graphml.key[i]['$'];
            const keyId: string = key.id;
            const name: string = key['attr.name'];
            const dataType: string = key['attr.type'];
            const newKey: AttributeKey = new AttributeKey(name, dataType);
            this.keys[keyId] = newKey;
        }
    }

    private buildNodes(data: any) {

        const nodes: any = data.graphml.graph[0].node;

        for (let node of nodes) {
            const id = node['$'].id;

            let newNode: Node = new Node(id);

            if (node.data !== undefined) {
                this.buildAttributes(newNode.attributes, node.data);
            }
            this.graph.nodes.push(newNode);
        }
    }

    private buildEdges(data: any) {

        const edges: any = data.graphml.graph[0].edge;

        for (let edge of edges) {
            const id: string  = edge['$'].id;
            const source: string = edge['$'].source;
            const target: string = edge['$'].target;

            let newEdge: Edge = new Edge(id, source, target);

            if (edge.data !== undefined) {
                this.buildAttributes(newEdge.attributes, edge.data);
            }
            this.graph.edges.push(newEdge);
        }
    }

    private buildAttributes(newAttr: AttributeMap, attributes: any) {
        for (let attribute of attributes) {
            const attributeKey: string = attribute['$'].key;
            const attributeName: string = this.keys[attributeKey].name;
            const attributeValue: string = attribute['_'];
            const attributeDataType: string = this.keys[attributeKey].dataType;

            if (attributeDataType === 'int' ||
                attributeDataType === 'long' ||
                attributeDataType === 'float' ||
                attributeDataType === 'double') {
                
                newAttr[attributeName] = Number(attributeValue);

            }
            else {
                newAttr[attributeName] = attributeValue;
            }
        }
    }
}

