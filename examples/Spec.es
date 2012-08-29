// Demonstrates the use of unknown-slot:args: to construct an expressive, but barebones, bdd library

Spec = Object clone

Spec suite = Object clone
Spec suite unknown-slot: slot args: *args := {
  _it = clone
  _it desc = [slot]
  _it unknown-slot: slot args: *args := {
    (slot type == "Lambda") if_true: {
      "  - #{(desc join: " ")} #{slot call-as: self}" println
    } if_false: {
      desc push: slot
    }
    _it
  }
  _it
}

Spec suite unknown-slot: slot @{understands?: 'call} args: *args := {
  slot call-as: self
}

Spec unknown-slot: slot args: *args := {
  slot println
  suite
}

Matcher = Object clone

Matcher with-context: ctx := clone: { self ctx = ctx }

Matcher == other :=
  (ctx == other) if_true: { "# PASS" } if_false: { throw:  "ExpectationFailure: expected: '#{ctx}' to equal '#{other}'" }

Object should := Matcher with-context: self

describe := {
  Spec clone
}

// Usage:

Espresso = Object clone
['expressive?, 'flexible?, 'awesome?] each: { slot | Espresso set: slot to: true }


describe espresso {
  it is expressive {
    Espresso expressive? should == true
  }

  it is flexible {
    Espresso flexible? should == true
  }

  but is it awesome? {
    Espresso awesome? should == true
  }
}