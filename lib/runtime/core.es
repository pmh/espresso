`
var EObject   = Object.prototype,
    EFunction = Function.prototype,
    EString   = String.prototype,
    ENumber   = Number.prototype,
    $elf      = EObject;

var method = function (body) {
  body.type = "Method";
  return body;
};

EObject["send:"] = method(function (slot_name) {
  return this["send:args:"](slot_name, []);
});

EObject["send:args:"] = method(function (slot_name, args) {
  var slot = this[slot_name];
  if (slot) {
    return (slot.type === "Method") ? slot.apply(this, args) : slot;
  }
});

EObject["clone"] = method(function (ctx) {
  var clone = this["clone:"]([function () {}]);
  if (ctx) clone.context = ctx;
  return clone;
});

EObject["clone:"] = method(function (init) {
  var obj     = Object.create(this);
  obj.init    = init[0];
  obj.proto   = this;
  obj.context = obj;
  
  this.init.call(obj);
  obj.init.call(obj);
  
  return obj;
});

EObject.init = method(function () {});

EObject["set:to:"] = method(function (name, expr) {
  this[name] = expr;
  if (name.match(/^[A-Z]/)) this[name].type = name;
});

EObject.println = method(function () {
  console.log(this["valueOf"]());
  return this;
});

EObject.type = "Object";

EString.println = method(function () {
  console.log('"' + this.toString() + '"');
  return this;
});

EString.type = "String";

EFunction.println = method(function () {
  console.log(this.toString());
  return this;
});

EFunction.type = "Function";

ENumber["-"] = method(function (x) { return this - x; });
ENumber["*"] = method(function (x) { return this * x; });
ENumber.type = "Number";

$elf[ "Object"  ] = EObject;
$elf[ "Lambda"  ] = EFunction;
$elf[ "nil"     ] = EObject.clone()
$elf[ "context" ] = EObject`

Lambda call: *args := `this.apply(this.__context, args)`

Lambda call: *args with-context: ctx := `this.apply($elf.ctx, args)`