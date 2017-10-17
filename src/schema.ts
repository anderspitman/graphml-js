export module schema {
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
}

