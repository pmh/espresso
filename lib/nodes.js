/**
 * The function `register` can be used like:
 *
 *     register("Function", {}, function(){...})
 *     .translate(function() {...})
 *
 * and desugars to:
 *     nodes["Function"] = NodeType("Function", {}, function() {...});
 */
var nodes = module.exports = {};
var Factory  = require('jsonml').factory;
var register = function(type) {

	var nodetype = Factory.apply(null, arguments);

	// register new nodetype
	nodes[type] = nodetype;
};

/**
 * NODE - DEFINITIONS
 */

/**
 * File
 * -------
 * 
 * Representation:
 *     [#File, { name: Filename },  ...Expression]
 * 
 * Call like:
 *     File(...srcEls);
 */
register("File", { name: undefined }, function(srcEls) {
	this.appendAll(srcEls);
});

/**
 * Identifier
 * ---------
 * 
 * Representation:
 *     [#Id, { kind: id | const, value: string }]
 * 
 * Call like:
 *     Id("Foo");
 */
register("Id", { kind: "id", value: undefined }, function(value) {
  this.value(value);
  if (value.match(/^[A-Z]/)) this.kind("const");
});

/**
 * Number
 * ------
 * 
 * Representation:
 *     [#Number, { kind: decimal | hex, value: number }]
 * 
 * Call like:
 *     Number('12435.50');
 */
register("Number", { kind: 'decimal', original: undefined, value: undefined }, function(value) {
  this.value(parseFloat(value.replace ? value.replace(/\_/g, '') : value));
  this.original(value);          // save original string-representation
});

/**
 * String
 * ------
 * 
 * Representation:
 *     [#String, { value: string }]
 * 
 * Call like:
 *     String("Foo Bar");
 */
register("String", { value: undefined }, function(value) {
  this.value(value);
});

/**
 * Token type for interpolated strings (eg, "foo #{bar}!")
 */
register('StringExpr', {}, function(parts) {

  // if it's a simple string, then immediately convert it, to clean the AST
  if(parts.length == 1 && parts[0][0] == 'String')
      return parts[0];

  this.appendAll(parts);
});

/**
 * Regular Expression
 * ----------------
 * SampleCode:
 *     /[a-z]{3}/gi
 *
 * Representation:
 *     [#RegExp, { body: string, flags: string }]
 * 
 * Call like:
 *     RegExp('[a-z]{3}').flags('gi');
 */
register("RegExp", { body: undefined, flags: '' }, function(body) {
  this.body(body);
});

/**
 * Lambda
 * --------
 * 
 * Representation:
 *     [#Lambda, {}, FunArgs, FunBody]
 * 
 * Call like:
 *     Lambda(args, body);
 */
register("Lambda");

/**
 * FunArgs
 * ------------
 * 
 * Representation:
 *     [#FunArgs, {}, ...Expression]
 * 
 * Call like:
 *     FunArgs(...args);
 */
register("FunArgs", {}, function(args) {
  this.appendAll(args);
});

/**
 * FunBody
 * --------------
 * 
 * Representation:
 *     [#FunBody, {}, ...Expression]
 * 
 * Call like:
 *     FunBody(...exprs);
 */
register("FunBody", {}, function(exprs) {
  this.appendAll(exprs);
});

/**
 * Map
 * --------------
 * 
 * Representation:
 *     [#Map, {}, ...KeyValuePair]
 * 
 * Call like:
 *     Map(...bindings);
 */
register("Map", {}, function(bindings) {
  this.appendAll(bindings);
});

/**
 * KeyValuePair
 * ---------------
 * SampleCode:
 *    foo: 4
 *    {}: "x"
 *    2:  "foo"
 *
 * Representation:
 *     [#KeyValuePair, {}, Expr, Expr]
 * 
 * Call like:
 *     KeyValuePair(key, value);
 */
register("KeyValuePair")

/**
 * Array
 * ---------------
 * SampleCode:
 *     [1, 3, 5, nil, "hello", foo]
 *
 * Representation:
 *     [#Array, {}, ...Expr]
 * 
 * Call like:
 *     Array(...expr);
 */
register("Array", {}, function(exprs) {

  // only append exprs if not undefined
  if(exprs === undefined || exprs[0] === undefined && exprs.length === 1)
    return this;
  
  // exprs should be an array containing nodes
  else
    this.appendAll(exprs);
});