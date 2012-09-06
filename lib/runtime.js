
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

  Object.defineProperty(obj, "method-table", {
    enumerable: false,
    value: {}
  });
  
  this.init.call(obj, obj);
  obj.init.call(obj, obj);

  return obj;
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
  if (name.match(/^[A-Z]/)) this[name].type = name;

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

nil.proto     = EObject;
nil.delegates = [];;;

$elf = Object.create(EObject);

$elf["send:args:"]("set:to:", [["Lobby"], [$elf]]);

$elf["send:"]("Lobby")["send:args:"]("define-method:predicates:do:", [["unknown-slot:args:"], [[true,true]], [(function (slot, args) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("unknown-slot:args:", [slot, args]); });
  $elf["slot"] = (slot && slot.type === "Array") ? slot[0] : ((typeof slot !== "undefined") ? slot : nil); $elf["args"] = args;
  return $elf["send:"]("nil");
})]]);

$elf["send:"]("Lobby")["send:args:"]("define-method:predicates:do:", [["to-s"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); });
  ___ret___ = $elf["send:args:"]("set:to:", [["slots"], [self["send:args:"]("map:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (k) {
    var $elf = this.clone();
    $elf["k"] = (k && k.type === "Array") ? k[0] : ((typeof k !== "undefined") ? k : nil);
    return $elf["send:"]("k");
  })]])]]);
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  return [$elf["send:"]("type"), "\n  ", $elf["send:"]("slots")["send:args:"]("join:", [["\n  "]])].join("");
})]]);

$elf["send:args:"]("set:to:", [["Object"], [EObject]]);

$elf["send:args:"]("set:to:", [["Lambda"], [EFunction]]);

$elf["send:args:"]("set:to:", [["Number"], [ENumber]]);

$elf["send:args:"]("set:to:", [["String"], [EString]]);

$elf["send:args:"]("set:to:", [["Array"], [EArray]]);

$elf["send:args:"]("set:to:", [["Boolean"], [EBoolean]]);

$elf["send:args:"]("set:to:", [["RegExp"], [ERegex]]);

$elf["send:args:"]("set:to:", [["nil"], [nil]]);

$elf["send:args:"]("set:to:", [["traits"], [$elf["send:"]("Object")["send:"]("clone")]]);;

$elf["send:"]("Object")["send:args:"]("set:to:", [["type"], ["Object"]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["each:"], [[true]], [(function (iterator) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("each:", [iterator]); });
  $elf["iterator"] = (iterator && iterator.type === "Array") ? iterator[0] : ((typeof iterator !== "undefined") ? iterator : nil);
  return self["send:"]("slots")["send:args:"]("each:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (slot) {
    var $elf = this.clone();
    $elf["slot"] = (slot && slot.type === "Array") ? slot[0] : ((typeof slot !== "undefined") ? slot : nil);
    return $elf["send:"]("iterator")["send:args:"]("call:", [[$elf["send:"]("slot"), self["send:args:"]("get:", [[$elf["send:"]("slot")]])]]);
  })]]);
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["get:"], [[true]], [(function (slot) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("get:", [slot]); });
  $elf["slot"] = (slot && slot.type === "Array") ? slot[0] : ((typeof slot !== "undefined") ? slot : nil);
  ___ret___ = $elf["send:args:"]("set:to:", [["slot"], [$elf["send:args:"]("lookup:", [[$elf["send:"]("slot")]])]]);
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  if ($elf.slot.type === "Method") { $elf.slot.type = "Lambda" ; $elf.slot.__context = this }
  return $elf["send:"]("slot");
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["slots"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("slots", []); });
  ___ret___ = $elf["send:args:"]("set:to:", [["slots"], [[]]]);
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  for (var slot in self) if (self.hasOwnProperty(slot)) $elf.slots.push(slot);
  return $elf["send:"]("slots");
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["values"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("values", []); });
  return self["send:args:"]("map:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (k, v) {
    var $elf = this.clone();
    $elf["k"] = (k && k.type === "Array") ? k[0] : ((typeof k !== "undefined") ? k : nil); $elf["v"] = (v && v.type === "Array") ? v[0] : ((typeof v !== "undefined") ? v : nil);
    return $elf["send:"]("v");
  })]]);
})]]);

