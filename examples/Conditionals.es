
[true, false, nil, 'foo, 23, 0] each: { obj |
  obj if_true:  { "#{obj} is true"  println }
  obj if_false: { "#{obj} is false" println }
}

("Espresso" == "Espresso") if_true: { "Espresso equals Espresso!" println }

(true && true)  if_true:  { "true && true  == true"  println }
(true && false) if_false: { "true && false == false" println }

nil   nil? println
"foo" nil? println

(1 < 2) if_true: { "one is less than two"    println }
(2 > 1) if_true: { "two is greater than one" println }