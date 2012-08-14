String type = "String"

String println := {
  `console.log(self["to-s"]())`
  self
}

String to-s := `self.valueOf()`
String + str := `self + str["to-s"]()`

String match: regex := `self.match(regex[0]) || nil`