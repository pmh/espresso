require("./ometa/ometa");

var Espresso = Object.create({});

Espresso.parser     = Object.create(require('./grammars/parser.ojs'));
Espresso.translator = Object.create(require('./grammars/translator.ojs'));

Espresso.parse = function (input, /* optional[fname, rule] */ opts) {
  var opts = opts || {};
  this.ast = this.parser.parse(input, opts.fname, opts.rule);
  return this.ast;
};

Espresso.translate = function (ast) {
  return this.translator.translate(ast);;
}

Espresso.compile = function (input, /* optional[fname, rule, skip_runtime] */ opts) {
  var opts   = opts || {}
  //  , source = this.parse(input, opts.fname, opts.rule);
    , source = this.translate(this.parse(input, opts.fname, opts.rule));

  if (typeof opts.skip_runtime === "undefined") {
    source = require("fs").readFileSync(__dirname + "/runtime.js", 'utf8') + '\n\n' + source
  }

  return source
};

Espresso.compileFile = function (fname, /* optional[rule, skip_runtime] */ opts) {
  var opts = opts || {};
  opts.fname = fname;

  return this.compile(require('fs').readFileSync(fname, 'utf8'), opts);
};

module.exports = Espresso;