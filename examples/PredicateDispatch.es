Foo = Object clone
Bar = Foo clone

Foo foo: bar                       := "none of the above!"    println
Foo foo: bar @{ type == "Object" } := "it's an Object!"       println
Foo foo: bar @{ type == "Foo"    } := "it's a Foo!" println
Foo foo: bar @{ inherits?: Foo   } := "it inherits from Foo!"  println

Foo foo: ""
Foo foo: Object
Foo foo: Foo
Foo foo: Bar

Foo + other := "Adding foo to foo gives: 2(foo)" println
Foo + other @{ type == "Bar" } := "Adding bar to foo gives: foobar" println

Foo + Foo
Foo + Bar