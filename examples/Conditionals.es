
[true, false, nil, 'foo, 23, 0] each: { obj |
  obj if_true: {
    "#{obj} is true" println
  } if_false: {
    "#{obj} is false" println
  }
}

("Espresso" == "Espresso") if_true: { "Espresso equals Espresso!" println }

(true && true)  if_true:  { "true && true are true"   println }
(true && false) if_false: { "true && false are false" println }

nil   nil? println
"foo" nil? println