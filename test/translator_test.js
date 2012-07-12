require("should");
require("ometa");
require("../lib/espresso");

var Translator = require('../lib/grammars/translator.ojs')
  , Parser     = require('../lib/grammars/parser.ojs')

describe("Translator", function () {
  var translator, parser, compile;
  beforeEach(function () {
    translator = Translator.clone();
    parser     = Parser.clone();
    compile    = function (input, rule) { return translator.translate(parser.parseFrom(input, rule || 'expr')); };
  });

  describe("Identifiers", function () {

    it("should translate identifiers", function() {
      compile('foo', "identifier").should.eql("foo");
    });
  });

  describe("Numbers", function () {
    it("should translate integers", function() {
      compile("2").should.eql("2");
    });

    it("should translate negative integers", function() {
      compile("-2").should.eql("-2");
    });

    it("should translate floating points", function() {
      compile("2.345").should.eql("2.345");
    });

    it("should translate negative floating points", function() {
      compile("-2.345").should.eql("-2.345");
    });

    it("should translate underscore separated numbers", function() {
      compile("2_000_000").should.eql("2000000");
    });
  });

  describe("Strings", function() {
    it ("should translate regular strings", function () {
      compile('"foo bar"').should.eql('"foo bar"');
    });
    
    it ("should translate escaped strings", function() {
      compile('"foo \\"bar\\""').should.eql('"foo \\"bar\\""');
    });

    it("should translate multi-line strings", function() {
      compile('"foo\nbar\nbaz"').should.eql('"foo\\nbar\\nbaz"')
    });
    
    it ("should translate interpolated strings", function () {
      compile('"foo #{1} bar #{"baz"}"', 'expr').should.eql('["foo ", 1, " bar ", "baz"].join("")');
    });
  });
});