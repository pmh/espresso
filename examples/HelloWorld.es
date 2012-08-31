Person = Object clone

Person named: name := clone

Person greet: name with: message :=
  "#{self name} says: #{message}, #{name}!" println

Person greet: person @{understands?: 'name} with: message :=
  greet: person name with: message


patrik = Person named: 'Patrik
dude   = Person named: 'Dude

patrik greet: dude    with: "Hello"
patrik greet: "World" with: "Hello"