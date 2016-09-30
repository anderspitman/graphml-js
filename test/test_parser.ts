/// <reference path="../typings/index.d.ts" />

import * as fs from 'fs';
import * as assert from 'assert';
import { GraphMLParser } from '../src/graphml_parser';

describe('graphml parser', function() {
  it('read file', function() {
    var graphmlText = fs.readFileSync('test/data/test0.graphml', 'utf8');
    var parser = new GraphMLParser();
    var graph = parser.parse(graphmlText);
  });
});
