Object type = "Object"

Object each: iterator := {
  self slots each: { slot |
    iterator call: slot, (self get: slot)
  }
}

Object get: slot := {
  slot = lookup: slot
  `if ($elf.slot && $elf.slot.type === "Method") { $elf.slot.type = "Lambda" ; $elf.slot.__context = this }`
  slot
}

Object slots := {
  slots = []
  `for (var slot in self) if (self.hasOwnProperty(slot)) $elf.slots.push(slot);`
  slots
}

Object values := {
  self map: { k, v | v }
}

Object delegates = [Lobby]
Object extend:   delegate := self delegates push: delegate
Object unextend: delegate := {
  `for (var i = 0; i < self.delegates.length; i++) if (self.delegates[i] === delegate[0]) self.delegates = self.delegates.slice(i-1, i);`
  nil
}

Object unknown-slot: slot args: args := nil

Object == expr := `this === $elf.expr`
Object == expr @{type == "Boolean"} := `this[expr + "?"]`

Object if_true:  blk := blk call
Object if_false: blk := nil

Object if_true:  blk if_false: _ := blk call

Object true?  = true
Object false? = false
Object nil?   = false

Object extend: traits Enumerable

Object to-s := {
  "<#{type} [#{(self map: { k | k }) join: ", "}]>"
}

Object value-of := self.valueOf()

Object println := {
  .console.log(self to-s)
  self
}

Object && other := {
  self if_true: {
    other if_true: { true } if_false: { false }
  } if_false: {
    false
  }
}

Object || other := {
  self if_true: {
    self
  } if_false: {
    other if_true: { other } if_false: { false }
  }
}

Object proto = nil

Object inherits?: object := {
  (self proto) if_true: {
    (self proto == object) || forward
  } if_false: { false }
}

Object understands?: message := {
  slot = self lookup: message
  `typeof $elf.slot == "undefined" ? false : true`
}

Object throw: message := {
  `throw message`
  nil
}

Object replace-delegate: original with: delegate := {
  self unextend: original
  self   extend: delegate
}

Object perform: selector := {
  self send: selector
}

Object perform: selector args: *args := {
  self["send:args:"](selector, args)
}

Object delete: slot := { `delete this[slot]` ; nil }

traits Match = Object clone

traits Match _ = true

traits Match when: pred do: blk := {
  pred = ((pred type == "Array") if_true: { [pred] } if_false: { pred value-of })
  self matchers push: clone
}

Object match: blk := {
  matcher = traits Match clone: @{ matchers = [] }
  matcher extend: self
  matchers = (blk call: matcher as: matcher)
  matchers each: { match |
    (self value-of == match pred value-of) if_true: {
      return! (match blk understands?: 'call) if_true: { match blk call: self } if_false: { match blk }
    }
  }
}