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
    function Graph() {
        this.nodes = new Array();
        this.edges = new Array();
    }
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
            cb(err, graphs.map(function (graph) { return new GraphBuilder().build(keys, graph); }));
        });
    };
    return GraphMLParser;
}());
exports.GraphMLParser = GraphMLParser;
var GraphBuilder = /** @class */ (function () {
    function GraphBuilder() {
        this.keys = {};
        this.graph = new Graph();
    }
    GraphBuilder.prototype.build = function (keys, element) {
        this.buildKeys(keys);
        this.buildNodes(element.node);
        this.buildEdges(element.edge);
        return this.graph;
    };
    GraphBuilder.prototype.buildKeys = function (elements) {
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var elem = elements_1[_i];
            var keyId = elem.$['id'];
            var name_1 = elem.$['attr.name'];
            var dataType = elem.$['attr.type'];
            var newKey = new AttributeKey(name_1, dataType);
            this.keys[keyId] = newKey;
        }
    };
    GraphBuilder.prototype.buildNodes = function (elements) {
        for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
            var node = elements_2[_i];
            var id = node.$['id'];
            var newNode = new Node(id);
            if (node.data !== undefined) {
                this.buildAttributes(newNode.attributes, node.data);
            }
            this.graph.nodes.push(newNode);
        }
    };
    GraphBuilder.prototype.buildEdges = function (elements) {
        for (var _i = 0, elements_3 = elements; _i < elements_3.length; _i++) {
            var edge = elements_3[_i];
            var id = edge.$['id'];
            var source = edge.$['source'];
            var target = edge.$['target'];
            var newEdge = new Edge(id, source, target);
            if (edge.data !== undefined) {
                this.buildAttributes(newEdge.attributes, edge.data);
            }
            this.graph.edges.push(newEdge);
        }
    };
    GraphBuilder.prototype.buildAttributes = function (newAttr, attributes) {
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var attribute = attributes_1[_i];
            var attributeKey = attribute.$['key'];
            var attributeName = this.keys[attributeKey].name;
            var attributeValue = attribute._;
            var attributeDataType = this.keys[attributeKey].dataType;
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
    return GraphBuilder;
}());
