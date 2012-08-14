Array type = "Array"

Array length := `this.length`

Array empty? := length == 0

Array join: separator := `this.join(separator)`

Array push: *elements := {
  elements each: { element |
    `self.push($elf.element)`
  }
  self
}

Array each: block := {
  `for (var i = 0; i < this.length; i++) block[0]["call:"]([this[i], i])`
  `this`
}

Array extend: Enumerable

Array println := {
  "printin' arr"
  `console.log(self["to-s"]())`
  self
}

Array to-s := {
  "[#{(map: { el | el to-s }) join: ", "}]"
}