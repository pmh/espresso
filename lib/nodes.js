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
 *     [#File, { name: Filename },  ...Statement]
 * 
 * Call like:
 *     File(...srcEls);
 */
register("File", { name: undefined }, function(srcEls) {
	this.appendAll(srcEls);
});