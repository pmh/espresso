`$elf = Object.create(EObject)`

Lobby = .$elf

Lobby unknown-slot: slot args: *args := nil

Lobby to-s := {
  slots = self map: { k | k }
  "Lobby\n  #{slots join: "\n  "}"
}

Object  = .EObject
Lambda  = .EFunction
Number  = .ENumber
String  = .EString
Array   = .EArray
Boolean = .EBoolean
RegExp  = .ERegex
nil     = .nil
traits  = Object clone