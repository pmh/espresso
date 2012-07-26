`
var EObject   = Object.prototype,
    EFunction = Function.prototype,
    EString   = String.prototype,
    ENumber   = Number.prototype,
    $elf      = EObject;

EObject["send:"] = function (slot_name) {
  return this["send:args:"](slot_name, []);
};

EObject["send:args:"] = function (slot_name, args) {
  var slot = this[slot_name];
  if (slot) {
    return slot.type === "Function" ? slot.apply(this, args) : slot;
  }
};

EObject["clone"] = function (ctx) {
  var clone = this["clone:"](function () {});
  if (ctx) clone.context = ctx;
  return clone;
};

EObject["clone:"] = function (init) {
  var obj     = Object.create(this);
  obj.init    = init;
  obj.proto   = this;
  obj.context = obj;
  
  this.init.call(obj);
  obj.init.call(obj);
  
  return obj;
};

EObject.init = function () {};

EObject[":="] = function (name, expr) {
  this[name] = expr;
  if (name.match(/^[A-Z]/)) this[name].type = name;
};

EObject.println = function () {
  console.log(this["valueOf"]());
  return this;
};

EObject.type = "Object";

EString.println = function () {
  console.log('"' + this.toString() + '"');
  return this;
};

EString.type = "String";

EFunction.println = function () {
  console.log(this.toString());
  return this;
};

EFunction.type = "Function";

ENumber["-"] = function (x) { return this - x; };
ENumber["*"] = function (x) { return this * x; };
ENumber.type = "Number";

$elf[ "Object"  ] = EObject;
$elf[ "nil"     ] = EObject.clone()
$elf[ "context" ] = EObject`