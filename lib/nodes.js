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
 * Require
 * -------
 * 
 * Representation:
 *     [#Require, { path: Filepath }]
 * 
 * Call like:
 *     Require().path(path);
 */
register("Require", { path: undefined });

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
 * Keyword
 * ---------
 * 
 * Representation:
 *     [#Keyword, { value: string }]
 * 
 * Call like:
 *     Keyword(Id("Foo"));
 */
register("Keyword", { value: undefined }, function(value) {
  this.value(value.value() + ':');
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
 *     [#Lambda, {name: string | undefined}, FunArgs, FunBody]
 * 
 * Call like:
 *     Lambda(args, body);
 */
register("Lambda", {name: undefined});

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
 * OptArg
 * ------------
 * 
 * Representation:
 *     [#OptArg, {opt_val: string}, Expression]
 * 
 * Call like:
 *     OptArg(arg, opt_val);
 */
register("OptArg", {});

/**
 * VarArg
 * ------------
 * 
 * Representation:
 *     [#VarArg, {}, Expression]
 * 
 * Call like:
 *     VarArg(arg);
 */
register("VarArg");

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

/**
 * BinaryMessage
 * ----------------
 * SampleCode:
 *     foo := 2
 *     bar = 3
 *     3 > 2
 *     4 + 3
 *
 * Representation:
 *     [#BinaryMsg, { operator: ( || | && | ^ | … ), assignment: false | true}, Expression, Expression]
 * 
 * Call like:
 *     BinaryMsg(lhsExpr, rhsExpr).operator('||');
 */
register("BinaryMsg", {
  operator: undefined
});

/**
 * AssignMessage
 * ----------------
 * SampleCode:
 *     bar = 3
 *
 * Representation:
 *     [#AssignMsg, { operator: string}, Expression, Expression]
 * 
 * Call like:
 *     AssignMsg(lhsExpr, rhsExpr).operator('||');
 */
register("AssignMsg", { operator: undefined });


/**
 * MethodDef
 * ----------------
 * SampleCode:
 *     foo := 2
 *     foo: bar := bar println
 *     foo + other := "Adding #{other} to foo!"
 *     foo := {
 *        bar
 *     }
 *
 * Representation:
 *     [#MethodDef, {}, Expression, Expression]
 * 
 * Call like:
 *     MethodDef(name, body);
 */
register("MethodDef", {}, function (lhs, rhs) {
  rhs[0] = "Method"
  if (lhs.hasType("KeywordDef")) {
    rhs = nodes.Lambda(nodes.FunArgs(lhs.slice(2)), rhs.slice(3)[0]);
    rhs[0] = "Method"
    rhs.name(lhs.name());
    this.append(nodes.Id(lhs.name())).append(rhs);
  } else {
    this.appendAll(arguments);
  }
});

/**
 * UnaryMessage
 * ----------------
 * SampleCode:
 *     foo bar
 *     foo 2
 *     foo "baz"
 *     foo (1 + 2)
 *
 * Representation:
 *     [#UnaryMsg, {}, Expression, Expression]
 * 
 * Call like:
 *     UnaryMsg(receiver, message);
 */
register("UnaryMsg", {}, function (receiver, message) {
  if (receiver.hasType("Id") && receiver.value() === "this" && message.hasType("UnaryMsg")) {
    if (message.slice(2)[0].hasType("Id") && message.slice(2)[0].value() === "self") {
      this.append(receiver).append(message[3]);
    } else {
      this.appendAll(arguments);
    }
  } else {
    this.appendAll(arguments);
  }
});


/**
 * KeywordArg
 * ----------------
 * SampleCode:
 *     foo: 12 + 34 baz: "bar", quux
 *          ^^^^^^^      ^^^^^^^^^^^
 *
 * Representation:
 *     [#KeywordArg, {}, ...Expr]
 * 
 * Call like:
 *     KeywordArg(...expr);
 */
register("KeywordArg", {}, function (arglist) { this.appendAll(arglist); });

/**
 * KeywordMessage
 * ----------------
 * SampleCode:
 *     foo: 12 + 34 baz: "bar"
 *
 * Representation:
 *     [#KeywordMsg, { name: string }, ...Expr]
 * 
 * Call like:
 *     KeywordMsg(...expr);
 */
register("KeywordMsg", { name: undefined }, function (exprs) {
  this.name(exprs.
              filter (function (node) { return node.hasType && node.hasType("Keyword"); }).
              map    (function (kw)   { return kw.value();                              }).join(''));

  this.appendAll(exprs.
                  filter (function (node) { return !node.hasType || !node.hasType("Keyword"); }).
                  map    (function (arg)  { return nodes.KeywordArg(arg);                     }));
});


/**
 * KeywordDef
 * ----------------
 * SampleCode:
 *     foo: 12 + 34 baz: "bar"
 *
 * Representation:
 *     [#KeywordDef, { name: string }, ...Expr]
 * 
 * Call like:
 *     KeywordDef(...expr);
 */
register("KeywordDef", { name: undefined }, function (exprs) {
  this.name(exprs.
              filter(function (node) { return node.hasType("Keyword"); }).
              map   (function (kw)   { return kw.value();              }).join(''));
  
  this.appendAll(exprs.filter(function (node) { return !node.hasType("Keyword"); }));
});

/**
 * RawJS
 * ----------------
 * SampleCode:
 *     `var foo = function () { alert(foo); }`
 *
 * Representation:
 *     [#RawJS, { value: string }, ...Expr]
 * 
 * Call like:
 *     RawJS().value(string);
 */
register("RawJS", { value: undefined });