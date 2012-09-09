`
var EObject   = Object.prototype,
    EFunction = Function.prototype,
    EString   = String.prototype,
    ENumber   = Number.prototype,
    EArray    = Array.prototype,
    ERegex    = RegExp.prototype,
    nil       = Object.create(EObject),
    self      = EObject;

var method = function (body) {
  body.type = "Method";
  return body;
};

EObject["lookup:"] = method(function (slot_name) {
  slot_name = slot_name[0]
  var slot = this[slot_name]
  if (typeof slot === "undefined") {
    for (var i = this.delegates.length - 1; i >= 0; i--){
      if (this.delegates[i].hasOwnProperty(slot_name)) slot = this.delegates[i][slot_name];
      if (slot) break;
    };
  }
  return typeof slot === "undefined" ? ((this.proto && !this.proto["nil?"]) ? this.proto["lookup:"]([slot_name]) : undefined) : slot;
});

nil["unknown-slot:args:"] = method(function () { return nil; });


EObject["send:"] = method(function (slot_name) {
  return this["send:args:"](slot_name, []);
});

EObject["send:args:"] = method(function (slot_name, args) {
  var slot;
  if (this.type === "Number") {
    slot = (Number._cache[this.toString()] || (Number._cache[this.toString()] = new Number(this.toString())))["lookup:"]([slot_name]);
  } else {
    slot = this["lookup:"]([slot_name]);
  }
  if (typeof slot !== "undefined") {
    if (slot.type == "Method")
      return slot.apply(this, args);

    return slot;
  } else {
    return this["send:args:"]("unknown-slot:args:", [[slot_name], args])
  }
});

EObject["clone"] = method(function () {
  return this["clone:"]([function () {}]);
});

EObject["clone:"] = method(function (init) {
  var obj       = Object.create(this);
  obj.proto     = this;
  obj.delegates = [];

  Object.defineProperty(obj, "init", {
    enumerable: false,
    value: init[0]
  });

  Object.defineProperty(obj, "method-table", {
    enumerable: false,
    value: {}
  });
  
  this.init.call(obj, obj);
  obj.init.call(obj, obj);

  return obj;
});

ENumber["clone"] = ENumber["clone:"] = method(function () {
  return this;
});

Object.defineProperty(EObject, "init", {
  enumerable: false,
  value: function () {}
});

Object.defineProperty(EObject, "method-table", {
  enumerable: false,
  value: {}
});

EObject["set:to:"] = method(function (name, expr) {
  name = name[0];
  expr = expr[0];
  this[name] = expr;
  if (name.match && name.match(/^[A-Z]/)) this[name].type = name;

  return expr;
});

EObject["define-method:do:"] = method(function (name, body) {
  return this["define-method:predicates:do:"](name, [[]], body);
});

EObject["define-method:predicates:do:"] = method(function (name, predicates, body) {
  name       = name[0];
  body       = body[0];
  predicates = predicates[0];

  var old = this[ name ];

  this[ name ] = method(function(){
    var args = arguments, self = this;
    if ( args.length === body.length &&
         predicates.every(function (c, idx) { return typeof c === "function" ? c.call(self, (typeof args[idx][0] === "undefined") ? args[idx] : args[idx][0]) : (c === true ? true : false); }) )
        return body.apply( this, arguments );
    else if ( typeof old == 'function' )
      return old.apply( this, arguments );
  });

  this[name].toString = function () { return body.toString(); };

  return this[name];
});
EBoolean = Boolean.prototype;

Number._cache = {};

nil.proto     = EObject;
nil.delegates = [];`