// Demonstrates the use of unknown-slot:args: to construct an expressive, but barebones, bdd library

Spec = Object clone

Spec suite = Object clone
Spec suite unknown-slot: slot args: *args := {
  (slot type == "Lambda") if_true: {
    slot call-as: self
  } if_false: {
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

describe = Spec clone

// Usage:

Espresso = Object clone
['expressive?, 'flexible?, 'awesome?] each: { slot | Espresso set: slot to: true }


describe The-Espresso-Language {
  is it expressive? {
    Espresso expressive? should == true
  }

  is it flexible? {
    Espresso flexible? should == true
  }

  is it awesome? {
    Espresso awesome? should == true
  }
}