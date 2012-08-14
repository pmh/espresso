
var EObject   = Object.prototype,
    EFunction = Function.prototype,
    EString   = String.prototype,
    ENumber   = Number.prototype,
    EArray    = Array.prototype,
    ERegex    = RegExp.prototype,
    $elf      = EObject;
    self      = EObject;

var method = function (body) {
  body.type = "Method";
  return body;
};

EObject["lookup:"] = method(function (slot_name) {
  slot_name = slot_name[0]
  var slot = this[slot_name]
  if (typeof slot !== "undefined") {
    return slot;
  } else {
    for (var i = this.delegates.length - 1; i >= 0; i--){
      if (this.delegates[i].hasOwnProperty(slot_name)) slot = this.delegates[i][slot_name];
      if (slot) break;
    };
  }
  return typeof slot === "undefined" ? (this.proto ? this.proto["lookup:"]([slot_name]) : nil) : slot;
});

EObject["send:"] = method(function (slot_name) {
  return this["send:args:"](slot_name, []);
});

EObject["send:args:"] = method(function (slot_name, args) {
  var slot = this["lookup:"]([slot_name]);
  if (typeof slot !== "undefined") {
    return (slot.type === "Method") ? slot.apply(this, args) : slot;
  } else {
    this["send:args:"]("unknown-slot:args:", [[slot_name], args])
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

$elf[ "Object"  ] = EObject;
$elf[ "Lambda"  ] = EFunction;
$elf[ "Number"  ] = ENumber;
$elf[ "String"  ] = EString;
$elf[ "Array"   ] = EArray;
$elf[ "Boolean" ] = EBoolean;
$elf[ "RegExp"  ] = ERegex;
$elf[ "nil"     ] = EObject.clone();;

$elf["send:"]("Object")["send:args:"]("set:to:", ["type", "Object"]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["each:", (function(body) { body.type = "Method"; return body; })((function (iterator) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("each:", [iterator]); })
  $elf["iterator"] = (iterator && iterator.type === "Array") ? iterator[0] : ((typeof iterator !== "undefined") ? iterator : nil);
  return self["send:"]("slots")["send:args:"]("each:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (slot) {
    var $elf = this.clone();
    $elf["slot"] = (slot && slot.type === "Array") ? slot[0] : ((typeof slot !== "undefined") ? slot : nil);
    return $elf["send:"]("iterator")["send:args:"]("call:", [[$elf["send:"]("slot"), self["send:args:"]("get:", [[$elf["send:"]("slot")]])]]);
  })]]);
}))]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["get:", (function(body) { body.type = "Method"; return body; })((function (slot) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("get:", [slot]); })
  $elf["slot"] = (slot && slot.type === "Array") ? slot[0] : ((typeof slot !== "undefined") ? slot : nil);
  $elf["send:args:"]("set:to:", ["slot", $elf["send:args:"]("lookup:", [[$elf["send:"]("slot")]])]);
  if ($elf.slot.type === "Method") $elf.slot.type = "Method Object";
  return $elf["send:"]("slot");
}))]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["slots", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("slots", []); })
  $elf["send:args:"]("set:to:", ["slots", []]);
  for (var slot in self) if (self.hasOwnProperty(slot)) $elf.slots.push(slot);
  return $elf["send:"]("slots");
}))]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["delegates", []]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["extend:", (function(body) { body.type = "Method"; return body; })((function (delegate) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("extend:", [delegate]); })
  $elf["delegate"] = (delegate && delegate.type === "Array") ? delegate[0] : ((typeof delegate !== "undefined") ? delegate : nil);
  return self["send:"]("delegates")["send:args:"]("push:", [[$elf["send:"]("delegate")]]);
}))]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["unextend:", (function(body) { body.type = "Method"; return body; })((function (delegate) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("unextend:", [delegate]); })
  $elf["delegate"] = (delegate && delegate.type === "Array") ? delegate[0] : ((typeof delegate !== "undefined") ? delegate : nil);
  for (var i = 0; i < self.delegates.length; i++) if (self.delegates[i] === delegate[0]) self.delegates = self.delegates.slice(i-1, i);
  return $elf["send:"]("nil");
}))]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["unknown-slot:args:", (function(body) { body.type = "Method"; return body; })((function (slot, args) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("unknown-slot:args:", [slot, args]); })
  $elf["slot"] = (slot && slot.type === "Array") ? slot[0] : ((typeof slot !== "undefined") ? slot : nil); $elf["args"] = (args && args.type === "Array") ? args[0] : ((typeof args !== "undefined") ? args : nil);
  return $elf["send:"]("nil");
}))]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["==", (function(body) { body.type = "Method"; return body; })((function (expr) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("==", [expr]); })
  $elf["expr"] = (expr && expr.type === "Array") ? expr[0] : ((typeof expr !== "undefined") ? expr : nil);
  return this.valueOf() === $elf.expr.valueOf();
}))]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["if_true:", (function(body) { body.type = "Method"; return body; })((function (blk) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_true:", [blk]); })
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  return $elf["send:"]("blk")["send:args:"]("call:", [[$elf["send:"]("nil")]]);
}))]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["if_false:", (function(body) { body.type = "Method"; return body; })((function (blk) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_false:", [blk]); })
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  return $elf["send:"]("nil");
}))]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["if_true:if_false:", (function(body) { body.type = "Method"; return body; })((function (blk, _) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_true:if_false:", [blk, _]); })
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil); $elf["_"] = (_ && _.type === "Array") ? _[0] : ((typeof _ !== "undefined") ? _ : nil);
  return $elf["send:"]("blk")["send:args:"]("call:", [[$elf["send:"]("nil")]]);
}))]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["true?", true]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["false?", false]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["nil?", false]);

