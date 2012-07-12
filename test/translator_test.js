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

    it("should be able to translate identifiers", function() {
      compile('foo', "identifier").should.eql("foo");
    });
  });

  describe("Numbers", function () {
    it("should be able to translate integers", function() {
      compile("2").should.eql("2");
    });

    it("should be able to translate negative integers", function() {
      compile("-2").should.eql("-2");
    });

    it("should be able to translate floating points", function() {
      compile("2.345").should.eql("2.345");
    });

    it("should be able to translate negative floating points", function() {
      compile("-2.345").should.eql("-2.345");
    });

    it("should be able to translate underscore separated numbers", function() {
      compile("2_000_000").should.eql("2000000");
    });
  });

  describe("Strings", function() {
    it ("should be able to translate regular strings", function () {
      compile('"foo bar"').should.eql('"foo bar"');
    });
    
    it ("can translate escaped strings", function() {
      compile('"foo \\"bar\\""').should.eql('"foo \\"bar\\""');
    });

    it("can translate multi-line strings", function() {
      compile('"foo\nbar\nbaz"').should.eql('"foo\\nbar\\nbaz"')
    });
    
    it ("can translate interpolated strings", function () {
      compile('"foo #{1} bar #{"baz"}"', 'expr').should.eql('["foo ", 1, " bar ", "baz"].join("")');
    });
  });
});