$elf["send:"]("Object")["send:args:"]("set:to:", [["delegates"], [[$elf["send:"]("Lobby")]]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["extend:"], [[true]], [(function (delegate) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("extend:", [delegate]); });
  $elf["delegate"] = (delegate && delegate.type === "Array") ? delegate[0] : ((typeof delegate !== "undefined") ? delegate : nil);
  return self["send:"]("delegates")["send:args:"]("push:", [[$elf["send:"]("delegate")]]);
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["unextend:"], [[true]], [(function (delegate) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("unextend:", [delegate]); });
  $elf["delegate"] = (delegate && delegate.type === "Array") ? delegate[0] : ((typeof delegate !== "undefined") ? delegate : nil);
  for (var i = 0; i < self.delegates.length; i++) if (self.delegates[i] === delegate[0]) self.delegates = self.delegates.slice(i-1, i);
  return $elf["send:"]("nil");
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["unknown-slot:args:"], [[true,true]], [(function (slot, args) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("unknown-slot:args:", [slot, args]); });
  $elf["slot"] = (slot && slot.type === "Array") ? slot[0] : ((typeof slot !== "undefined") ? slot : nil); $elf["args"] = (args && args.type === "Array") ? args[0] : ((typeof args !== "undefined") ? args : nil);
  return $elf["send:"]("nil");
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["=="], [[]], [(function (expr) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("==", [expr]); });
  $elf["expr"] = (expr && expr.type === "Array") ? expr[0] : ((typeof expr !== "undefined") ? expr : nil);
  return this === $elf.expr;
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["=="], [[(function () {
  var self = this, $elf = arguments[0];
  return $elf["send:"]("type")["send:args:"]("==", ["Boolean"]);
})]], [(function (expr) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("==", [expr]); });
  $elf["expr"] = (expr && expr.type === "Array") ? expr[0] : ((typeof expr !== "undefined") ? expr : nil);
  return this[expr + "?"];
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["if_true:"], [[true]], [(function (blk) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_true:", [blk]); });
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  return $elf["send:"]("blk")["send:"]("_call");
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["if_false:"], [[true]], [(function (blk) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_false:", [blk]); });
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  return $elf["send:"]("nil");
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["if_true:if_false:"], [[true,true]], [(function (blk, _) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_true:if_false:", [blk, _]); });
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil); $elf["_"] = (_ && _.type === "Array") ? _[0] : ((typeof _ !== "undefined") ? _ : nil);
  return $elf["send:"]("blk")["send:"]("_call");
})]]);

$elf["send:"]("Object")["send:args:"]("set:to:", [["true?"], [true]]);

$elf["send:"]("Object")["send:args:"]("set:to:", [["false?"], [false]]);

$elf["send:"]("Object")["send:args:"]("set:to:", [["nil?"], [false]]);

$elf["send:"]("Object")["send:args:"]("extend:", [[$elf["send:"]("traits")["send:"]("Enumerable")]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["to-s"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); });
  return ["<", $elf["send:"]("type"), " [", self["send:args:"]("map:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (k) {
    var $elf = this.clone();
    $elf["k"] = (k && k.type === "Array") ? k[0] : ((typeof k !== "undefined") ? k : nil);
    return $elf["send:"]("k");
  })]])["send:args:"]("join:", [[", "]]), "]>"].join("");
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["value-of"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("value-of", []); });
  return self.valueOf();
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["println"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("println", []); });
  ___ret___ = console.log(self["send:"]("to-s"));
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  return self;
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["&&"], [[]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("&&", [other]); });
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
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["||"], [[]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("||", [other]); });
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return self["send:args:"]("if_true:if_false:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
    var $elf = this.clone();
    return self;
  })], [(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
    var $elf = this.clone();
    return $elf["send:"]("other")["send:args:"]("if_true:if_false:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
      var $elf = this.clone();
      return $elf["send:"]("other");
    })], [(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
      var $elf = this.clone();
      return false;
    })]]);
  })]]);
})]]);

