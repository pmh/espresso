Person = Object clone

Person named: name := clone

Person greet: person with: message :=
  "#{name} says: #{message}, #{person}!" println

Person greet: person @{understands?: 'name} with: message :=
  greet: person name with: message


patrik = Person named: 'Patrik
dude   = Person named: 'Dude

patrik greet: dude    with: "Hello"
dude   greet: patrik  with: "Hello"
patrik greet: "World" with: "Hello"