$elf["send:"]("Object")["send:args:"]("extend:", [[$elf["send:"]("Enumerable")]]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["to-s", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); })
  $elf["send:args:"]("set:to:", ["slots", []]);
  self["send:args:"]("each:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (k, v) {
    var $elf = this.clone();
    $elf["k"] = (k && k.type === "Array") ? k[0] : ((typeof k !== "undefined") ? k : nil); $elf["v"] = (v && v.type === "Array") ? v[0] : ((typeof v !== "undefined") ? v : nil);
    return $elf["send:"]("slots")["send:args:"]("push:", [[[$elf["send:"]("k"), " => ", $elf["send:"]("v")["send:"]("type")].join("")]]);
  })]]);
  return ["<", $elf["send:"]("type"), " [\"", $elf["send:"]("slots")["send:args:"]("join:", [["\", \""]]), "\"]>"].join("");
}))]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["println", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("println", []); })
  console.log(this["to-s"]());
  return self;
}))]);

$elf["send:"]("Object")["send:args:"]("set:to:", ["&&", (function(body) { body.type = "Method"; return body; })((function (other) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("&&", [other]); })
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return self["send:args:"]("if_true:if_false:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
    var $elf = this.clone();
    return $elf["send:"]("other")["send:args:"]("if_true:if_false:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
      var $elf = this.clone();
      return true;
    })], [(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
      var $elf = this.clone();
      return false;
    })]]);
  })], [(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
    var $elf = this.clone();
    return false;
  })]]);
}))]);;

$elf["send:"]("Lambda")["send:args:"]("set:to:", ["type", "Lambda"]);

$elf["send:"]("Lambda")["send:args:"]("set:to:", ["_call", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("call", []); })
  return this.call(this.__context);
}))]);

$elf["send:"]("Lambda")["send:args:"]("set:to:", ["call-with:", (function(body) { body.type = "Method"; return body; })((function (ctx) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("call-with:", [ctx]); })
  $elf["ctx"] = (ctx && ctx.type === "Array") ? ctx[0] : ((typeof ctx !== "undefined") ? ctx : nil);
  return this.call($elf.ctx);
}))]);

$elf["send:"]("Lambda")["send:args:"]("set:to:", ["call:", (function(body) { body.type = "Method"; return body; })((function (args) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("call:", [args]); })
  $elf["args"] = args;
  return this.apply(this.__context, args);
}))]);

