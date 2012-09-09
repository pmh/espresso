
traits Point = Object clone
traits Point print := "#{type} => x: #{x}, y: #{y}" println

Point = traits Point clone: @{
  x = 23
  y = 12
}

ComputedPoint = traits Point clone: @{
  x := 23 + 100
  y := x - 10
}

point = Point clone
point print

computed = ComputedPoint clone
computed print