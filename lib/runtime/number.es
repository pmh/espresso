Number type = "Number"

Number + lhs := `this + lhs`
Number - lhs := `this - lhs`
Number * lhs := `this * lhs`
Number / lhs := `this / lhs`

Number println := {
  `console.log(this["to-s"]())`
}

Number to-s := `this.valueOf()`