$elf["send:"]("Object")["send:args:"]("set:to:", [["proto"], [$elf["send:"]("nil")]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["inherits?:"], [[true]], [(function (object) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("inherits?:", [object]); });
  $elf["object"] = (object && object.type === "Array") ? object[0] : ((typeof object !== "undefined") ? object : nil);
  return self["send:"]("proto")["send:args:"]("if_true:if_false:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
    var $elf = this.clone();
    return self["send:"]("proto")["send:args:"]("==", [$elf["send:"]("object")])["send:args:"]("||", [$elf["send:"]("forward")]);
  })], [(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
    var $elf = this.clone();
    return false;
  })]]);
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["understands?:"], [[true]], [(function (message) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("understands?:", [message]); });
  $elf["message"] = (message && message.type === "Array") ? message[0] : ((typeof message !== "undefined") ? message : nil);
  ___ret___ = $elf["send:args:"]("set:to:", [["slot"], [self["send:args:"]("lookup:", [[$elf["send:"]("message")]])]]);
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  return typeof $elf.slot == "undefined" ? false : true;
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["throw:"], [[true]], [(function (message) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("throw:", [message]); });
  $elf["message"] = (message && message.type === "Array") ? message[0] : ((typeof message !== "undefined") ? message : nil);
  throw message;
  return $elf["send:"]("nil");
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["replace-delegate:with:"], [[true,true]], [(function (original, delegate) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("replace-delegate:with:", [original, delegate]); });
  $elf["original"] = (original && original.type === "Array") ? original[0] : ((typeof original !== "undefined") ? original : nil); $elf["delegate"] = (delegate && delegate.type === "Array") ? delegate[0] : ((typeof delegate !== "undefined") ? delegate : nil);
  ___ret___ = self["send:args:"]("unextend:", [[$elf["send:"]("original")]]);
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  return self["send:args:"]("extend:", [[$elf["send:"]("delegate")]]);
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["perform:"], [[true]], [(function (selector) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("perform:", [selector]); });
  $elf["selector"] = (selector && selector.type === "Array") ? selector[0] : ((typeof selector !== "undefined") ? selector : nil);
  return self["send:args:"]("send:", [[$elf["send:"]("selector")]]);
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["perform:args:"], [[true,true]], [(function (selector, args) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("perform:args:", [selector, args]); });
  $elf["selector"] = (selector && selector.type === "Array") ? selector[0] : ((typeof selector !== "undefined") ? selector : nil); $elf["args"] = args;
  return self["send:args:"]($elf["send:"]("selector"), $elf["send:"]("args"));
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["delete:"], [[true]], [(function (slot) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("delete:", [slot]); });
  $elf["slot"] = (slot && slot.type === "Array") ? slot[0] : ((typeof slot !== "undefined") ? slot : nil);
  ___ret___ = delete this[slot];
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  return $elf["send:"]("nil");
})]]);

$elf["send:"]("traits")["send:args:"]("set:to:", [["Match"], [$elf["send:"]("Object")["send:"]("clone")]]);

$elf["send:"]("traits")["send:"]("Match")["send:args:"]("set:to:", [["_"], [true]]);

$elf["send:"]("traits")["send:"]("Match")["send:args:"]("define-method:predicates:do:", [["when:do:"], [[true,true]], [(function (pred, blk) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("when:do:", [pred, blk]); });
  $elf["pred"] = (pred && pred.type === "Array") ? pred[0] : ((typeof pred !== "undefined") ? pred : nil); $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  ___ret___ = $elf["send:args:"]("set:to:", [["pred"], [$elf["send:"]("pred")["send:"]("type")["send:args:"]("==", ["Array"])["send:args:"]("if_true:if_false:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
    var $elf = this.clone();
    return [$elf["send:"]("pred")];
  })], [(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
    var $elf = this.clone();
    return $elf["send:"]("pred")["send:"]("value-of");
  })]])]]);
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  return self["send:"]("matchers")["send:args:"]("push:", [[$elf["send:"]("clone")]]);
})]]);

$elf["send:"]("Object")["send:args:"]("define-method:predicates:do:", [["match:"], [[true]], [(function (blk) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("match:", [blk]); });
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  ___ret___ = $elf["send:args:"]("set:to:", [["matcher"], [$elf["send:"]("traits")["send:"]("Match")["send:args:"]("clone:", [[(function () {
    var self = this, $elf = arguments[0];
    return $elf["send:args:"]("set:to:", [["matchers"], [[]]]);
  })]])]]);
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  ___ret___ = $elf["send:"]("matcher")["send:args:"]("extend:", [[self]]);
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  ___ret___ = $elf["send:args:"]("set:to:", [["matchers"], [$elf["send:"]("blk")["send:args:"]("call:as:", [[$elf["send:"]("matcher")], [$elf["send:"]("matcher")]])]]);
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  return $elf["send:"]("matchers")["send:args:"]("each:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (match) {
    var $elf = this.clone();
    $elf["match"] = (match && match.type === "Array") ? match[0] : ((typeof match !== "undefined") ? match : nil);
    return self["send:"]("value-of")["send:args:"]("==", [$elf["send:"]("match")["send:"]("pred")["send:"]("value-of")])["send:args:"]("if_true:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
      var $elf = this.clone();
      return {ret: $elf["send:"]("match")["send:"]("blk")["send:args:"]("understands?:", [["call"]])["send:args:"]("if_true:if_false:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
        var $elf = this.clone();
        return $elf["send:"]("match")["send:"]("blk")["send:args:"]("call:", [[self]]);
      })], [(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
        var $elf = this.clone();
        return $elf["send:"]("match")["send:"]("blk");
      })]])};
    })]]);
  })]]);
})]]);;

