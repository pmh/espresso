# Espresso

Espresson is an experimental dynamic, prototype-based, object-oriented programming language that compiles down to JavaScript.

While it is object-oriented it's still very different from most modern languages, for instance you won't find any classes or variables, instead there are only objects and slots, even lexical scope is implemented entirely in terms of language primitives.

The way you communicate with objects in Espresso is by sending messages of which there are three kinds: unary, binary and keyword.

Espresso also has, although currently very limited, support for predicate dispatch.

## Install

`npm install espresso-language`

Note: This requires that you have nodejs v0.8.8 and npm installed already.

## Hello, world!

So, let's look att how Epresso works. We'll start with the ever present Hello, world:

    "Hello, world!" println //=> "Hello, world!"

Here we are sending the unary message `println` to a string object containing `Hello, world!`. In this case, since println is a method, it results in a method call but it could just as well have been a regular slot access and it would have looked just the same.

Now, let's expand this example and introduce a few more concepts:

    Greeter = Object clone
    Greeter greet: name with: message := {
      "#{message}, #{name}!" println
    }
    
    Greeter greet: "world" with: "Hello" //=> "Hello, world!"

We begin by sending the `clone` message to the prototypical `Object` object, this returns a brand new object who's prototype points to `Object` and then assign it to `Greeter`.
Next we define the `greet:with:` message on `Greeter`, the := operator signifies to the compiler that this should be treated as a method.
Finally we send the `greet:with:` message to the `Greeter` object.
One thing you may note is that the name of this message and it's arguments are mixed togheter, this is called a keyword message, but the name actually is `greet:with:` and you can validate this by asking `Greeter` for a reference to it rather than executing it, like so:

  greet = Greeter get: 'greet:with:
  greet call: "world", "Hello" //=> "Hello, world!"

The `get:` message returns a method reference that we can `call:`. It takes a variadic number of arguments and will by default execute in the context of it's original receiver, in this case Greeter, though you can override that choice by sending the `call:as:` message instead.

Now, you may be wondering about `Greeter` and `greet` since I earlier told you that there are no variables in Espresso, but they sure do look like variables don't they? Well, actually they are slots on an object, in this case the top-level object `Lobby`.

    Lobby println // => Lobby
                          Lobby
                          type
                          unknown-slot:args:
                          to-s
                          Object
                          Lambda
                          Number
                          String
                          Array
                          Boolean
                          RegExp
                          nil
                          traits
                      >>> Greeter
                      >>> greet

With that out of the way, let's return to our friend the Greeter and extend it further:

    Greeter = Object clone
    Greeter greet: someone with: message := {
      "#{name} says: #{message}, #{someone name}" println
    }
    
    g1 = Greeter clone: @{ name = "G1" }
    g2 = Greeter clone: @{ name = "G2" }
    
    g1 greet: g2 with: "Hello" //=> "G1 says: Hello, G2!"

What we see here is a common architectural technique in prototype based languages, namely separating data from behavior. Our prototypical Greeter object depends on a name slot being defined but it never defines it rather it expects that any object which clones it does, in this case that would be g1 and g2.

As you can see, g1 can now greet g2 with a nice message. But there's a slight problem here, and that is, our `greet:with:` method is very specific in that it requires it's first argument to be an object with a name slot. What if we wanted it to call it with a string instead?

    g1 greet: "world" with: "Hello" //=> "g1 says: Hello, nil!"

Hmm, not exactly what we wanted. Now we could solve that using a conditional inside the `greet:with:` method but then it wouldn't be possible to extend it further without changing that method. This is where predicate dispatch comes in handy:

    Greeter greet: someone with: message := {
      "#{name} says: #{message}, #{someone}!" println
    }
    
    Greeter greet: someone @{understands?: 'name} with: message := {
      greet: someone name with: message
    }
    
    
    g1 greet: "world" with: "Hello" //=> "P1 says: Hello, world!"
    g1 greet: g2      with: "Hello" //=> "P1 says: Hello, P2!"

Now we have two implementations of `greet:with:` a specific one which requires a named object and a general one that accepts any object. The great thing about this is that it can be extended further, even by third party code, without needing to change the original definition. 