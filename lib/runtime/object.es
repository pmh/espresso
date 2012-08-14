Object type = "Object"

Object each: iterator := {
  self slots each: { slot |
    iterator call: slot, (self get: slot)
  }
}

Object get: slot := {
  slot = lookup: slot
  `if ($elf.slot.type === "Method") $elf.slot.type = "Method Object"`
  slot
}

Object slots := {
  slots = []
  `for (var slot in self) if (self.hasOwnProperty(slot)) $elf.slots.push(slot);`
  slots
}

Object delegates = []
Object extend:   delegate := self delegates push: delegate
Object unextend: delegate := {
  `for (var i = 0; i < self.delegates.length; i++) if (self.delegates[i] === delegate[0]) self.delegates = self.delegates.slice(i-1, i);`
  nil
}
Object unknown-slot: slot args: args := nil

Object == expr := `this.valueOf() === $elf.expr.valueOf()`

Object if_true:  blk := blk call: nil
Object if_false: blk := nil

Object if_true:  blk if_false: _ := blk call: nil

Object true?  = true
Object false? = false
Object nil?   = false

Object extend: Enumerable

Object to-s := {
  slots = []
  self each: { k, v | 
    slots push: "#{k} => #{v type}" 
  }
  "<#{type} [\"#{(slots) join: "\", \""}\"]>"
}

Object println := {
  `console.log(this["to-s"]())`
  self
}