$elf["send:"]("Lambda")["send:args:"]("set:to:", ["call:with-context:", (function(body) { body.type = "Method"; return body; })((function (args, ctx) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("call:with-context:", [args, ctx]); })
  $elf["args"] = args; $elf["ctx"] = (ctx && ctx.type === "Array") ? ctx[0] : ((typeof ctx !== "undefined") ? ctx : nil);
  return this.apply($elf.ctx, args);
}))]);

$elf["send:"]("Lambda")["send:args:"]("set:to:", ["apply:", (function(body) { body.type = "Method"; return body; })((function (args) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("apply:", [args]); })
  $elf["args"] = (args && args.type === "Array") ? args[0] : ((typeof args !== "undefined") ? args : nil);
  return this.apply(this.__context, $elf.args);
}))]);

$elf["send:"]("Lambda")["send:args:"]("set:to:", ["apply:with-context:", (function(body) { body.type = "Method"; return body; })((function (args, ctx) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("apply:with-context:", [args, ctx]); })
  $elf["args"] = (args && args.type === "Array") ? args[0] : ((typeof args !== "undefined") ? args : nil); $elf["ctx"] = (ctx && ctx.type === "Array") ? ctx[0] : ((typeof ctx !== "undefined") ? ctx : nil);
  return this.apply($elf.ctx, $elf.args);
}))]);

$elf["send:"]("Lambda")["send:args:"]("set:to:", ["to-s", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); })
  return ["<", $elf["send:"]("type"), ">"].join("");
}))]);

$elf["send:"]("Lambda")["send:args:"]("set:to:", ["println", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("println", []); })
  return console.log(this["to-s"]());
}))]);;

$elf["send:"]("Number")["send:args:"]("set:to:", ["type", "Number"]);

$elf["send:"]("Number")["send:args:"]("set:to:", ["+", (function(body) { body.type = "Method"; return body; })((function (lhs) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("+", [lhs]); })
  $elf["lhs"] = (lhs && lhs.type === "Array") ? lhs[0] : ((typeof lhs !== "undefined") ? lhs : nil);
  return this + lhs;
}))]);

$elf["send:"]("Number")["send:args:"]("set:to:", ["-", (function(body) { body.type = "Method"; return body; })((function (lhs) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("-", [lhs]); })
  $elf["lhs"] = (lhs && lhs.type === "Array") ? lhs[0] : ((typeof lhs !== "undefined") ? lhs : nil);
  return this - lhs;
}))]);

$elf["send:"]("Number")["send:args:"]("set:to:", ["*", (function(body) { body.type = "Method"; return body; })((function (lhs) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("*", [lhs]); })
  $elf["lhs"] = (lhs && lhs.type === "Array") ? lhs[0] : ((typeof lhs !== "undefined") ? lhs : nil);
  return this * lhs;
}))]);

$elf["send:"]("Number")["send:args:"]("set:to:", ["/", (function(body) { body.type = "Method"; return body; })((function (lhs) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("/", [lhs]); })
  $elf["lhs"] = (lhs && lhs.type === "Array") ? lhs[0] : ((typeof lhs !== "undefined") ? lhs : nil);
  return this / lhs;
}))]);

$elf["send:"]("Number")["send:args:"]("set:to:", ["println", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("println", []); })
  return console.log(this["to-s"]());
}))]);

$elf["send:"]("Number")["send:args:"]("set:to:", ["to-s", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); })
  return this.valueOf();
}))]);;

$elf["send:"]("String")["send:args:"]("set:to:", ["type", "String"]);

$elf["send:"]("String")["send:args:"]("set:to:", ["println", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("println", []); })
  console.log(self["to-s"]());
  return self;
}))]);

$elf["send:"]("String")["send:args:"]("set:to:", ["to-s", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); })
  return '"' + self.valueOf() + '"';
}))]);

