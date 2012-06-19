require("should");
require("ometajs");
require("../lib/espresso");
var Parser = require('../lib/grammars/parser.ometajs').Parser
	, _      = require('../lib/nodes');

describe("Dummy Test", function () {
	it ("works", function () {
		Parser.parse('foobar').should.eql(_.File([['foobar']]));
	});
});