
traits Point = Object clone: {
  self print := "#{type} => x: #{x}, y: #{y}" println
}

Point = traits Point clone: {
  self x = 23
  self y = 12
}

ComputedPoint = traits Point clone: {
  self x := 23 + 100
  self y := x - 10
}

point = Point clone
point print

computed = ComputedPoint clone
computed print