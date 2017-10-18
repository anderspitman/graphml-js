export interface Attribute {
    [key: string]: string;
}

export interface GraphDataElement {
    '$': Attribute;
    '_'?: string;
}

export interface GraphNodeElement {
    '$': Attribute;
    data: GraphDataElement[];
}

export interface GraphEdgeElement {
    '$': Attribute;
    data: GraphDataElement[];
}

export interface GraphKeyElement {
    '$': Attribute;
    // at most one value
    defaultValue: string[];
}

export interface GraphElement {
    '$': Attribute;
    node: GraphNodeElement[];
    edge: GraphEdgeElement[];
}

export interface GraphMLDocument {
    graphml: {
        key: GraphKeyElement[];
        graph: GraphElement[];
    }
}

