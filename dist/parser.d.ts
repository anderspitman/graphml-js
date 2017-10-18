import * as schema from './schema';
export interface AttributeMap {
    [key: string]: any;
}
export declare abstract class GraphElement {
    private _id;
    private _attributes;
    id: string;
    attributes: AttributeMap;
    constructor(id: string);
}
export declare class Node extends GraphElement {
    constructor(id: string);
}
export declare class Edge extends GraphElement {
    private _source;
    private _target;
    source: string;
    target: string;
    constructor(id: string, source: string, target: string);
}
export declare class Graph {
    readonly nodes: Array<Node>;
    readonly edges: Array<Edge>;
    private constructor();
    static create(keyElements: schema.GraphKeyElement[], graphElement: schema.GraphElement): Graph;
    private static buildKeys(elements);
    private static buildNodes(keys, elements);
    private static buildEdges(keys, elements);
    private static buildAttributes(keys, newAttr, attributes);
}
export declare class GraphMLParser {
    parse(text: string, cb?: Function): void;
}
