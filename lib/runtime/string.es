String type = "String"

String println := {
  .console.log(self to-s)
  self
}

String to-s  := self value-of
String + str := `self + str["to-s"]()`

String == other := `other == true ? true : self == other`

String <=> other :=
  (self == other) if_true: { 0 } if_false: { 
    ((self length) < (other length)) if_true: { 1 } if_false: { -1 }
  }

String value-of := .this.valueOf()

String match: regex := `self.match(regex[0]) || nil`