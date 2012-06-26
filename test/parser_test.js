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
  
  describe("identifier rule", function () {
    
    it ("can parse alpha numerical identifiers", function () {
      parser.parseFrom("foo", 'identifier').should.eql(_.Id("foo"));
    });
    
    it ("can parse single character identifiers", function () {
      parser.parseFrom("f", 'identifier').should.eql(_.Id("f"));
    });
    
    it ("can parse mixed case identifiers", function () {
      parser.parseFrom("FoO", 'identifier').should.eql(_.Id("FoO"));
    });
    
    it ("can parse identifiers beginning with _", function () {
      parser.parseFrom("_foo", 'identifier').should.eql(_.Id("_foo"));
    });
    
    it ("can parse identifiers beginning with $", function () {
      parser.parseFrom("$foo", 'identifier').should.eql(_.Id("$foo"));
    });
    
    it ("can parse identifiers containing with digits, $ and _", function () {
      parser.parseFrom("foo_123$", 'identifier').should.eql(_.Id("foo_123$"));
    });
    
    it ("ignores spaces", function () {
      parser.parseFrom("    foo   ", 'identifier').should.eql(_.Id("foo"));
    });
  });
  
  describe("number rule", function () {
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
	  
	  it ("ignores spaces", function() {
	    parser.parseFrom('    2        ', 'number').should.eql(_.Number('2'));
	    parser.parseFrom('   -2        ', 'number').should.eql(_.Number('-2'));
	    parser.parseFrom('    2.434    ', 'number').should.eql(_.Number('2.434'));
	    parser.parseFrom('   -2.345    ', 'number').should.eql(_.Number('-2.345'));
	    parser.parseFrom('  2_000_000  ', 'number').should.eql(_.Number('2_000_000'));
	    parser.parseFrom('   0x23af    ', 'number').should.eql(_.Number(9135).kind('hex'));
	  });
  });
  
  describe("string rule", function() {
    
    it ("can parse simple strings", function () {
      parser.parseFrom('"foo bar"', 'string').should.eql(_.String("foo bar"));
    });
    
    it ("can parse strings with escape sequences", function() {
      parser.parseFrom('"foo \\"bar\\""', 'string').should.eql(_.String('foo \\"bar\\"'));
    });
    
    it ("can parse interpolated strings", function () {
      parser.parseFrom('"foo #{1} bar #{"baz"}"', "string").should.eql(_.StringExpr([_.String("foo "), _.Number("1"), _.String(" bar "), _.String("baz")]));
    });
    
    it ("ignores spaces", function() {
      parser.parseFrom('    "foo bar"   ', 'string').should.eql(_.String("foo bar"));
    });
  });
  
  describe("regexp rule", function() {
    
    it ("can parse simple regexps", function () {
      parser.parseFrom('/[a-z]{2}/', 'regexp').should.eql(_.RegExp("[a-z]{2}"));
    });
    
    it ("can parse regexps with modifier flags", function() {
      parser.parseFrom('/[a-z]{2}/gi', 'regexp').should.eql(_.RegExp("[a-z]{2}").flags("gi"));
    });
    
    it ("can parse regexps with escape sequences", function() {
      parser.parseFrom('/\\{/', 'regexp').should.eql(_.RegExp("\\{"));
    });
    
    it ("ignores spaces", function() {
      parser.parseFrom('   /[a-z]{2}/   ', 'regexp').should.eql(_.RegExp("[a-z]{2}"));
    });
  });
  
  describe("lambda rule", function() {
    it ("can parse empty lambdas", function() {
      parser.parseFrom("{}", "lambda").should.eql(_.Lambda(_.FunArgs([]), _.FunBody([])));
    });
    
    it ("can parse lambdas without arguments", function() {
      parser.parseFrom("{ x }", "lambda").should.eql(_.Lambda(_.FunArgs([]), _.FunBody([_.Id("x")])));
    });
    
    it ("can parse empty lambdas with params", function () {
      parser.parseFrom("{ x | }", "lambda").should.eql(_.Lambda(_.FunArgs([_.Id("x")]), _.FunBody([])));
    });
    
    it ("can parse lambdas with params and body", function () {
      parser.parseFrom("{ x | x }", "lambda").should.eql(_.Lambda(_.FunArgs([_.Id("x")]), _.FunBody([_.Id("x")])));
    });
    
    it ("ignores spaces", function () {
      parser.parseFrom("{x}", "lambda").should.eql(_.Lambda(_.FunArgs([]), _.FunBody([_.Id("x")])));
      parser.parseFrom("{x|}", "lambda").should.eql(_.Lambda(_.FunArgs([_.Id("x")]), _.FunBody([])));
      parser.parseFrom("{x|x}", "lambda").should.eql(_.Lambda(_.FunArgs([_.Id("x")]), _.FunBody([_.Id("x")])));
      
      parser.parseFrom("   {x}    ", "lambda").should.eql(_.Lambda(_.FunArgs([]), _.FunBody([_.Id("x")])));
      
      parser.parseFrom("{            }", "lambda").should.eql(_.Lambda(_.FunArgs([]), _.FunBody([])));
      parser.parseFrom("{  x         }", "lambda").should.eql(_.Lambda(_.FunArgs([]), _.FunBody([_.Id("x")])));
      parser.parseFrom("{  x  |      }", "lambda").should.eql(_.Lambda(_.FunArgs([_.Id("x")]), _.FunBody([])));
      parser.parseFrom("{  x  |  x   }", "lambda").should.eql(_.Lambda(_.FunArgs([_.Id("x")]), _.FunBody([_.Id("x")])));
    });
  });
  
  describe("map rule", function() {
    it ("can parse empty maps", function() {
      parser.parseFrom("{:}", "map").should.eql(_.Map());
    });
    
    it ("can parse maps with a single key value pair", function() {
      parser.parseFrom("{ x: y }", "map").should.eql(_.Map([_.KeyValuePair(_.Id("x"), _.Id("y"))]));
    });

    it ("can parse maps with a multiple key value pairs", function() {
      parser.parseFrom("{ x : y, a : b }", "map").should.eql(_.Map([_.KeyValuePair(_.Id("x"), _.Id("y")), _.KeyValuePair(_.Id("a"), _.Id("b"))]));
    });
    
    it ("allows keys and values to be expressions", function () {
      parser.parseFrom('{ 2: "x" }', "map").should.eql(_.Map([_.KeyValuePair(_.Number("2"), _.String("x"))]));
    });
    
    it ("ignores spaces", function () {
      parser.parseFrom("  {       :        }  ", "map").should.eql(_.Map());
      parser.parseFrom("  {   x   :    y   }  ", "map").should.eql(_.Map([_.KeyValuePair(_.Id("x"), _.Id("y"))]));
      parser.parseFrom("  { x : y , a : b  }  ", "map").should.eql(_.Map([_.KeyValuePair(_.Id("x"), _.Id("y")), _.KeyValuePair(_.Id("a"), _.Id("b"))]));
      parser.parseFrom('  {   2   :   "x"  }  ', "map").should.eql(_.Map([_.KeyValuePair(_.Number("2"), _.String("x"))]));
      
      parser.parseFrom("{x:y}", "map").should.eql(_.Map([_.KeyValuePair(_.Id("x"), _.Id("y"))]));
      parser.parseFrom("{x:y,a:b}  ", "map").should.eql(_.Map([_.KeyValuePair(_.Id("x"), _.Id("y")), _.KeyValuePair(_.Id("a"), _.Id("b"))]));
    })
  });
});