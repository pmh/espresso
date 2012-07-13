require("should");
require("ometa");
require("../lib/espresso");

var Translator = require('../lib/grammars/translator.ojs')
  , Parser     = require('../lib/grammars/parser.ojs')
  , join       = require('../lib/utils.js').join
  , join_nl    = require('../lib/utils.js').join_nl

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

  describe("Regular Expressions", function() {
    it("should translate simple regexps", function() {
      compile('/[a-z]{2}/').should.eql('/[a-z]{2}/');
    });

    it("should translate regexps with modifier flags", function() {
      compile('/[a-z]{2}/gi').should.eql('/[a-z]{2}/gi');
    });

    it("should translate regexps with escape sequences", function() {
      compile('/\\{/').should.eql('/\\{/');
    });
  });

  describe("Lambdas", function() {
    it("should translate empty lambdas", function() {
      compile('{}').should.eql(join_nl(
        'function () {',
        '  var self = this.clone();',
        '  return nil;',
        '}'
      ));
    });

    it("should translate lambdas with a single expression", function() {
      compile('{ "foo" }').should.eql(join_nl(
        'function () {',
        '  var self = this.clone();',
        '  return "foo";',
        '}'
      ));
    });

    it("should translate lambdas with multiple expressions", function() {
      compile('{ "foo"\n2 }').should.eql(join_nl(
        'function () {',
        '  var self = this.clone();',
        '  "foo";',
        '  return 2;',
        '}'
      ));
    });

    it("should translate lambdas with a single argument", function () {
      compile('{ foo | }').should.eql(join_nl(
        'function (foo) {',
        '  var self = this.clone();',
        '  self["foo"] = foo;',
        '  return nil;',
        '}'
      ));
    });

    it("should translate lambdas with multiple arguments", function () {
      compile('{ foo, bar, baz | }').should.eql(join_nl(
        'function (foo, bar, baz) {',
        '  var self = this.clone();',
        '  self["foo"] = foo; self["bar"] = bar; self["baz"] = baz;',
        '  return nil;',
        '}'
      ));
    });

    it("should translate lambdas with arguments and expressions", function () {
      compile('{ foo, bar, baz | "foo"\n2 }').should.eql(join_nl(
        'function (foo, bar, baz) {',
        '  var self = this.clone();',
        '  self["foo"] = foo; self["bar"] = bar; self["baz"] = baz;',
        '  "foo";',
        '  return 2;',
        '}'
      ));
    });
  });
});