$elf["send:"]("String")["send:args:"]("set:to:", ["+", (function(body) { body.type = "Method"; return body; })((function (str) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("+", [str]); })
  $elf["str"] = (str && str.type === "Array") ? str[0] : ((typeof str !== "undefined") ? str : nil);
  return self + str["to-s"]();
}))]);

$elf["send:"]("String")["send:args:"]("set:to:", ["match:", (function(body) { body.type = "Method"; return body; })((function (regex) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("match:", [regex]); })
  $elf["regex"] = (regex && regex.type === "Array") ? regex[0] : ((typeof regex !== "undefined") ? regex : nil);
  return self.match(regex[0]) || nil;
}))]);;

$elf["send:"]("RegExp")["send:args:"]("set:to:", ["type", "RegExp"]);

$elf["send:"]("RegExp")["send:args:"]("set:to:", ["to-s", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); })
  return ["<RegExp ", self, ">"].join("");
}))]);;

$elf["send:args:"]("set:to:", ["Enumerable", $elf["send:"]("Object")["send:"]("clone")]);

$elf["send:"]("Enumerable")["send:args:"]("set:to:", ["map:", (function(body) { body.type = "Method"; return body; })((function (block) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("map:", [block]); })
  $elf["block"] = (block && block.type === "Array") ? block[0] : ((typeof block !== "undefined") ? block : nil);
  $elf["send:args:"]("set:to:", ["res", []]);
  $elf["send:args:"]("each:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (args) {
    var $elf = this.clone();
    $elf["args"] = Array.prototype.slice.call(arguments);
    return $elf["send:"]("res")["send:args:"]("push:", [[$elf["send:"]("block")["send:args:"]("apply:", [[$elf["send:"]("args")]])]]);
  })]]);
  return $elf["send:"]("res");
}))]);;

$elf["send:"]("Array")["send:args:"]("set:to:", ["type", "Array"]);

$elf["send:"]("Array")["send:args:"]("set:to:", ["_length", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("length", []); })
  return this.length;
}))]);

$elf["send:"]("Array")["send:args:"]("set:to:", ["empty?", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("empty?", []); })
  return $elf["send:"]("_length")["send:args:"]("==", [0]);
}))]);

$elf["send:"]("Array")["send:args:"]("set:to:", ["join:", (function(body) { body.type = "Method"; return body; })((function (separator) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("join:", [separator]); })
  $elf["separator"] = (separator && separator.type === "Array") ? separator[0] : ((typeof separator !== "undefined") ? separator : nil);
  return this.join(separator);
}))]);

$elf["send:"]("Array")["send:args:"]("set:to:", ["push:", (function(body) { body.type = "Method"; return body; })((function (elements) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("push:", [elements]); })
  $elf["elements"] = elements;
  $elf["send:"]("elements")["send:args:"]("each:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (element) {
    var $elf = this.clone();
    $elf["element"] = (element && element.type === "Array") ? element[0] : ((typeof element !== "undefined") ? element : nil);
    return self.push($elf.element);
  })]]);
  return self;
}))]);

$elf["send:"]("Array")["send:args:"]("set:to:", ["each:", (function(body) { body.type = "Method"; return body; })((function (block) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("each:", [block]); })
  $elf["block"] = (block && block.type === "Array") ? block[0] : ((typeof block !== "undefined") ? block : nil);
  for (var i = 0; i < this.length; i++) block[0]["call:"]([this[i], i]);
  return this;
}))]);

$elf["send:"]("Array")["send:args:"]("extend:", [[$elf["send:"]("Enumerable")]]);

$elf["send:"]("Array")["send:args:"]("set:to:", ["println", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("println", []); })
  "printin' arr";
  console.log(self["to-s"]());
  return self;
}))]);

$elf["send:"]("Array")["send:args:"]("set:to:", ["to-s", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); })
  return ["[", $elf["send:args:"]("map:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (el) {
    var $elf = this.clone();
    $elf["el"] = (el && el.type === "Array") ? el[0] : ((typeof el !== "undefined") ? el : nil);
    return $elf["send:"]("el")["send:"]("to-s");
  })]])["send:args:"]("join:", [[", "]]), "]"].join("");
}))]);;

