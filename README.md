Espresso is a minimalistic prototype-based Object-Oriented programming language that compiles to JavaScript.
It's main goal is to be as expressive and flexible as possible while keeping it's core small, simple and consistent.
Espresso makes a number of choices that aren't common in most other OO-languages, for example, classes are replaced with prototypes, variables with slots and statements with expressions.

More documentation will come as it get's closer to a first release, but in the meantime here's a basic example:

```
// traits is just a predefined object for namespacing Trait objects

traits Point = Object clone
traits Point print := "#{type} => x: #{x}, y: #{y}" println

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
```

More examples can be found in the examples/ folder.
To try them out, clone this repository and cd into it and run:

`./bin/esc examples/<filename>.es`

or just play with the repl:

`./bin/esc`