$elf["send:"]("Lambda")["send:args:"]("set:to:", [["type"], ["Lambda"]]);

$elf["send:"]("Lambda")["send:args:"]("define-method:predicates:do:", [["_call"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("call", []); });
  return self.call($elf["send:"]("__context"));
})]]);

$elf["send:"]("Lambda")["send:args:"]("define-method:predicates:do:", [["call-as:"], [[true]], [(function (ctx) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("call-as:", [ctx]); });
  $elf["ctx"] = (ctx && ctx.type === "Array") ? ctx[0] : ((typeof ctx !== "undefined") ? ctx : nil);
  return self.call($elf["send:"]("ctx"));
})]]);

$elf["send:"]("Lambda")["send:args:"]("define-method:predicates:do:", [["call:"], [[true]], [(function (args) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("call:", [args]); });
  $elf["args"] = args;
  return self.apply($elf["send:"]("__context"), $elf["send:"]("args"));
})]]);

$elf["send:"]("Lambda")["send:args:"]("define-method:predicates:do:", [["call:as:"], [[true,true]], [(function (args, ctx) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("call:as:", [args, ctx]); });
  $elf["args"] = args; $elf["ctx"] = (ctx && ctx.type === "Array") ? ctx[0] : ((typeof ctx !== "undefined") ? ctx : nil);
  return self.apply($elf["send:"]("ctx"), $elf["send:"]("args"));
})]]);

$elf["send:"]("Lambda")["send:args:"]("define-method:predicates:do:", [["apply:"], [[true]], [(function (args) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("apply:", [args]); });
  $elf["args"] = (args && args.type === "Array") ? args[0] : ((typeof args !== "undefined") ? args : nil);
  return self.apply($elf["send:"]("__context"), $elf["send:"]("args"));
})]]);

$elf["send:"]("Lambda")["send:args:"]("define-method:predicates:do:", [["apply:as:"], [[true,true]], [(function (args, ctx) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("apply:as:", [args, ctx]); });
  $elf["args"] = (args && args.type === "Array") ? args[0] : ((typeof args !== "undefined") ? args : nil); $elf["ctx"] = (ctx && ctx.type === "Array") ? ctx[0] : ((typeof ctx !== "undefined") ? ctx : nil);
  return self.apply($elf["send:"]("ctx"), $elf["send:"]("args"));
})]]);

$elf["send:"]("Lambda")["send:args:"]("define-method:predicates:do:", [["to-s"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); });
  return ["<", $elf["send:"]("type"), ">"].join("");
})]]);

$elf["send:"]("Lambda")["send:args:"]("define-method:predicates:do:", [["=="], [[]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("==", [other]); });
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return self.toString() == other.toString();
})]]);

$elf["send:"]("Lambda")["send:args:"]("define-method:predicates:do:", [["=="], [[(function () {
  var self = this, $elf = arguments[0];
  return $elf["send:"]("type")["send:args:"]("==", ["Boolean"]);
})]], [(function (expr) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("==", [expr]); });
  $elf["expr"] = (expr && expr.type === "Array") ? expr[0] : ((typeof expr !== "undefined") ? expr : nil);
  return this[expr + "?"];
})]]);;

$elf["send:"]("Number")["send:args:"]("set:to:", [["type"], ["Number"]]);

$elf["send:"]("Number")["send:args:"]("define-method:predicates:do:", [["+"], [[]], [(function (lhs) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("+", [lhs]); });
  $elf["lhs"] = (lhs && lhs.type === "Array") ? lhs[0] : ((typeof lhs !== "undefined") ? lhs : nil);
  return this + lhs;
})]]);

$elf["send:"]("Number")["send:args:"]("define-method:predicates:do:", [["-"], [[]], [(function (lhs) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("-", [lhs]); });
  $elf["lhs"] = (lhs && lhs.type === "Array") ? lhs[0] : ((typeof lhs !== "undefined") ? lhs : nil);
  return this - lhs;
})]]);

