Dying = Object clone

Dying hide := {
  self replace-delegate: Dying with: Healthy
}

Dying attack: other := {
  "Hey, I'm dying over here, I'm not about to attack no #{other name} in this condition!" println
}