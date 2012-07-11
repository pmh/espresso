require("should");
require("ometa");
require("../lib/espresso");

var Translator = require('../lib/grammars/translator.ojs').Translator
    , _        = require('../lib/nodes')
    , Self     = function (expr) { return _.UnaryMsg(_.Id("self"), expr); };

describe("Translator", function () {
  var translator;
  beforeEach(function () {
    translator = Translator.clone();
  });
});