$elf["send:"]("Number")["send:args:"]("define-method:predicates:do:", [["*"], [[]], [(function (lhs) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("*", [lhs]); });
  $elf["lhs"] = (lhs && lhs.type === "Array") ? lhs[0] : ((typeof lhs !== "undefined") ? lhs : nil);
  return this * lhs;
})]]);

$elf["send:"]("Number")["send:args:"]("define-method:predicates:do:", [["/"], [[]], [(function (lhs) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("/", [lhs]); });
  $elf["lhs"] = (lhs && lhs.type === "Array") ? lhs[0] : ((typeof lhs !== "undefined") ? lhs : nil);
  return this / lhs;
})]]);

$elf["send:"]("Number")["send:args:"]("define-method:predicates:do:", [["<"], [[]], [(function (lhs) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("<", [lhs]); });
  $elf["lhs"] = (lhs && lhs.type === "Array") ? lhs[0] : ((typeof lhs !== "undefined") ? lhs : nil);
  return this < lhs;
})]]);

$elf["send:"]("Number")["send:args:"]("define-method:predicates:do:", [[">"], [[]], [(function (lhs) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"](">", [lhs]); });
  $elf["lhs"] = (lhs && lhs.type === "Array") ? lhs[0] : ((typeof lhs !== "undefined") ? lhs : nil);
  return this > lhs;
})]]);

$elf["send:"]("Number")["send:args:"]("define-method:predicates:do:", [["=="], [[]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("==", [other]); });
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return self == other;
})]]);

$elf["send:"]("Number")["send:args:"]("define-method:predicates:do:", [["=="], [[(function () {
  var self = this, $elf = arguments[0];
  return $elf["send:"]("type")["send:args:"]("==", ["Boolean"]);
})]], [(function (expr) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("==", [expr]); });
  $elf["expr"] = (expr && expr.type === "Array") ? expr[0] : ((typeof expr !== "undefined") ? expr : nil);
  return this[expr + "?"];
})]]);

$elf["send:"]("Number")["send:args:"]("define-method:predicates:do:", [["<=>"], [[]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("<=>", [other]); });
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return self["send:args:"]("==", [$elf["send:"]("other")])["send:args:"]("if_true:if_false:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
    var $elf = this.clone();
    return 0;
  })], [(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
    var $elf = this.clone();
    return self["send:args:"]("<", [$elf["send:"]("other")])["send:args:"]("if_true:if_false:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
      var $elf = this.clone();
      return 1;
    })], [(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
      var $elf = this.clone();
      return -1;
    })]]);
  })]]);
})]]);

$elf["send:"]("Number")["send:args:"]("define-method:predicates:do:", [["times:current-count:"], [[true,true]], [(function (blk, i) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("times:current-count:", [blk, i]); });
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil); $elf["i"] = (i && i.type === "Array") ? i[0] : ((typeof i !== "undefined") ? i : nil);
  return self;
})]]);

$elf["send:"]("Number")["send:args:"]("define-method:predicates:do:", [["times:current-count:"], [[true,(function () {
  var self = this, $elf = arguments[0];
  return $elf["send:args:"]("<=", [self]);
})]], [(function (blk, i) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("times:current-count:", [blk, i]); });
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil); $elf["i"] = (i && i.type === "Array") ? i[0] : ((typeof i !== "undefined") ? i : nil);
  ___ret___ = $elf["send:"]("blk")["send:args:"]("call:", [[$elf["send:"]("i")["send:args:"]("+", [1])]]);
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  return self["send:args:"]("times:current-count:", [[$elf["send:"]("blk")], [$elf["send:"]("i")["send:args:"]("+", [1])]]);
})]]);

$elf["send:"]("Number")["send:args:"]("define-method:predicates:do:", [["times:"], [[true]], [(function (blk) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("times:", [blk]); });
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  return self["send:args:"]("times:current-count:", [[$elf["send:"]("blk")], [0]]);
})]]);

$elf["send:"]("Number")["send:args:"]("define-method:predicates:do:", [["to-s"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); });
  return self["send:"]("value-of");
})]]);;

$elf["send:"]("String")["send:args:"]("set:to:", [["type"], ["String"]]);

$elf["send:"]("String")["send:args:"]("define-method:predicates:do:", [["println"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("println", []); });
  ___ret___ = console.log(self["send:"]("to-s"));
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  return self;
})]]);

$elf["send:"]("String")["send:args:"]("define-method:predicates:do:", [["to-s"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); });
  return self["send:"]("value-of");
})]]);

