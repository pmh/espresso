Number type = "Number"

Number + lhs := `this + lhs`
Number - lhs := `this - lhs`
Number * lhs := `this * lhs`
Number / lhs := `this / lhs`

Number < lhs := `this < lhs`
Number > lhs := `this > lhs`

Number == other := `self == other`

Number <=> other := 
  (self == other) if_true: { 0 } if_false: { 
    (self < other) if_true: { 1 } if_false: { -1 }
  }

Number to-s := self value-of