Greeter := Object clone

Greeter greet: name with: message := {
  "#{message}, #{name}!" println
}

Greeter greet: "World" with: "Hello"