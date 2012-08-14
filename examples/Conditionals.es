
[true, false, nil, 'foo, 23, 0] each: { obj |
  obj if_true: {
    "#{obj} is true" println
  } if_false: {
    "#{obj} is false" println
  }
}

("Espresso" == "Espresso") if_true: { "Espresso equals Espresso!" println }

nil   nil? println
"foo" nil? println