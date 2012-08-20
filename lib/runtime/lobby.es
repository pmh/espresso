`$elf = Object.create(EObject)`

Lobby = .$elf
Lobby to-s := {
  slots = self map: { k | k }
  "Lobby\n  #{slots join: "\n  "}"
}

Lobby   = .$elf
Object  = .EObject
Lambda  = .EFunction
Number  = .ENumber
String  = .EString
Array   = .EArray
Boolean = .EBoolean
RegExp  = .ERegex
nil     = .nil