$elf["send:"]("String")["send:args:"]("define-method:predicates:do:", [["+"], [[]], [(function (str) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("+", [str]); });
  $elf["str"] = (str && str.type === "Array") ? str[0] : ((typeof str !== "undefined") ? str : nil);
  return self + str["to-s"]();
})]]);

$elf["send:"]("String")["send:args:"]("define-method:predicates:do:", [["=="], [[]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("==", [other]); });
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return other == true ? true : self == other;
})]]);

$elf["send:"]("String")["send:args:"]("define-method:predicates:do:", [["<=>"], [[]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("<=>", [other]); });
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return self["send:args:"]("==", [$elf["send:"]("other")])["send:args:"]("if_true:if_false:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
    var $elf = this.clone();
    return 0;
  })], [(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
    var $elf = this.clone();
    return self["send:"]("_length")["send:args:"]("<", [$elf["send:"]("other")["send:"]("_length")])["send:args:"]("if_true:if_false:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
      var $elf = this.clone();
      return 1;
    })], [(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function () {
      var $elf = this.clone();
      return -1;
    })]]);
  })]]);
})]]);

$elf["send:"]("String")["send:args:"]("define-method:predicates:do:", [["value-of"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("value-of", []); });
  return this.valueOf();
})]]);

$elf["send:"]("String")["send:args:"]("define-method:predicates:do:", [["match:"], [[(function () {
  var self = this, $elf = arguments[0];
  return $elf["send:"]("type")["send:args:"]("==", ["RegExp"])["send:args:"]("||", [$elf["send:"]("type")["send:args:"]("==", ["String"])]);
})]], [(function (regex) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("match:", [regex]); });
  $elf["regex"] = (regex && regex.type === "Array") ? regex[0] : ((typeof regex !== "undefined") ? regex : nil);
  return self.match(regex[0]) || nil;
})]]);;

$elf["send:"]("RegExp")["send:args:"]("set:to:", [["type"], ["RegExp"]]);

$elf["send:"]("RegExp")["send:args:"]("define-method:predicates:do:", [["to-s"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); });
  return ["<RegExp ", self, ">"].join("");
})]]);

$elf["send:"]("RegExp")["send:args:"]("define-method:predicates:do:", [["=="], [[]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("==", [other]); });
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return self.toString() == other.toString();
})]]);

$elf["send:"]("RegExp")["send:args:"]("define-method:predicates:do:", [["=="], [[(function () {
  var self = this, $elf = arguments[0];
  return $elf["send:"]("type")["send:args:"]("==", ["Boolean"]);
})]], [(function (expr) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("==", [expr]); });
  $elf["expr"] = (expr && expr.type === "Array") ? expr[0] : ((typeof expr !== "undefined") ? expr : nil);
  return this[expr + "?"];
})]]);;

$elf["send:"]("traits")["send:args:"]("set:to:", [["Enumerable"], [$elf["send:"]("Object")["send:"]("clone")]]);

$elf["send:"]("traits")["send:"]("Enumerable")["send:args:"]("define-method:predicates:do:", [["map:"], [[true]], [(function (block) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("map:", [block]); });
  $elf["block"] = (block && block.type === "Array") ? block[0] : ((typeof block !== "undefined") ? block : nil);
  ___ret___ = $elf["send:args:"]("set:to:", [["res"], [[]]]);
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  ___ret___ = self["send:args:"]("each:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (args) {
    var $elf = this.clone();
    $elf["args"] = Array.prototype.slice.call(arguments);
    return $elf["send:"]("res")["send:args:"]("push:", [[$elf["send:"]("block")["send:args:"]("apply:", [[$elf["send:"]("args")]])]]);
  })]]);
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  return $elf["send:"]("res");
})]]);;

$elf["send:"]("Array")["send:args:"]("set:to:", [["type"], ["Array"]]);

$elf["send:"]("Array")["send:args:"]("define-method:predicates:do:", [["_length"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("length", []); });
  return self.length;
})]]);

$elf["send:"]("Array")["send:args:"]("define-method:predicates:do:", [["empty?"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("empty?", []); });
  return $elf["send:"]("_length")["send:args:"]("==", [0]);
})]]);

$elf["send:"]("Array")["send:args:"]("define-method:predicates:do:", [["join:"], [[true]], [(function (separator) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("join:", [separator]); });
  $elf["separator"] = (separator && separator.type === "Array") ? separator[0] : ((typeof separator !== "undefined") ? separator : nil);
  return self.join($elf["send:"]("separator"));
})]]);

