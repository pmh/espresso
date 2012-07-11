require("should");
require("ometa");
require("../lib/espresso");

var Translator = require('../lib/grammars/translator.ojs')
    , _        = require('../lib/nodes')
    , Self     = function (expr) { return _.UnaryMsg(_.Id("self"), expr); };

describe("Translator", function () {
  var translator;
  beforeEach(function () {
    translator = Translator.clone();
  });

  describe("Numbers", function () {
    it("should be able to translate integers", function() {
      translator.translate(_.Number("2")).should.eql("2");
    });

    it("should be able to translate negative integers", function() {
      translator.translate(_.Number("-2")).should.eql("-2");
    });

    it("should be able to translate floating points", function() {
      translator.translate(_.Number("2.345")).should.eql("2.345");
    });

    it("should be able to translate negative floating points", function() {
      translator.translate(_.Number("-2.345")).should.eql("-2.345");
    });

    it("should be able to translate underscore separated numbers", function() {
      translator.translate(_.Number("2_000_000")).should.eql("2000000");
    });
  });
});