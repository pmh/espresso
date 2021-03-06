require("should");
require("ometa");
require("../lib/espresso");

var Parser        = require('../lib/grammars/parser.ojs')
	, _             = require('../lib/nodes');

describe("Parser", function () {
  var parser;
  beforeEach(function () {
    parser = Object.create(Parser);
  });

  describe("require rule", function () {

    it("can parse require expressions", function() {
      parser.parseFrom('require: "./foo/bar.es"', 'expr').should.eql(_.Require().path("./foo/bar.es"));
    });
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
    
    it ("can parse identifiers containing with digits, $, - and _", function () {
      parser.parseFrom("foo-bar_123$", 'identifier').should.eql(_.Id("foo-bar_123$"));
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
      parser.parseFrom('"foo #{1} bar #{"baz"}"', "string").should.eql(
        _.StringExpr([_.String("foo "), _.Number("1"), _.String(" bar "), _.String("baz")]));
    });
    
    it ("ignores spaces", function() {
      parser.parseFrom('    "foo bar"   ', 'string').should.eql(_.String("foo bar"));
    });
  });

  describe("symbol rule", function() {
    
    it ("can parse simple symbols", function () {
      parser.parseFrom("'foo", 'symbol').should.eql(_.String("foo"));
    });
    
    it ("can parse symbols with special chars", function() {
      parser.parseFrom("'$foo:bar", 'symbol').should.eql(_.String('$foo:bar'));
    });
    
    it ("ignores spaces", function() {
      parser.parseFrom("    'foo  bar ", 'symbol').should.eql(_.String("foo"));
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
      parser.parseFrom("{   \n    \n }", "lambda").should.eql(_.Lambda(_.FunArgs([]), _.FunBody([])));
      parser.parseFrom("{  x         }", "lambda").should.eql(_.Lambda(_.FunArgs([]), _.FunBody([_.Id("x")])));
      parser.parseFrom("{  x  |      }", "lambda").should.eql(_.Lambda(_.FunArgs([_.Id("x")]), _.FunBody([])));
      parser.parseFrom("{  x  |  x   }", "lambda").should.eql(_.Lambda(_.FunArgs([_.Id("x")]), _.FunBody([_.Id("x")])));
    });
  });
  
  describe("map rule", function() {
    it ("can parse empty maps", function() {
      parser.parseFrom("#{}", "map").should.eql(_.Map());
    });
    
    it ("can parse maps with a single key value pair", function() {
      parser.parseFrom("#{ x: y }", "map").should.eql(_.Map([_.KeyValuePair(_.String("x"), _.Id("y"))]));
    });

    it ("can parse maps with a multiple key value pairs", function() {
      parser.parseFrom("#{ x : y, a : b }", "map").should.eql(
        _.Map([_.KeyValuePair(_.String("x"), _.Id("y")), _.KeyValuePair(_.String("a"), _.Id("b"))]));
    });
       
    it ("ignores spaces", function () {
      parser.parseFrom("  #{                }  ", "map").should.eql(_.Map());
      parser.parseFrom("  #{   x   :    y   }  ", "map").should.eql(_.Map([_.KeyValuePair(_.String("x"), _.Id("y"))]));
      parser.parseFrom("  #{ x : y , a : b  }  ", "map").should.eql(
        _.Map([_.KeyValuePair(_.String("x"), _.Id("y")), _.KeyValuePair(_.String("a"), _.Id("b"))]));
      
      // parser.parseFrom("#{x:y}"    , "map").should.eql(_.Map([_.KeyValuePair(_.Id("x"), _.Id("y"))]));
      // parser.parseFrom("#{x:y,a:b}", "map").should.eql(_.Map([_.KeyValuePair(_.Id("x"), _.Id("y")), _.KeyValuePair(_.Id("a"), _.Id("b"))]));
    })
  });
  
	describe("array rule", function() {
    it ("can parse empty arrays", function() {
      parser.parseFrom("[]", "array").should.eql(_.Array());
    });

    it ("can parse arrays with a single expression", function() {
      parser.parseFrom("[1]", "array").should.eql(_.Array([_.Number("1")]));
    });
  
    it ("can parse arrays with a multiple expressions", function() {
      parser.parseFrom('[1, "foo", bar]', "array").should.eql(_.Array([_.Number("1"), _.String("foo"), _.Id("bar")]));
    });
  	
  	it ("ignores spaces", function () {
  		parser.parseFrom("  [        ]  ", "array").should.eql(_.Array());
  		parser.parseFrom("  [   x    ]  ", "array").should.eql(_.Array([_.Id("x")]));
  		parser.parseFrom("  [ x , 2  ]  ", "array").should.eql(_.Array([_.Id("x"), _.Number("2")]));
  		
  		parser.parseFrom("[x]"  , "array").should.eql(_.Array([_.Id("x")]));
  		parser.parseFrom("[x,1]", "array").should.eql(_.Array([_.Id("x"), _.Number("1")]));
  	})
  });
  

  describe("raw js rule", function() {
    it ("consumes everything inside ` and `", function() {
      parser.parseFrom( "`var foo = function () {};`"      , "rawJS" ).should.eql(_.RawJS().value( "var foo = function () {};"       ));
      parser.parseFrom( "`var foo;\nfoo = function () {};`", "rawJS" ).should.eql(_.RawJS().value( "var foo;\nfoo = function () {};" ));
    });
    
    it ("ignores spaces", function () {
      parser.parseFrom("   `var foo;`   ", "rawJS").should.eql(_.RawJS().value("var foo;"));
    })
  });

  describe("js interop rule", function () {
    it ("can parse js interop expressions", function () {
      parser.parseFrom(".foo", "messageSend").should.eql(_.DotMsg(_.Id("foo")));
      parser.parseFrom(".foo.bar", "messageSend").should.eql(_.DotMsg(_.MemberMsg(_.Id("foo")).name("bar")));
      parser.parseFrom(".foo()", "messageSend").should.eql(_.DotMsg(_.CallMsg(_.Id("foo"), [])));

      parser.parseFrom("foo", "messageSend").should.eql(_.Id("foo"));
      parser.parseFrom("foo.bar", "messageSend").should.eql(_.MemberMsg(_.Id("foo")).name("bar"));
      parser.parseFrom("foo()", "messageSend").should.eql(_.CallMsg(_.Id("foo"), []));

      parser.parseFrom('.foo["bar"]', "messageSend").should.eql(_.DotMsg(_.MemberMsg(_.Id("foo"), _.String("bar"))));
      parser.parseFrom('foo["bar"]', "messageSend").should.eql(_.MemberMsg(_.Id("foo"), _.String("bar")));
    });
  });

  describe("message send rule", function() {
    it ("can parse assignment", function() {
      //parser.parseFrom("x := y", "binaryMessage").should.eql(_.BinaryMsg(_.Id('x'), _.Id('y')).operator(':=').assignment(true));

      parser.parseFrom("x += y", "messageSend").should.eql(
        _.AssignMsg(_.Id('x'), _.Id("y")).operator('+='));
      parser.parseFrom("x -= y", "messageSend").should.eql(
        _.AssignMsg(_.Id('x'), _.Id("y")).operator('-='));

      parser.parseFrom("x *= y", "messageSend").should.eql(
        _.AssignMsg(_.Id('x'), _.Id("y")).operator('*='));
      parser.parseFrom("x /= y", "messageSend").should.eql(
        _.AssignMsg(_.Id('x'), _.Id("y")).operator('/='));
      parser.parseFrom("x %= y", "messageSend").should.eql(
        _.AssignMsg(_.Id('x'), _.Id("y")).operator('%='));

      parser.parseFrom("x &&= y", "messageSend").should.eql(
        _.AssignMsg(_.Id('x'), _.Id("y")).operator('&&='));
      parser.parseFrom("x ||= y", "messageSend").should.eql(
        _.AssignMsg(_.Id('x'), _.Id("y")).operator('||='));

      parser.parseFrom("x &= y", "messageSend").should.eql(
        _.AssignMsg(_.Id('x'), _.Id("y")).operator('&='));
      parser.parseFrom("x |= y", "messageSend").should.eql(
        _.AssignMsg(_.Id('x'), _.Id("y")).operator('|='));
      parser.parseFrom("x ^= y", "messageSend").should.eql(
        _.AssignMsg(_.Id('x'), _.Id("y")).operator('^='));
      parser.parseFrom("x |= y", "messageSend").should.eql(
        _.AssignMsg(_.Id('x'), _.Id("y")).operator('|='));
      
      parser.parseFrom("x >>>= y", "messageSend").should.eql(
        _.AssignMsg(_.Id('x'), _.Id("y")).operator('>>>='));
      parser.parseFrom("x >>= y" , "messageSend").should.eql(
        _.AssignMsg(_.Id('x'), _.Id("y")).operator('>>='));
      parser.parseFrom("x <<= y" , "messageSend").should.eql(
        _.AssignMsg(_.Id('x'), _.Id("y")).operator('<<='));
    });
    
    it ('can parse short-circuiting logic operators', function(){
      parser.parseFrom( "x || y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator("||").short_circuit(true)));
      parser.parseFrom( "x && y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator("&&").short_circuit(true)));
      parser.parseFrom( "x |  y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator("|").short_circuit(true)));
      parser.parseFrom( "x ^  y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator("^").short_circuit(true)));
      parser.parseFrom( "x &  y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator("&").short_circuit(true)));

      parser.parseFrom( "|| y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator("||").short_circuit(true));
      parser.parseFrom( "&& y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator("&&").short_circuit(true));
      parser.parseFrom( "|  y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator("|").short_circuit(true));
      parser.parseFrom( "^  y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator("^").short_circuit(true));
      parser.parseFrom( "&  y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator("&").short_circuit(true));
    });
    
    it ('can parse equality operators', function () {
      parser.parseFrom( "x ==  y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator("==")));
      parser.parseFrom( "x != y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator("!=")));

      parser.parseFrom( "==  y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator("=="));
      parser.parseFrom( "!= y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator("!="));
    });
    
    it ('can parse relational operators', function () {
      parser.parseFrom( "x >= y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator(">=")));
      parser.parseFrom( "x >  y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator(">")));
      parser.parseFrom( "x <= y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator("<=")));
      parser.parseFrom( "x <  y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator("<")));

      parser.parseFrom( ">= y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator(">="));
      parser.parseFrom( ">  y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator(">"));
      parser.parseFrom( "<= y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator("<="));
      parser.parseFrom( "<  y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator("<"));
    });
    
    it ('can parse shift operators', function () {
      parser.parseFrom( "x >>> y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator(">>>")));
      parser.parseFrom( "x <<  y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator("<<")));
      parser.parseFrom( "x >>  y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator(">>")));

      parser.parseFrom( ">>> y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator(">>>"));
      parser.parseFrom( "<<  y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator("<<"));
      parser.parseFrom( ">>  y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator(">>"));
    });
    
    it ('can parse additive operators', function () {
      parser.parseFrom( "x + y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator("+")));
      parser.parseFrom( "x - y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator("-")));

      parser.parseFrom( "+ y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator("+"));
      parser.parseFrom( "- y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator("-"));
    });
    
    it ('can parse multiplicative operators', function () {
      parser.parseFrom( "x * y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator("*")));
      parser.parseFrom( "x / y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator("/")));
      parser.parseFrom( "x % y", "messageSend" ).should.eql(_.UnaryMsg(_.Id("x"), _.BinaryMsg(_.Id("y")).operator("%")));

      parser.parseFrom( "* y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator("*"));
      parser.parseFrom( "/ y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator("/"));
      parser.parseFrom( "% y",   "messageSend" ).should.eql(_.BinaryMsg(_.Id("y")).operator("%"));
    });
    
    it ("can parse unary messages", function () {
      parser.parseFrom('foo bar'     , 'messageSend').should.eql(_.UnaryMsg(_.Id("foo"), _.Id("bar")));
      parser.parseFrom('foo bar baz' , 'messageSend').should.eql(_.UnaryMsg(_.UnaryMsg(_.Id("foo"), _.Id("bar")), _.Id("baz")));
      parser.parseFrom('1 bar'       , 'messageSend').should.eql(_.UnaryMsg(_.Number('1'), _.Id("bar")));
      parser.parseFrom('foo 1'       , 'messageSend').should.eql(_.UnaryMsg(_.Id("foo"), _.Number('1')));      
      parser.parseFrom('foo  \t  bar', 'messageSend').should.eql(_.UnaryMsg(_.Id("foo"), _.Id("bar")));
    });
    
    it ("can parse keyword messages", function () {
      parser.parseFrom('foo: "bar"',         'messageSend').should.eql(
        _.KeywordMsg([_.Keyword(_.Id('foo')), [_.String("bar")]]));

      parser.parseFrom('foo: "bar" baz: 23', 'messageSend').should.eql(
        _.KeywordMsg([_.Keyword(_.Id('foo')), [_.String("bar")], _.Keyword(_.Id('baz')), [_.Number("23")]]));
    });
    
    it ("can parse unary messages followed by keyword messages", function () {
      parser.parseFrom('foo bar: "baz"', 'messageSend').should.eql(
        _.UnaryMsg(_.Id("foo"), _.KeywordMsg([_.Keyword(_.Id('bar')), [_.String("baz")]])));

      parser.parseFrom('foo bar baz: "quux"', 'messageSend').should.eql(
        _.UnaryMsg(_.UnaryMsg(_.Id("foo"), _.Id("bar")), _.KeywordMsg([_.Keyword(_.Id('baz')), [_.String("quux")]])));
    });
    
    it ("can parse unary messages followed by keyword method definitions", function () {
      parser.parseFrom('foo bar: baz := {}', 'expr').should.eql(
        _.UnaryMsg(
          _.Id("foo"),
          _.MethodDef(
            _.Id("bar:"),
            _.Lambda(_.FunArgs([_.Id("baz")]), _.FunBody([])).name("bar:")).predicates([_.Id("true")])));
      
      parser.parseFrom('foo bar baz: quux := {}', 'expr').should.eql(
        _.UnaryMsg(
          _.UnaryMsg(
            _.Id("foo"),
            _.Id("bar")),
          _.MethodDef(
            _.Id("baz:"),
            _.Lambda(_.FunArgs([_.Id("quux")]), _.FunBody([])).name("baz:")).predicates([_.Id("true")])));
    });
    
    
    it ("can parse unary messages followed by binary method definitions", function () {
      parser.parseFrom('foo + x := { }', 'messageSend').should.eql(
        _.UnaryMsg(
          _.Id("foo"),
          _.MethodDef(
            _.Id("+"), 
            _.Lambda(_.FunArgs([_.Id("x")]), _.FunBody([])).name("+"))));
      
      parser.parseFrom('foo bar + x := {}', 'messageSend').should.eql(
      _.UnaryMsg(
          _.UnaryMsg(
            _.Id("foo"),
            _.Id("bar")),
          _.MethodDef(
            _.Id("+"),
            _.Lambda(_.FunArgs([_.Id("x")]), _.FunBody([])).name("+"))));
    });
    
    it ('can parse multiple messages', function () {
      parser.parseFrom("x += y || z", "messageSend").should.eql(
      _.AssignMsg (
          _.Id('x'), 
          _.UnaryMsg(_.Id('y'), _.BinaryMsg(_.Id('z')).operator('||').short_circuit(true))
        ).operator('+='));
    });
  });
  
  describe ("method def rule", function () {
    
    it ("can parse keyword methods", function () {
      parser.parseFrom("foo: bar := {}", 'messageSend').should.eql(
        _.MethodDef(_.Id("foo:"), _.Lambda(_.FunArgs([_.Id("bar")]), _.FunBody([])).name("foo:")).predicates([_.Id("true")]));
      parser.parseFrom("foo: bar := { x }", 'messageSend').should.eql(
      _.MethodDef(
          _.Id("foo:"), 
          _.Lambda(_.FunArgs([_.Id("bar")]), _.FunBody([_.Id("x")])).name("foo:")
        ).predicates([_.Id("true")]));
      parser.parseFrom("foo: bar := { x\ny }", 'messageSend').should.eql(
        _.MethodDef(
          _.Id("foo:"), 
          _.Lambda(_.FunArgs([_.Id("bar")]), _.FunBody([_.Id("x"), _.Id("y")])).name("foo:")
        ).predicates([_.Id("true")]));
      parser.parseFrom("foo: bar baz: quux := {}", 'messageSend').should.eql(
        _.MethodDef(
          _.Id("foo:baz:"), 
          _.Lambda(_.FunArgs([_.Id("bar"), _.Id("quux")]), _.FunBody([])).name("foo:baz:")
        ).predicates([_.Id("true"), _.Id("true")]));
    });
    
    it ("can parse keyword methods with variadic arguments", function () {
      parser.parseFrom("foo: *bar := {}", 'messageSend').should.eql(
        _.MethodDef(
          _.Id("foo:"), 
          _.Lambda(_.FunArgs([_.VarArg(_.Id("bar"))]), _.FunBody([])).name("foo:")
        ).predicates([_.Id("true")]));
    });
    
    it ("can parse keyword methods with optional arguments", function () {
      parser.parseFrom("foo: bar(2) := {}", 'messageSend').should.eql(
        _.MethodDef(
          _.Id("foo:"), 
          _.Lambda(_.FunArgs([_.OptArg(_.Id("bar"), _.Number("2"))]), _.FunBody([])).name("foo:")
        ).predicates([_.Id("true")]));
    });

    it ("can parse keyword methods with predicated arguments", function () {
      parser.parseFrom("foo: bar @{understands?: 'baz} := {}", 'messageSend').should.eql(
        _.MethodDef(
          _.Id("foo:"), 
          _.Lambda(_.FunArgs([_.Id("bar")]), _.FunBody([])).name("foo:")
        ).predicates([
          _.PartialLambda(_.FunBody([_.KeywordMsg([_.Keyword(_.Id('understands?')), [_.String("baz")]])]))
        ]));
    })

    it ("can parse binary methods", function () {
      parser.parseFrom("|| lhs  := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id("||"), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name("||")
        ));
      parser.parseFrom("&& lhs  := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id("&&"), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name("&&")
        ));
      parser.parseFrom("| lhs   := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id("|"), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name("|")
        ));
      parser.parseFrom("^ lhs   := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id("^"), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name("^")
        ));
      parser.parseFrom("& lhs   := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id("&"), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name("&")
        ));
      parser.parseFrom("== lhs   := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id("=="), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name("==")
        ));
      parser.parseFrom("!= lhs  := { }", 'methodDef').should.eql(
        _.MethodDef(
          _.Id("!="), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name("!=")
        ));
      parser.parseFrom("<= lhs  := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id("<="), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name("<=")
        ));
      parser.parseFrom("< lhs   := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id("<"), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name("<")
        ));
      parser.parseFrom(">= lhs  := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id(">="), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name(">=")
        ));
      parser.parseFrom("> lhs   := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id(">"), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name(">")
        ));
      parser.parseFrom(">>> lhs := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id(">>>"), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name(">>>")
        ));
      parser.parseFrom(">> lhs  := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id(">>"), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name(">>")
        ));
      parser.parseFrom("+ lhs   := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id("+"), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name("+")
        ));
      parser.parseFrom("- lhs   := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id("-"), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name("-")
        ));
      parser.parseFrom("* lhs   := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id("*"), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name("*")
        ));
      parser.parseFrom("/ lhs   := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id("/"), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name("/")
        ));
      parser.parseFrom("% lhs   := {}", 'methodDef').should.eql(
        _.MethodDef(
          _.Id("%"), 
          _.Lambda(_.FunArgs([_.Id("lhs")]), _.FunBody([])).name("%")
        ));
    });
    
    it ("can parse unary methods", function () {
      parser.parseFrom("foo := { }", "messageSend").should.eql(
        _.MethodDef(_.Id("foo"), _.Lambda(_.FunArgs([]), _.FunBody([])).name("foo")));
      parser.parseFrom("foo bar := { }", "messageSend").should.eql(
        _.UnaryMsg(_.Id("foo"), _.MethodDef(_.Id("bar"), _.Lambda(_.FunArgs([]), _.FunBody([])).name("bar"))));
    });
  });
});