$elf["send:"]("Array")["send:args:"]("define-method:predicates:do:", [["push:"], [[true]], [(function (elements) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("push:", [elements]); });
  $elf["elements"] = elements;
  ___ret___ = $elf["send:"]("elements")["send:args:"]("each:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (element) {
    var $elf = this.clone();
    $elf["element"] = (element && element.type === "Array") ? element[0] : ((typeof element !== "undefined") ? element : nil);
    return self.push($elf["send:"]("element"));
  })]]);
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  return self;
})]]);

$elf["send:"]("Array")["send:args:"]("define-method:predicates:do:", [["each:"], [[true]], [(function (block) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("each:", [block]); });
  $elf["block"] = (block && block.type === "Array") ? block[0] : ((typeof block !== "undefined") ? block : nil);
  for (var i = 0; i < this.length; i++) {;
  ___ret___ = $elf["send:"]("block")["send:args:"]("call:", [[self[i], i]]);
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  }
  return self;
})]]);

$elf["send:"]("Array")["send:args:"]("define-method:predicates:do:", [["=="], [[]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("==", [other]); });
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return $elf["send:args:"]("join:", [[","]])["send:"]("value-of")["send:args:"]("==", [$elf["send:"]("other")["send:args:"]("join:", [[","]])["send:"]("value-of")]);
})]]);

$elf["send:"]("Array")["send:args:"]("define-method:predicates:do:", [["=="], [[(function () {
  var self = this, $elf = arguments[0];
  return $elf["send:"]("type")["send:args:"]("==", ["Boolean"]);
})]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("==", [other]); });
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return this[other + "?"];
})]]);

$elf["send:"]("Array")["send:args:"]("extend:", [[$elf["send:"]("traits")["send:"]("Enumerable")]]);

$elf["send:"]("Array")["send:args:"]("define-method:predicates:do:", [["println"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("println", []); });
  ___ret___ = console.log(self["to-s"]());
  if (typeof ___ret___ !== "undefined" && typeof ___ret___.ret !== "undefined") { return ___ret___.ret };
  return self;
})]]);

$elf["send:"]("Array")["send:args:"]("define-method:predicates:do:", [["to-s"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); });
  return ["[", $elf["send:args:"]("map:", [[(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (el) {
    var $elf = this.clone();
    $elf["el"] = (el && el.type === "Array") ? el[0] : ((typeof el !== "undefined") ? el : nil);
    return $elf["send:"]("el")["send:"]("to-s");
  })]])["send:args:"]("join:", [[", "]]), "]"].join("");
})]]);;

$elf["send:"]("Boolean")["send:args:"]("set:to:", [["type"], ["Boolean"]]);

$elf["send:"]("Boolean")["send:args:"]("define-method:predicates:do:", [["false?"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("false?", []); });
  return this.valueOf() === false;
})]]);

$elf["send:"]("Boolean")["send:args:"]("define-method:predicates:do:", [["true?"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("true?", []); });
  return this.valueOf() === true;
})]]);

$elf["send:"]("Boolean")["send:args:"]("define-method:predicates:do:", [["if_true:"], [[true]], [(function (blk) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_true:", [blk]); });
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  return this["true?"]() ? blk[0]["send:"]("_call") : nil;
})]]);

$elf["send:"]("Boolean")["send:args:"]("define-method:predicates:do:", [["if_false:"], [[true]], [(function (blk) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_false:", [blk]); });
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  return this["false?"]() ? blk[0]["send:"]("_call") : nil;
})]]);

$elf["send:"]("Boolean")["send:args:"]("define-method:predicates:do:", [["if_true:if_false:"], [[true,true]], [(function (true_branch, false_branch) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_true:if_false:", [true_branch, false_branch]); });
  $elf["true_branch"] = (true_branch && true_branch.type === "Array") ? true_branch[0] : ((typeof true_branch !== "undefined") ? true_branch : nil); $elf["false_branch"] = (false_branch && false_branch.type === "Array") ? false_branch[0] : ((typeof false_branch !== "undefined") ? false_branch : nil);
  return this["true?"]() ? true_branch[0]["_call"]() : false_branch[0]["_call"]();
})]]);

$elf["send:"]("Boolean")["send:args:"]("define-method:predicates:do:", [["=="], [[]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("==", [other]); });
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return self == other;
})]]);

$elf["send:"]("Boolean")["send:args:"]("define-method:predicates:do:", [["to-s"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); });
  return self["send:"]("value-of");
})]]);;

$elf["send:"]("nil")["send:args:"]("define-method:predicates:do:", [["if_true:"], [[true]], [(function (blk) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_true:", [blk]); });
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  return $elf["send:"]("nil");
})]]);

