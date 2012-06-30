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

describe("RegExp", function() {  
  it ("has a body", function () {
    var token = _.RegExp("[a-z]{2}")
    token.body().should.eql("[a-z]{2}");
  });
  
  it ("keeps track of modifier flags", function () {
    var token = _.RegExp("[a-z]{2}").flags("gi")
    token.body().should.eql("[a-z]{2}");
    token.flags().should.eql("gi");
  });
});

describe('Array', function () {
  it ('appends all values', function () {
    var token = _.Array([1, 2, 3]);
    token.slice(2).should.eql([1, 2, 3]);
  });
  
  it ("should not append if the first child is undefined", function () {
    var token1 = _.Array(undefined)
    var token2 = _.Array([undefined])
    
    token1.should.eql(_.Array());
    token2.should.eql(_.Array());
  })
});

describe('KeywordMsg', function () {
  it ("should set it's name to the concatenated value of all the keyword nodes", function () {
    var token = _.KeywordMsg([_.Keyword(_.Id("foo")), _.Id("bar"), _.Keyword(_.Id("baz")), _.Id("quux")]);
    token.name().should.eql('foo:baz:');
  });
  
  it ("should append all non keyword nodes", function () {
    var token = _.KeywordMsg([_.Keyword(_.Id("foo")), _.Id("bar"), _.Keyword(_.Id("baz")), _.Id("quux")]);
    token.slice(2).should.eql([_.Id("bar"), _.Id("quux")]);
  });
});