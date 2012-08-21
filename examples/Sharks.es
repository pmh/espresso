require: "examples/shark-roles/Healthy"
require: "examples/shark-roles/Dying"

Shark = Object clone
Shark extend: Healthy

goblin = Shark clone
goblin name = "Goblin Shark"

lemon = Shark clone
lemon name = "Lemon Shark"

goblin attack: lemon
lemon  attack: goblin

lemon hide
lemon  attack: goblin
goblin attack: lemon