String type = "String"

String println := {
  .console.log(self to-s)
  self
}

String to-s  := self value-of
String + str := `self + str["to-s"]()`

String value-of := .this.valueOf()

String match: regex := `self.match(regex[0]) || nil`