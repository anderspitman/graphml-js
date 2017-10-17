import { Parser } from 'xml2js';
import * as schema from './schema';

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
    private constructor(public readonly nodes: Array<Node>, public readonly edges: Array<Edge>) { }

    public static create(keyElements: schema.GraphKeyElement[], graphElement: schema.GraphElement): Graph {
        let keys = this.buildKeys(keyElements);
        let nodes = this.buildNodes(keys, graphElement.node);
        let edges = this.buildEdges(keys, graphElement.edge);
        return new Graph(nodes, edges);
    }

    private static buildKeys(elements: schema.GraphKeyElement[] | null): AttributeKeyMap {
        if (typeof(elements) === undefined || elements == null) {
            return {};
        }

        let keys: AttributeKeyMap = {};


        for (let elem of elements) {
            const keyId: string = elem.$['id'];
            const name: string = elem.$['attr.name'];
            const dataType: string = elem.$['attr.type'];
            const newKey: AttributeKey = new AttributeKey(name, dataType);
            keys[keyId] = newKey;
        }

        return keys;
    }

    private static buildNodes(keys: AttributeKeyMap, elements: schema.GraphNodeElement[] | null): Array<Node> {
        if (typeof(elements) === undefined || elements == null) {
            return [];
        }

        let nodes = new Array<Node>();

        for (let node of elements) {
            const id = node.$['id'];

            let newNode: Node = new Node(id);

            if (node.data !== undefined) {
                this.buildAttributes(keys, newNode.attributes, node.data);
            }
            nodes.push(newNode);
        }

        return nodes;
    }

    private static buildEdges(keys: AttributeKeyMap, elements: schema.GraphEdgeElement[] | null) {
        if (typeof(elements) === undefined || elements == null) {
            return [];
        }

        let edges = new Array<Edge>();

        for (let edge of elements) {
            const id: string = edge.$['id']
            const source: string = edge.$['source'];
            const target: string = edge.$['target'];

            let newEdge: Edge = new Edge(id, source, target);

            if (edge.data !== undefined) {
                this.buildAttributes(keys, newEdge.attributes, edge.data);
            }
            edges.push(newEdge);
        }

        return edges;
    }

    private static buildAttributes(keys: AttributeKeyMap, newAttr: AttributeMap, attributes: schema.GraphDataElement[]): void {
        for (let attribute of attributes) {
            const attributeKey: string = attribute.$['key'];
            const attributeName: string = keys[attributeKey].name;
            const attributeValue: string = attribute._;
            const attributeDataType: string = keys[attributeKey].dataType;

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
    public parse(text: string, cb?: Function) {

        let parser = new Parser();

        parser.parseString(text, (err: any, document: schema.GraphMLDocument) => {
            if (err) {
                cb(err, []);
                return;
            }

            let graphs = document.graphml.graph;
            let keys = document.graphml.key;
            cb(err, graphs.map((graph: schema.GraphElement) => Graph.create(keys, graph)));
        });
    }
}
