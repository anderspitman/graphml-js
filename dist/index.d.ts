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
    nodes: Array<Node>;
    edges: Array<Edge>;
    constructor();
}
export declare class GraphMLParser {
    private keys;
    private graph;
    constructor();
    parse(text: string, cb?: Function): void;
    private buildKeys(data);
    private buildNodes(data);
    private buildEdges(data);
    private buildAttributes(newAttr, attributes);
}
