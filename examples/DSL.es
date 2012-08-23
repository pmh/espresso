describe = Object clone

describe unknown-slot: slot args: *args := {
  slot println
  obj = clone
  obj unknown-slot: slot args: *args := {
    matcher = Object clone
    matcher it = Object clone
    matcher it unknown-slot: slot args: *args := {
      "  - it #{slot}" println
    }
    slot call-as: matcher
  }
  obj
}

describe Espresso {
  it "is expressive"
  it "is flexible"
  it "is awesome"
}