require("should");
require("ometajs");
require("../lib/espresso");
var Parser = require('../lib/grammars/parser.ometajs').Parser
	, _      = require('../lib/nodes');

describe("Parser", function () {
  var parser;
  beforeEach(function () {
    parser = Parser.clone();
  });
  
  
});