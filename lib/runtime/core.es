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
  var slot = this["lookup:"]([slot_name]);
  if (typeof slot !== "undefined") {
    return (slot.type === "Method") ? slot.apply(this, args) : slot;
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

  this.init.call(obj);
  obj.init.call(obj);

  return obj;
});

Object.defineProperty(EObject, "init", {
  enumerable: false,
  value: function () {}
});

EObject["set:to:"] = method(function (name, expr) {
  this[name] = expr;
  if (name.match(/^[A-Z]/)) this[name].type = name;

  return expr;
});

EBoolean = Boolean.prototype;

nil.proto     = EObject;
nil.delegates = [];`