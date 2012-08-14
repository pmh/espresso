Person = Object clone

Person named: name := clone: { self name = name }

Person greet: person with: message :=
	"#{name} says: #{message}, #{person name}!" println


patrik = Person named: 'Patrik
dude   = Person named: 'Dude

patrik greet: dude with: "Hello"