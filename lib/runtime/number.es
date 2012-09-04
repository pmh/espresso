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

Number times: blk current-count: i := {
  self
}

Number times: blk current-count: i @{ <= self } := {
  blk call: i + 1
  self times: blk current-count: i + 1
}

Number times: blk := {
  self times: blk current-count: 0
}

Number to-s := self value-of