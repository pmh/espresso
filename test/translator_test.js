require("should");
require("ometa");
require("../lib/espresso");

var Translator   = require('../lib/grammars/translator.ojs')
  , Parser       = require('../lib/grammars/parser.ojs')
  , join         = require('../lib/utils.js').join
  , join_nl      = require('../lib/utils.js').join_nl;

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
        '$elf["send:"]("foo")["send:args:"]("bar:", [["baz"]]);;',
        '',
        '(Number._cache["12"] || (Number._cache["12"] = new Number("12")));'
      ));
    });

    it("should assume it's and espresso file", function () {
      compile('require: "test/fixtures/foo" ; 12').should.eql(join_nl(
        '$elf["send:"]("foo")["send:args:"]("bar:", [["baz"]]);;',
        '',
        '(Number._cache["12"] || (Number._cache["12"] = new Number("12")));'
      ));
    });

    it("should 'compile' javascript files", function () {
      compile('require: "test/fixtures/foo.js" ; 12').should.eql(join_nl(
        'console.log("foo");',
        '',
        '(Number._cache["12"] || (Number._cache["12"] = new Number("12")));'
      ));
    });
  });

  describe("Identifiers", function () {

    it("should translate identifiers", function() {
      compile('foo', "identifier").should.eql("foo");
    });

    it("should translate identifiers with special chars", function() {
      compile('$foo-bar', "identifier").should.eql("$foo-bar");
    });

    it("should prefix call with an underscore to avoid conflicts", function () {
      compile('call', "identifier").should.eql("_call");
    });
  });

  describe("Numbers", function () {
    it("should translate integers", function() {
      compile("2").should.eql('(Number._cache["2"] || (Number._cache["2"] = new Number("2")));');
    });

    it("should translate negative integers", function() {
      compile("-2").should.eql('(Number._cache["-2"] || (Number._cache["-2"] = new Number("-2")));');
    });

    it("should translate floating points", function() {
      compile("2.345").should.eql('(Number._cache["2.345"] || (Number._cache["2.345"] = new Number("2.345")));');
    });

    it("should translate negative floating points", function() {
      compile("-2.345").should.eql('(Number._cache["-2.345"] || (Number._cache["-2.345"] = new Number("-2.345")));');
    });

    it("should translate underscore separated numbers", function() {
      compile("2_000_000").should.eql('(Number._cache["2000000"] || (Number._cache["2000000"] = new Number("2000000")));');
    });
  });

  describe("Strings", function() {
    it ("should translate regular strings", function () {
      compile('"foo bar"').should.eql('"foo bar";');
    });
    
    it ("should translate escaped strings", function() {
      compile('"foo \\"bar\\""').should.eql('"foo \\"bar\\"";');
    });

    it("should translate multi-line strings", function() {
      compile('"foo\nbar\nbaz"').should.eql('"foo\\nbar\\nbaz";')
    });
    
    it ("should translate interpolated strings", function () {
      compile('"foo #{1} bar #{"baz"}"', 'expr').should.eql('["foo ", (Number._cache["1"] || (Number._cache["1"] = new Number("1"))), " bar ", "baz"].join("")');
    });
  });

  describe("Arrays", function() {
    
    it("should translate empty arrays", function() {
      compile('[]').should.eql('[];');
    });

    it("should translate populated arrays", function() {
      compile('[1, foo bar]').should.eql('[(Number._cache["1"] || (Number._cache["1"] = new Number("1"))), $elf["send:"]("foo")["send:"]("bar")];');
    });
  });

  describe("Regular Expressions", function() {
    it("should translate simple regexps", function() {
      compile('/[a-z]{2}/').should.eql('/[a-z]{2}/;');
    });

    it("should translate regexps with modifier flags", function() {
      compile('/[a-z]{2}/gi').should.eql('/[a-z]{2}/gi;');
    });

    it("should translate regexps with escape sequences", function() {
      compile('/\\{/').should.eql('/\\{/;');
    });
  });

  describe("Return", function () {
    it ("should translate regular return statements", function () {
      compile("return foo").should.eql('$elf["send:"]("foo");');
    });

    it ("should translate non local return statements", function () {
      compile("return! foo").should.eql('{ret: $elf["send:"]("foo")};');
    });
  });

  describe("RawJS", function() {
    it("should translate raw javascript", function () {
      compile('`var foo = function () {}`').should.eql("var foo = function () {};");
    });
  });

  describe("JS Interop", function () {

    it("should translate variable references", function () {
      compile('.foo').should.eql("foo;");
    });

    it("should translate variable chaining", function () {
      compile('.foo.bar').should.eql("foo.bar;");
    });

    it("should translate function invocations", function () {
      compile('.foo()').should.eql("foo();");
    });

    it("should translate function invocations with arguments", function () {
      compile('.foo(.x, y, .z)').should.eql('foo(x, $elf["send:"]("y"), z);');
    });

    it("should translate function chains", function () {
      compile('.foo().bar()').should.eql("foo().bar();");
    });

    it("should translate variable and function chains", function () {
      compile('.foo.bar()').should.eql("foo.bar();");
    });

    it("should translate computed access", function () {
      compile('.foo["bar"]').should.eql('foo["bar"];');
    });

    it("should translate chained computed access", function () {
      compile('.foo["bar"]["baz"]').should.eql('foo["bar"]["baz"];');
    });

    it("should translate chained computed access, variables and function invocations", function () {
      compile('.foo["bar"].baz()').should.eql('foo["bar"].baz();');
    });
  });

  describe("Lambdas", function() {
    it("should translate empty lambdas", function() {
      compile('{}').should.eql(join_nl(
        '(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {',
        '  var $elf = this.clone();',
        '  return nil;',
        '});'
      ));
    });

    it("should translate lambdas with a single expression", function() {
      compile('{ "foo" }').should.eql(join_nl(
        '(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {',
        '  var $elf = this.clone();',
        '  return "foo";',
        '});'
      ));
    });

    it("should translate lambdas with multiple expressions", function() {
      compile('{ "foo"\n2 }').should.eql(join_nl(
        '(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {',
        '  var $elf = this.clone();',
        '  ___ret___ = "foo";',
        '  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };',
        '  return (Number._cache["2"] || (Number._cache["2"] = new Number("2")));',
        '});'
      ));
    });

    it("should translate lambdas with a single argument", function () {
      compile('{ foo | }').should.eql(join_nl(
        '(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (foo) {',
        '  var $elf = this.clone();',
        '  $elf["foo"] = (foo && foo.type === "Array") ? foo[0] : ((typeof foo !== "undefined") ? foo : nil);',
        '  return nil;',
        '});'
      ));
    });

    it("should translate lambdas with arguments containing special characters", function () {
      compile('{ foo-bar?! | }').should.eql(join_nl(
        '(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (foo45bar6333) {',
        '  var $elf = this.clone();',
        '  $elf["foo-bar?!"] = (foo45bar6333 && foo45bar6333.type === "Array") ? foo45bar6333[0] : ((typeof foo45bar6333 !== "undefined") ? foo45bar6333 : nil);',
        '  return nil;',
        '});'
      ));
    });

    it("should translate lambdas with multiple arguments", function () {
      compile('{ foo, bar, baz | }').should.eql(join_nl(
        '(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (foo, bar, baz) {',
        '  var $elf = this.clone();',
        '  $elf["foo"] = (foo && foo.type === "Array") ? foo[0] : ((typeof foo !== "undefined") ? foo : nil); ' +
          '$elf["bar"] = (bar && bar.type === "Array") ? bar[0] : ((typeof bar !== "undefined") ? bar : nil); ' +
          '$elf["baz"] = (baz && baz.type === "Array") ? baz[0] : ((typeof baz !== "undefined") ? baz : nil);',
        '  return nil;',
        '});'
      ));
    });

    it("should translate lambdas with arguments and expressions", function () {
      compile('{ foo, bar, baz | "foo"\n2 }').should.eql(join_nl(
        '(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (foo, bar, baz) {',
        '  var $elf = this.clone();',
        '  $elf["foo"] = (foo && foo.type === "Array") ? foo[0] : ((typeof foo !== "undefined") ? foo : nil); ' +
          '$elf["bar"] = (bar && bar.type === "Array") ? bar[0] : ((typeof bar !== "undefined") ? bar : nil); ' +
          '$elf["baz"] = (baz && baz.type === "Array") ? baz[0] : ((typeof baz !== "undefined") ? baz : nil);',
        '  ___ret___ = "foo";',
        '  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };',
        '  return (Number._cache["2"] || (Number._cache["2"] = new Number("2")));',
        '});'
      ));
    });

    it("should translate partial lambdas", function () {
      compile('@{* 2}').should.eql(join_nl(
        '(function () {',
        '  var self = this, $elf = arguments[0];',
        '  return $elf["send:args:"]("*", [(Number._cache["2"] || (Number._cache["2"] = new Number("2")))]);', '});'
      ));
    });
  });
  
  describe("Maps", function () {

    it("should translate empty maps", function() {
      compile('#{}').should.eql('({});');
    });

    it("should translate with a single key/value pair", function() {
      compile('#{ foo: "bar" }').should.eql('({"foo": "bar"});');
    });

    it("should translate with multiple key/value pairs", function() {
      compile('#{ foo: "bar", baz: 23 }').should.eql('({"foo": "bar", "baz": (Number._cache["23"] || (Number._cache["23"] = new Number("23")))});');
    });
  });

  describe("Unary Messages", function () {

    it("should translate a single unary message send", function() {
      compile('foo').should.eql('$elf["send:"]("foo");');
    });

    it("should translate chained unary messages", function() {
      compile('foo bar baz').should.eql('$elf["send:"]("foo")["send:"]("bar")["send:"]("baz");');
    });

    it("should translate chained unary containing strings", function () {
      compile('foo "bar" baz').should.eql('$elf["send:"]("foo")["send:"]("bar")["send:"]("baz");');
    });

    it("should translate chained unary containing symbols", function () {
      compile("foo 'bar baz").should.eql('$elf["send:"]("foo")["send:"]("bar")["send:"]("baz");');
    });

    it("should translate chained unary containing numbers", function () {
      compile('foo 23 baz').should.eql('$elf["send:"]("foo")["send:"]((Number._cache["23"] || (Number._cache["23"] = new Number("23"))))["send:"]("baz");');
    });

    it("should translate chained unary containing lambdas", function () {
      compile('foo { "bar" } baz').should.eql(join_nl('$elf["send:"]("foo")["send:"]((function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {',
      '  var $elf = this.clone();',
      '  return "bar";',
      '}))["send:"]("baz");'));
    });

    it("should translate chained unary containing arrays", function () {
      compile("foo ['a, 'b, 'c] baz").should.eql('$elf["send:"]("foo")["send:"](["a", "b", "c"])["send:"]("baz");');
    });

    it("should translate chained unary containing maps", function () {
      compile("foo #{ foo: 'bar } baz").should.eql('$elf["send:"]("foo")["send:"](({"foo": "bar"}))["send:"]("baz");');
    });

    it("should translate chained unary containing regexps", function () {
      compile('foo /[a-z]+/ baz').should.eql('$elf["send:"]("foo")["send:"](/[a-z]+/)["send:"]("baz");');
    });

    it("should translate self sends", function() {
      compile('self foo').should.eql('self["send:"]("foo");');
    });
  });

  describe("Keyword Messages", function () {

    it("should translate keyword messages", function() {
      compile('foo: bar').should.eql('$elf["send:args:"]("foo:", [[$elf["send:"]("bar")]]);');
    });

    it("should translate keyword messages with multiple keys and args", function() {
      compile('foo: bar baz: quux').should.eql('$elf["send:args:"]("foo:baz:", [[$elf["send:"]("bar")], [$elf["send:"]("quux")]]);');
    });

    it("should translate keyword messages with unary args", function() {
      compile('foo: bar baz quux: qoo').should.eql('$elf["send:args:"]("foo:quux:", [[$elf["send:"]("bar")["send:"]("baz")], [$elf["send:"]("qoo")]]);');
    });

    it("should translate keyword messages preceded by a unary message", function() {
      compile('foo bar: baz').should.eql('$elf["send:"]("foo")["send:args:"]("bar:", [[$elf["send:"]("baz")]]);');
    });
  });

  describe("Binary Messages", function () {

    it("should translate binary messages", function() {
      compile('foo + bar').should.eql('$elf["send:"]("foo")["send:args:"]("+", [$elf["send:"]("bar")]);');
    });

    it("should translate chained binary messages", function() {
      compile('foo + bar + baz').should.eql('$elf["send:"]("foo")["send:args:"]("+", [$elf["send:"]("bar")["send:args:"]("+", [$elf["send:"]("baz")])]);');
    });

    it("should translate binary messages with a unary operand", function() {
      compile('foo + bar baz').should.eql('$elf["send:"]("foo")["send:args:"]("+", [$elf["send:"]("bar")["send:"]("baz")]);');
    });

    it("should translate binary messages preceded by a unary message", function() {
      compile('foo bar + baz').should.eql('$elf["send:"]("foo")["send:"]("bar")["send:args:"]("+", [$elf["send:"]("baz")]);');
    });
  });

  describe("Assignment", function () {

    it("should translate unary assignment", function () {
      compile('foo = bar').should.eql('$elf["send:args:"]("set:to:", [["foo"], [$elf["send:"]("bar")]]);')
      compile('foo bar = baz').should.eql('$elf["send:"]("foo")["send:args:"]("set:to:", [["bar"], [$elf["send:"]("baz")]]);')
    });

    it("should translate keyword methods", function () {
      compile('foo: bar := {}').should.eql(join_nl(
        '$elf["send:args:"]("define-method:predicates:do:", [["foo:"], [[true]], [(function (bar) {',
        '  var ___ret___ = undefined, self = (this.type === "Number" ? (Number._cache[this] || (Number._cache[this] = new Number(this))) : this), $elf = self.clone();',
        '  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("foo:", [bar]); });',
        '  $elf["bar"] = (bar && bar.type === "Array") ? bar[0] : ((typeof bar !== "undefined") ? bar : nil);',
        '  return nil;',
        '})]]);'
      ));

      compile('clone: bar := {}').should.eql(join_nl(
        '$elf["send:args:"]("define-method:predicates:do:", [["clone:"], [[true]], [(function (bar) {',
        '  var ___ret___ = undefined, self = (this.type === "Number" ? (Number._cache[this] || (Number._cache[this] = new Number(this))) : this), $elf = Object.create(self); $elf.proto = self; $elf.delegates = [];',
        '  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("clone:", [bar]); });',
        '  $elf["bar"] = (bar && bar.type === "Array") ? bar[0] : ((typeof bar !== "undefined") ? bar : nil);',
        '  return nil;',
        '})]]);'
      ));

      compile('foo: bar baz: quux := {}').should.eql(join_nl(
        '$elf["send:args:"]("define-method:predicates:do:", [["foo:baz:"], [[true,true]], [(function (bar, quux) {',
        '  var ___ret___ = undefined, self = (this.type === "Number" ? (Number._cache[this] || (Number._cache[this] = new Number(this))) : this), $elf = self.clone();',
        '  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("foo:baz:", [bar, quux]); });',
        '  $elf["bar"] = (bar && bar.type === "Array") ? bar[0] : ((typeof bar !== "undefined") ? bar : nil); ' +
          '$elf["quux"] = (quux && quux.type === "Array") ? quux[0] : ((typeof quux !== "undefined") ? quux : nil);',
        '  return nil;',
        '})]]);'
      ));

      compile('foo bar: baz := {}').should.eql(join_nl(
        '$elf["send:"]("foo")["send:args:"]("define-method:predicates:do:", [["bar:"], [[true]], [(function (baz) {',
        '  var ___ret___ = undefined, self = (this.type === "Number" ? (Number._cache[this] || (Number._cache[this] = new Number(this))) : this), $elf = self.clone();',
        '  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("bar:", [baz]); });',
        '  $elf["baz"] = (baz && baz.type === "Array") ? baz[0] : ((typeof baz !== "undefined") ? baz : nil);',
        '  return nil;',
        '})]]);'
      ));
    });

    it("should translate predicated keyword methods", function () {
      var predicate = join_nl(
        '(function () {',
        '  var self = this, $elf = arguments[0];',
        '  return $elf["send:args:"]("understands?:", [["foobaz"]]);',
        '})');

      compile("foo: bar @{understands?: 'foobaz} baz: quux := {}").should.eql(join_nl(
        '$elf["send:args:"]("define-method:predicates:do:", [["foo:baz:"], [[' + predicate + ',true]], [(function (bar, quux) {',
        '  var ___ret___ = undefined, self = (this.type === "Number" ? (Number._cache[this] || (Number._cache[this] = new Number(this))) : this), $elf = self.clone();',
        '  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("foo:baz:", [bar, quux]); });',
        '  $elf["bar"] = (bar && bar.type === "Array") ? bar[0] : ((typeof bar !== "undefined") ? bar : nil); ' +
          '$elf["quux"] = (quux && quux.type === "Array") ? quux[0] : ((typeof quux !== "undefined") ? quux : nil);',
        '  return nil;',
        '})]]);'
      ));
    });

    it("should translate binary methods", function () {
      compile('+ x := {}').should.eql(join_nl(
        '$elf["send:args:"]("define-method:predicates:do:", [["+"], [[]], [(function (x) {',
        '  var ___ret___ = undefined, self = (this.type === "Number" ? (Number._cache[this] || (Number._cache[this] = new Number(this))) : this), $elf = self.clone();',
        '  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("+", [x]); });',
        '  $elf["x"] = (x && x.type === "Array") ? x[0] : ((typeof x !== "undefined") ? x : nil);',
        '  return nil;',
        '})]]);'
      ));

      compile('foo + x := {}').should.eql(join_nl(
        '$elf["send:"]("foo")["send:args:"]("define-method:predicates:do:", [["+"], [[]], [(function (x) {',
        '  var ___ret___ = undefined, self = (this.type === "Number" ? (Number._cache[this] || (Number._cache[this] = new Number(this))) : this), $elf = self.clone();',
        '  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("+", [x]); });',
        '  $elf["x"] = (x && x.type === "Array") ? x[0] : ((typeof x !== "undefined") ? x : nil);',
        '  return nil;',
        '})]]);'
      ));

      compile('foo bar + x := {}').should.eql(join_nl(
        '$elf["send:"]("foo")["send:"]("bar")["send:args:"]("define-method:predicates:do:", [["+"], [[]], [(function (x) {',
        '  var ___ret___ = undefined, self = (this.type === "Number" ? (Number._cache[this] || (Number._cache[this] = new Number(this))) : this), $elf = self.clone();',
        '  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("+", [x]); });',
        '  $elf["x"] = (x && x.type === "Array") ? x[0] : ((typeof x !== "undefined") ? x : nil);',
        '  return nil;',
        '})]]);'
      ));
    });

    it("should translate predicated binary methods", function () {
      var predicate = join_nl(
        '(function () {',
        '  var self = this, $elf = arguments[0];',
        '  return $elf["send:"]("type")["send:args:"]("==", ["X"]);',
        '})'
      );

      compile('foo + x @{type == "X"} := {}').should.eql(join_nl(
        '$elf["send:"]("foo")["send:args:"]("define-method:predicates:do:", [["+"], [[' + predicate + ']], [(function (x) {',
        '  var ___ret___ = undefined, self = (this.type === "Number" ? (Number._cache[this] || (Number._cache[this] = new Number(this))) : this), $elf = self.clone();',
        '  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("+", [x]); });',
        '  $elf["x"] = (x && x.type === "Array") ? x[0] : ((typeof x !== "undefined") ? x : nil);',
        '  return nil;',
        '})]]);'
      ));
    })
  });
});