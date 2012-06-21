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
  
  describe("Number Rule", function () {
	  it ("can parse integers", function () {
			parser.parseFrom('2', 'number').should.eql(_.Number('2'));
	  });
	  
	  it ("can parse negative integers", function () {
	    parser.parseFrom('-2', 'number').should.eql(_.Number('-2'));
	  });
	  
	  it ("can parse floating points", function () {
	    parser.parseFrom('2.434', 'number').should.eql(_.Number('2.434'));
	  });
	  
	  it ("can parse negative floating points", function () {
	    parser.parseFrom('-2.345', 'number').should.eql(_.Number('-2.345'));
	  });
	  
	  it ("can parse numbers with underscore separators", function () {
	    parser.parseFrom('2_000_000', 'number').should.eql(_.Number('2_000_000'));
	  });
	  
	  it ("can parse hex", function () {
	    parser.parseFrom('0x23af', 'number').should.eql(_.Number(9135).kind('hex'));
	  });
  });
  
  describe("String Rule", function() {
    
    it ("can parse simple strings", function () {
      parser.parseFrom('"foo bar"', 'string').should.eql(_.String("foo bar"));
    });
    
    it ("can parse strings with escape sequences", function() {
      parser.parseFrom('"foo \\"bar\\""', 'string').should.eql(_.String("foo \\\"bar\\\""));
    });
    
    it ("can parse interpolated strings", function () {
      parser.parseFrom('"foo #{1} bar #{"baz"}"', "string").should.eql(_.StringExpr([_.String("foo "), _.Number("1"), _.String(" bar "), _.String("baz")]));
    });
  });
});