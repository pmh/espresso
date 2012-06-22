require('should');
var _ = require('../lib/nodes.js');

describe("Id", function() {
  var token;
  beforeEach(function () {
    token = _.Id("foo");
  });
  
  it ("has a value", function () {
    token.value().should.eql("foo");
  });
  
  it ("has a value", function () {
    token.kind().should.eql("id");
  });
  
  it ("should set it's kind to const if the identifier starts with a capital letter", function () {
    _.Id("Foo").kind().should.eql("const");
  });
  
  it ("should not set it's kind to const if the identifier starts with a lowercase letter", function () {
    _.Id("fOO").kind().should.eql("id");
  });
});

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

describe("StringExpr", function() {
  describe("with simple string", function() {
    it ("has a value", function () {
      var token = _.StringExpr([_.String("foo bar")]);
      token.value().should.eql("foo bar");
    });
  });
  
  describe("with interpolated string", function() {
    it ("has a value", function () {
      var token = _.StringExpr([_.String("foo bar"), 1, _.String("!")]);
      token[2].should.eql(_.String("foo bar"));
      token[3].should.eql(1);
      token[4].should.eql(_.String("!"));
    });
  });
});