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

EObject.define_keyword("init",     function () {});
EObject.define_keyword("keywords", []);

EObject.extend = function (obj) {
	for (var slot in obj) {
		if (obj.hasOwnProperty(slot) && this.keywords.indexOf(slot) === -1) 
			this[slot] = obj[slot];
	}
	obj.extended(this);
	return this;
};

EObject.extended = function (_) {};

require('ometajs');
var Espresso = EObject.clone(function () {
	this.extend(require('./utils'));
	
	this.parser = require('./grammars/parser.ometajs').Parser.clone();
	
	this.parse = function (input, /* optional: */ fname, /* optional: */ rule) {
		return this.parser.parse(input, fname, rule);
	};
	
	this.compile = function (input, /* optional: */ fname, /* optional: */ rule) {
		this.ast = this.parse(input, fname, rule) || [];
	};

	this.compileFile = function (fname, /* optional: */ fname, /* optional: */ rule) {
		this.compile(require("fs").readFileSync(fname, 'utf8'), fname, rule);
	};
});

module.exports = Espresso.clone();