$elf["send:"]("nil")["send:args:"]("define-method:predicates:do:", [["if_false:"], [[true]], [(function (blk) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_false:", [blk]); });
  $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  return $elf["send:"]("blk")["send:"]("_call");
})]]);

$elf["send:"]("nil")["send:args:"]("define-method:predicates:do:", [["if_true:if_false:"], [[true,true]], [(function (_, blk) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("if_true:if_false:", [_, blk]); });
  $elf["_"] = (_ && _.type === "Array") ? _[0] : ((typeof _ !== "undefined") ? _ : nil); $elf["blk"] = (blk && blk.type === "Array") ? blk[0] : ((typeof blk !== "undefined") ? blk : nil);
  return $elf["send:"]("blk")["send:"]("_call");
})]]);

$elf["send:"]("nil")["send:args:"]("set:to:", [["true?"], [false]]);

$elf["send:"]("nil")["send:args:"]("set:to:", [["false?"], [true]]);

$elf["send:"]("nil")["send:args:"]("set:to:", [["nil?"], [true]]);

$elf["send:"]("nil")["send:args:"]("define-method:predicates:do:", [["to-s"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("to-s", []); });
  return $elf["send:"]("type")["send:"]("value-of");
})]]);

$elf["send:"]("nil")["send:args:"]("define-method:predicates:do:", [["println"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("println", []); });
  return $elf["send:"]("nil")["send:"]("to-s")["send:"]("println");
})]]);

$elf["send:"]("nil")["send:args:"]("set:to:", [["type"], ["nil"]]);

$elf["send:"]("nil")["send:args:"]("define-method:predicates:do:", [["toString"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("toString", []); });
  return $elf["send:"]("nil")["send:"]("to-s");
})]]);

$elf["send:"]("nil")["send:args:"]("define-method:predicates:do:", [["inspect"], [[]], [(function () {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("inspect", []); });
  return $elf["send:"]("nil")["send:"]("to-s");
})]]);;

$elf["send:"]("traits")["send:args:"]("set:to:", [["Comparable"], [$elf["send:"]("Object")["send:"]("clone")]]);

$elf["send:"]("traits")["send:"]("Comparable")["send:args:"]("define-method:predicates:do:", [["=="], [[]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("==", [other]); });
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return self["send:args:"]("<=>", [$elf["send:"]("other")])["send:args:"]("==", [0]);
})]]);

$elf["send:"]("traits")["send:"]("Comparable")["send:args:"]("define-method:predicates:do:", [["!="], [[]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("!=", [other]); });
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return self["send:args:"]("<=>", [$elf["send:"]("other")])["send:args:"]("==", [-1]);
})]]);

$elf["send:"]("traits")["send:"]("Comparable")["send:args:"]("define-method:predicates:do:", [["<"], [[]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("<", [other]); });
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return self["send:args:"]("<=>", [$elf["send:"]("other")])["send:args:"]("==", [-1]);
})]]);

$elf["send:"]("traits")["send:"]("Comparable")["send:args:"]("define-method:predicates:do:", [["<="], [[]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"]("<=", [other]); });
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return self["send:args:"]("<=>", [$elf["send:"]("other")])["send:args:"]("==", [1])["send:args:"]("||", [self["send:args:"]("<=>", [$elf["send:"]("other")])["send:args:"]("==", [0])]);
})]]);

$elf["send:"]("traits")["send:"]("Comparable")["send:args:"]("define-method:predicates:do:", [[">"], [[]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"](">", [other]); });
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return self["send:args:"]("<=>", [$elf["send:"]("other")])["send:args:"]("==", [1]);
})]]);

$elf["send:"]("traits")["send:"]("Comparable")["send:args:"]("define-method:predicates:do:", [[">="], [[]], [(function (other) {
  var ___ret___ = undefined, self = this, $elf = self.clone();
  $elf.forward = (function (m) { m.type = "Method"; return m; })(function () { return self.proto["send:args:"](">=", [other]); });
  $elf["other"] = (other && other.type === "Array") ? other[0] : ((typeof other !== "undefined") ? other : nil);
  return self["send:args:"]("<=>", [$elf["send:"]("other")])["send:args:"]("==", [1])["send:args:"]("||", [self["send:args:"]("<=>", [$elf["send:"]("other")])["send:args:"]("==", [0])]);
})]]);

$elf["send:"]("Object")["send:args:"]("extend:", [[$elf["send:"]("traits")["send:"]("Comparable")]]);;