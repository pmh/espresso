require('should');
var _ = require('../lib/nodes.js');

describe ("Number", function () {
  describe ("holding an integer", function () {
    var token;
    beforeEach(function () {
      token = _.Number("10");
    });
    
    it ("has a kind", function () {
      token.kind().should.eql("decimal");
    });
    
    it ("has a value", function () {
      token.value().should.eql(10);
    });
    
    it ("holds the original (unparsed) string value", function () {
      token.original().should.eql("10");
    });
  });
  
  describe ("holding a floating point number", function () {
    var token;
    beforeEach(function () {
      token = _.Number("10.23");
    });
    
    it ("has a kind", function () {
      token.kind().should.eql("decimal");
    });
    
    it ("has a value", function () {
      token.value().should.eql(10.23);
    });
    
    it ("holds the original (unparsed) string value", function () {
      token.original().should.eql("10.23");
    });
  });
  
  describe ("holding a hexadecimal number", function () {
    var token;
    beforeEach(function () {
      token = _.Number(0x23ab).kind("hex");
    });
    
    it ("has a kind", function () {
      token.kind().should.eql("hex");
    });
    
    it ("has a value", function () {
      token.value().should.eql(9131);
    });
    
    it ("holds the original (unparsed) string value", function () {
      token.original().should.eql(9131);
    });
  });
});

describe("String", function() {
  var token;
  beforeEach(function () {
    token = _.String("foo bar");
  });
  
  it ("has a value", function () {
    token.value().should.eql("foo bar");
  });
});