$elf["send:"]("Boolean")["send:args:"]("set:to:", ["type", "Boolean"]);

$elf["send:"]("Boolean")["send:args:"]("set:to:", ["false?", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("false?", []); })
  return this.valueOf() === false;
}))]);

$elf["send:"]("Boolean")["send:args:"]("set:to:", ["true?", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("true?", []); })
  return this.valueOf() === true;
}))]);

$elf["send:"]("Boolean")["send:args:"]("set:to:", ["if_true:", (function(body) { body.type = "Method"; return body; })((function (blk) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_true:", [blk]); })
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  return this["true?"]() ? blk[0]["send:"]("_call") : nil;
}))]);

$elf["send:"]("Boolean")["send:args:"]("set:to:", ["if_false:", (function(body) { body.type = "Method"; return body; })((function (blk) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_false:", [blk]); })
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  return this["false?"]() ? blk[0]["send:"]("_call") : nil;
}))]);

$elf["send:"]("Boolean")["send:args:"]("set:to:", ["if_true:if_false:", (function(body) { body.type = "Method"; return body; })((function (true_branch, false_branch) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_true:if_false:", [true_branch, false_branch]); })
  $elf["true_branch"] = (true_branch && true_branch.type === "Array") ? true_branch[0] : ((typeof true_branch !== "undefined") ? true_branch : nil); $elf["false_branch"] = (false_branch && false_branch.type === "Array") ? false_branch[0] : ((typeof false_branch !== "undefined") ? false_branch : nil);
  return this["true?"]() ? true_branch[0]["_call"]() : false_branch[0]["_call"]();
}))]);

$elf["send:"]("Boolean")["send:args:"]("set:to:", ["to-s", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); })
  return this.valueOf();
}))]);;

$elf["send:"]("nil")["send:args:"]("set:to:", ["if_true:", (function(body) { body.type = "Method"; return body; })((function (blk) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_true:", [blk]); })
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  return $elf["send:"]("nil");
}))]);

$elf["send:"]("nil")["send:args:"]("set:to:", ["if_false:", (function(body) { body.type = "Method"; return body; })((function (blk) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_false:", [blk]); })
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  return $elf["send:"]("blk")["send:"]("_call");
}))]);

$elf["send:"]("nil")["send:args:"]("set:to:", ["if_true:if_false:", (function(body) { body.type = "Method"; return body; })((function (_, blk) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_true:if_false:", [_, blk]); })
  $elf["_"] = (_ && _.type === "Array") ? _[0] : ((typeof _ !== "undefined") ? _ : nil); $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  return $elf["send:"]("blk")["send:"]("_call");
}))]);

$elf["send:"]("nil")["send:args:"]("set:to:", ["true?", false]);

$elf["send:"]("nil")["send:args:"]("set:to:", ["false?", true]);

$elf["send:"]("nil")["send:args:"]("set:to:", ["nil?", true]);

$elf["send:"]("nil")["send:args:"]("set:to:", ["unknown-slot:args:", (function(body) { body.type = "Method"; return body; })((function (slot, args) {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("unknown-slot:args:", [slot, args]); })
  $elf["slot"] = (slot && slot.type === "Array") ? slot[0] : ((typeof slot !== "undefined") ? slot : nil); $elf["args"] = (args && args.type === "Array") ? args[0] : ((typeof args !== "undefined") ? args : nil);
  return $elf["send:"]("nil");
}))]);

$elf["send:"]("nil")["send:args:"]("set:to:", ["to-s", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); })
  return "nil";
}))]);

$elf["send:"]("nil")["send:args:"]("set:to:", ["println", (function(body) { body.type = "Method"; return body; })((function () {
  var self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("println", []); })
  return $elf["send:"]("nil")["send:"]("to-s")["send:"]("println");
}))]);

$elf["send:"]("nil")["send:args:"]("set:to:", ["toString", nil["to-s"]]);

$elf["send:"]("nil")["send:args:"]("set:to:", ["inspect", nil["to-s"]]);;