require("ometa");

var Espresso = Object.create({});

Espresso.parser	    = Object.create(require('./grammars/parser.ojs'));
Espresso.translator = Object.create(require('./grammars/translator.ojs'));

Espresso.parse = function (input, /* optional[fname, rule] */ opts) {
  var opts = opts || {};
  
  return this.parser.parse(input, opts.fname, opts.rule);
};

Espresso.translate = function (ast) {
  return this.translator.translate(ast);
}

Espresso.compile = function (input, /* optional[fname, rule] */ opts) {
  var opts = opts || {};

  return this.translate(this.parse(input, opts.fname, opts.rule));
};

module.exports = Object.create(Espresso);