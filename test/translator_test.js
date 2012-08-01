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
    translator = Object.create(Translator);
    parser     = Object.create(Parser);
    compile    = function (input, rule) { return translator.translate(parser.parseFrom(input, rule || 'topLevel')); };
  });

  describe("Require", function () {

    it("should compile espresso files", function() {
      compile('require: "test/fixtures/foo.es" ; 12').should.eql(join_nl(
        '$elf["send:"]("foo")["send:args:"]("bar:", [["baz"]]);',
        '12'
      ));
    });

    it("should assume it's and espresso file", function () {
      compile('require: "test/fixtures/foo" ; 12').should.eql(join_nl(
        '$elf["send:"]("foo")["send:args:"]("bar:", [["baz"]]);',
        '12'
      ));
    });

    it("should 'compile' javascript files", function () {
      compile('require: "test/fixtures/foo.js" ; 12').should.eql(join_nl(
        'console.log("foo");',
        '12'
      ));
    });
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

  describe("Arrays", function() {
    
    it("should translate empty arrays", function() {
      compile('[]').should.eql('[]');
    });

    it("should translate populated arrays", function() {
      compile('[1, foo bar]').should.eql('[1, $elf["send:"]("foo")["send:"]("bar")]');
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

  describe("RawJS", function() {
    it("should translate raw javascript", function () {
      compile('`var foo = function () {};`').should.eql("var foo = function () {};");
    });
  });

  describe("Lambdas", function() {
    it("should translate empty lambdas", function() {
      compile('{}').should.eql(join_nl(
        '(function () {',
        '  var self = this.context, $elf = self.clone(self.context);',
        '  return nil;',
        '})'
      ));
    });

    it("should translate lambdas with a single expression", function() {
      compile('{ "foo" }').should.eql(join_nl(
        '(function () {',
        '  var self = this.context, $elf = self.clone(self.context);',
        '  return "foo";',
        '})'
      ));
    });

    it("should translate lambdas with multiple expressions", function() {
      compile('{ "foo"\n2 }').should.eql(join_nl(
        '(function () {',
        '  var self = this.context, $elf = self.clone(self.context);',
        '  "foo";',
        '  return 2;',
        '})'
      ));
    });

    it("should translate lambdas with a single argument", function () {
      compile('{ foo | }').should.eql(join_nl(
        '(function (foo) {',
        '  var self = this.context, $elf = self.clone(self.context);',
        '  $elf["foo"] = (foo && foo.length) ? foo[0] : foo || nil;',
        '  return nil;',
        '})'
      ));
    });

    it("should translate lambdas with multiple arguments", function () {
      compile('{ foo, bar, baz | }').should.eql(join_nl(
        '(function (foo, bar, baz) {',
        '  var self = this.context, $elf = self.clone(self.context);',
        '  $elf["foo"] = (foo && foo.length) ? foo[0] : foo || nil; ' +
          '$elf["bar"] = (bar && bar.length) ? bar[0] : bar || nil; ' +
          '$elf["baz"] = (baz && baz.length) ? baz[0] : baz || nil;',
        '  return nil;',
        '})'
      ));
    });

    it("should translate lambdas with arguments and expressions", function () {
      compile('{ foo, bar, baz | "foo"\n2 }').should.eql(join_nl(
        '(function (foo, bar, baz) {',
        '  var self = this.context, $elf = self.clone(self.context);',
        '  $elf["foo"] = (foo && foo.length) ? foo[0] : foo || nil; ' +
          '$elf["bar"] = (bar && bar.length) ? bar[0] : bar || nil; ' +
          '$elf["baz"] = (baz && baz.length) ? baz[0] : baz || nil;',
        '  "foo";',
        '  return 2;',
        '})'
      ));
    });
  });
  
  describe("Unary Messages", function () {

    it("should translate a single unary message send", function() {
      compile('foo').should.eql('$elf["send:"]("foo")');
    });

    it("should translate chained unary messages", function() {
      compile('foo bar baz').should.eql('$elf["send:"]("foo")["send:"]("bar")["send:"]("baz")');
    });

    it("should translate self sends", function() {
      compile('self foo').should.eql('self["send:"]("foo")');
    });
  });

  describe("Keyword Messages", function () {

    it("should translate keyword messages", function() {
      compile('foo: bar').should.eql('$elf["send:args:"]("foo:", [[$elf["send:"]("bar")]])');
    });

    it("should translate keyword messages with multiple keys and args", function() {
      compile('foo: bar baz: quux').should.eql('$elf["send:args:"]("foo:baz:", [[$elf["send:"]("bar")], [$elf["send:"]("quux")]])');
    });

    it("should translate keyword messages with unary args", function() {
      compile('foo: bar baz quux: qoo').should.eql('$elf["send:args:"]("foo:quux:", [[$elf["send:"]("bar")["send:"]("baz")], [$elf["send:"]("qoo")]])');
    });

    it("should translate keyword messages preceded by a unary message", function() {
      compile('foo bar: baz').should.eql('$elf["send:"]("foo")["send:args:"]("bar:", [[$elf["send:"]("baz")]])');
    });
  });

  describe("Binary Messages", function () {

    it("should translate binary messages", function() {
      compile('foo + bar').should.eql('$elf["send:"]("foo")["send:args:"]("+", [$elf["send:"]("bar")])');
    });

    it("should translate chained binary messages", function() {
      compile('foo + bar + baz').should.eql('$elf["send:"]("foo")["send:args:"]("+", [$elf["send:"]("bar")["send:args:"]("+", [$elf["send:"]("baz")])])');
    });

    it("should translate binary messages with a unary operand", function() {
      compile('foo + bar baz').should.eql('$elf["send:"]("foo")["send:args:"]("+", [$elf["send:"]("bar")["send:"]("baz")])');
    });

    it("should translate binary messages preceded by a unary message", function() {
      compile('foo bar + baz').should.eql('$elf["send:"]("foo")["send:"]("bar")["send:args:"]("+", [$elf["send:"]("baz")])');
    });
  });

  describe("Assignment", function () {

    it("should translate unary assignment", function () {
      compile('foo = bar').should.eql('$elf["send:args:"]("set:to:", ["foo", $elf["send:"]("bar")])')
      compile('foo bar = baz').should.eql('$elf["send:"]("foo")["send:args:"]("set:to:", ["bar", $elf["send:"]("baz")])')
    });

    it("should translate keyword assignment", function () {
      compile('foo: bar := {}').should.eql(join_nl(
        '$elf["send:args:"]("set:to:", ["foo:", (function(body) { body.type = "Method"; return body; })((function (bar) {',
        '  var self = this.context, $elf = self.clone(self.context);',
        '  $elf["bar"] = (bar && bar.length) ? bar[0] : bar || nil;',
        '  return nil;',
        '}))])'
      ));

      compile('foo: bar baz: quux := {}').should.eql(join_nl(
        '$elf["send:args:"]("set:to:", ["foo:baz:", (function(body) { body.type = "Method"; return body; })((function (bar, quux) {',
        '  var self = this.context, $elf = self.clone(self.context);',
        '  $elf["bar"] = (bar && bar.length) ? bar[0] : bar || nil; $elf["quux"] = (quux && quux.length) ? quux[0] : quux || nil;',
        '  return nil;',
        '}))])'
      ));

      compile('foo bar: baz := {}').should.eql(join_nl(
        '$elf["send:"]("foo")["send:args:"]("set:to:", ["bar:", (function(body) { body.type = "Method"; return body; })((function (baz) {',
        '  var self = this.context, $elf = self.clone(self.context);',
        '  $elf["baz"] = (baz && baz.length) ? baz[0] : baz || nil;',
        '  return nil;',
        '}))])'
      ));
    });

    it("should translate binary assignment", function () {
      compile('+ x := {}').should.eql(join_nl(
        '$elf["send:args:"]("set:to:", ["+", (function(body) { body.type = "Method"; return body; })((function (x) {',
        '  var self = this.context, $elf = self.clone(self.context);',
        '  $elf["x"] = (x && x.length) ? x[0] : x || nil;',
        '  return nil;',
        '}))])'
      ));

      compile('foo + x := {}').should.eql(join_nl(
        '$elf["send:"]("foo")["send:args:"]("set:to:", ["+", (function(body) { body.type = "Method"; return body; })((function (x) {',
        '  var self = this.context, $elf = self.clone(self.context);',
        '  $elf["x"] = (x && x.length) ? x[0] : x || nil;',
        '  return nil;',
        '}))])'
      ));

      compile('foo bar + x := {}').should.eql(join_nl(
        '$elf["send:"]("foo")["send:"]("bar")["send:args:"]("set:to:", ["+", (function(body) { body.type = "Method"; return body; })((function (x) {',
        '  var self = this.context, $elf = self.clone(self.context);',
        '  $elf["x"] = (x && x.length) ? x[0] : x || nil;',
        '  return nil;',
        '}))])'
      ));
    });
  });
});