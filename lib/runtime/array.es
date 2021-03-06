Array type = "Array"

Array length := self.length

Array empty? := length == 0

Array join: separator := self.join(separator)

Array push: *elements := {
  elements each: { element |
    self.push(element)
  }
  self
}

Array each: block := {
  `for (var i = 0; i < this.length; i++) {`
    block call: self[i], .i
  `}`
  self
}

Array == other := { (join: ",") value-of == (other join: ",") value-of }
Array == other @{type == "Boolean"} := `this[other + "?"]`

Array extend: traits Enumerable

Array println := {
  `console.log(self["to-s"]())`
  self
}

Array to-s := {
  "[#{(map: { el | el to-s }) join: ", "}]"
}