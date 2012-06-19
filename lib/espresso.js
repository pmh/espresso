global.EObject = Object.prototype;

EObject.define_keyword = function (name, value) {
	if (Object.defineProperty) {
		Object.defineProperty(this, name, {
			value				 : value,
			writable		 : true,
			configurable : true,
			enumerable	 : false
		});
	} else {
		this[name] = value;
	}
	return this[name];
};

EObject.clone = function (init) {
	init = init || function () {};
	var obj   = Object.create(this);
	obj.define_keyword( "init"      , init );
	obj.define_keyword( "proto"     , this );

	this.init.call(obj);
	obj.init.call(obj);

	return obj;
};

EObject.define_keyword("init", function () {});

EObject.extend = function (obj) {
	for (var slot in obj) {
		if (obj.hasOwnProperty(slot) && this._keywords.indexOf(slot) === -1) 
			this[slot] = obj[slot];
	}
	obj.extended(this);
	return this;
};

EObject.extended = function (_) {};


require('ometajs');
var Parser = require('./grammars/parser.ometajs').Parser
	, utils  = require('./utils');

var Espresso = EObject.clone(function () {
	this.parse = function (input, /* optional: */ fname, /* optional: */ rule) {
		return Parser.parse(input, fname, rule);
	};
	
	this.compile = function (input, fname) {
		this.ast = Parser.parse(input, fname) || [];
	};

	this.compileFile = function (fname) {
		this.compile(require("fs").readFileSync(fname, 'utf8'), fname);
	};
});

module.exports = Espresso.clone();