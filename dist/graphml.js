"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var xml2js_1 = require("xml2js");
var GraphElement = /** @class */ (function () {
    function GraphElement(id) {
        this.id = id;
        this.attributes = {};
    }
    Object.defineProperty(GraphElement.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphElement.prototype, "attributes", {
        get: function () {
            return this._attributes;
        },
        set: function (attributes) {
            this._attributes = attributes;
        },
        enumerable: true,
        configurable: true
    });
    return GraphElement;
}());
exports.GraphElement = GraphElement;
var Node = /** @class */ (function (_super) {
    __extends(Node, _super);
    function Node(id) {
        return _super.call(this, id) || this;
    }
    return Node;
}(GraphElement));
exports.Node = Node;
var Edge = /** @class */ (function (_super) {
    __extends(Edge, _super);
    function Edge(id, source, target) {
        var _this = _super.call(this, id) || this;
        _this.source = source;
        _this.target = target;
        return _this;
    }
    Object.defineProperty(Edge.prototype, "source", {
        get: function () {
            return this._source;
        },
        set: function (source) {
            this._source = source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Edge.prototype, "target", {
        get: function () {
            return this._target;
        },
        set: function (target) {
            this._target = target;
        },
        enumerable: true,
        configurable: true
    });
    return Edge;
}(GraphElement));
exports.Edge = Edge;
var Graph = /** @class */ (function () {
    function Graph(nodes, edges) {
        this.nodes = nodes;
        this.edges = edges;
    }
    Graph.create = function (keyElements, graphElement) {
        var keys = this.buildKeys(keyElements);
        var nodes = this.buildNodes(keys, graphElement.node);
        var edges = this.buildEdges(keys, graphElement.edge);
        return new Graph(nodes, edges);
    };
    Graph.buildKeys = function (elements) {
        var keys = {};
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var elem = elements_1[_i];
            var keyId = elem.$['id'];
            var name_1 = elem.$['attr.name'];
            var dataType = elem.$['attr.type'];
            var newKey = new AttributeKey(name_1, dataType);
            keys[keyId] = newKey;
        }
        return keys;
    };
    Graph.buildNodes = function (keys, elements) {
        var nodes = new Array();
        for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
            var node = elements_2[_i];
            var id = node.$['id'];
            var newNode = new Node(id);
            if (node.data !== undefined) {
                this.buildAttributes(keys, newNode.attributes, node.data);
            }
            nodes.push(newNode);
        }
        return nodes;
    };
    Graph.buildEdges = function (keys, elements) {
        var edges = new Array();
        for (var _i = 0, elements_3 = elements; _i < elements_3.length; _i++) {
            var edge = elements_3[_i];
            var id = edge.$['id'];
            var source = edge.$['source'];
            var target = edge.$['target'];
            var newEdge = new Edge(id, source, target);
            if (edge.data !== undefined) {
                this.buildAttributes(keys, newEdge.attributes, edge.data);
            }
            edges.push(newEdge);
        }
        return edges;
    };
    Graph.buildAttributes = function (keys, newAttr, attributes) {
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var attribute = attributes_1[_i];
            var attributeKey = attribute.$['key'];
            var attributeName = keys[attributeKey].name;
            var attributeValue = attribute._;
            var attributeDataType = keys[attributeKey].dataType;
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
    };
    return Graph;
}());
exports.Graph = Graph;
var AttributeKey = /** @class */ (function () {
    function AttributeKey(name, dataType) {
        this.name = name;
        this.dataType = dataType;
    }
    return AttributeKey;
}());
var GraphMLParser = /** @class */ (function () {
    function GraphMLParser() {
    }
    GraphMLParser.prototype.parse = function (text, cb) {
        var parser = new xml2js_1.Parser();
        parser.parseString(text, function (err, document) {
            if (err) {
                cb(err, []);
                return;
            }
            var graphs = document.graphml.graph;
            var keys = document.graphml.key;
            cb(err, graphs.map(function (graph) { return Graph.create(keys, graph); }));
        });
    };
    return GraphMLParser;
}());
exports.GraphMLParser = GraphMLParser;
