require: "lib/runtime"

Person := Object clone

Person named: name := {
  clone: { self name := name }
}

Person greet: person with: message := {
  "#{name} says: #{message}, #{person name}!" println
}

patrik := Person named: "Patrik"
dude   := Person named: "Dude"

dude greet: patrik with: "Hello"







