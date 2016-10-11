/// <reference path="../typings/index.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var xml2js_1 = require('xml2js');
var GraphElement = (function () {
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
var Node = (function (_super) {
    __extends(Node, _super);
    function Node(id) {
        _super.call(this, id);
    }
    return Node;
}(GraphElement));
exports.Node = Node;
var Edge = (function (_super) {
    __extends(Edge, _super);
    function Edge(id, source, target) {
        _super.call(this, id);
        this.source = source;
        this.target = target;
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
var Graph = (function () {
    function Graph() {
        this.nodes = new Array();
        this.edges = new Array();
    }
    return Graph;
}());
exports.Graph = Graph;
var AttributeKey = (function () {
    function AttributeKey(name, dataType) {
        this.name = name;
        this.dataType = dataType;
    }
    return AttributeKey;
}());
var GraphMLParser = (function () {
    function GraphMLParser() {
        this.keys = {};
        this.graph = new Graph();
    }
    GraphMLParser.prototype.parse = function (text, cb) {
        var _this = this;
        var parser = new xml2js_1.Parser();
        parser.parseString(text, function (err, data) {
            _this.buildKeys(data);
            _this.buildNodes(data);
            _this.buildEdges(data);
            cb(err, _this.graph);
        });
    };
    GraphMLParser.prototype.buildKeys = function (data) {
        for (var i in data.graphml.key) {
            var key = data.graphml.key[i]['$'];
            var keyId = key.id;
            var name_1 = key['attr.name'];
            var dataType = key['attr.type'];
            var newKey = new AttributeKey(name_1, dataType);
            this.keys[keyId] = newKey;
        }
    };
    GraphMLParser.prototype.buildNodes = function (data) {
        var nodes = data.graphml.graph[0].node;
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            var id = node['$'].id;
            var newNode = new Node(id);
            if (node.data !== undefined) {
                this.buildAttributes(newNode.attributes, node.data);
            }
            this.graph.nodes.push(newNode);
        }
    };
    GraphMLParser.prototype.buildEdges = function (data) {
        var edges = data.graphml.graph[0].edge;
        for (var _i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
            var edge = edges_1[_i];
            var id = edge['$'].id;
            var source = edge['$'].source;
            var target = edge['$'].target;
            var newEdge = new Edge(id, source, target);
            if (edge.data !== undefined) {
                this.buildAttributes(newEdge.attributes, edge.data);
            }
            this.graph.edges.push(newEdge);
        }
    };
    GraphMLParser.prototype.buildAttributes = function (newAttr, attributes) {
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var attribute = attributes_1[_i];
            var attributeKey = attribute['$'].key;
            var attributeName = this.keys[attributeKey].name;
            var attributeValue = attribute['_'];
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
    return GraphMLParser;
}());
exports.GraphMLParser = GraphMLParser;
