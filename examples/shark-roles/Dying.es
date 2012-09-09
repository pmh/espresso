Dying = Object clone

Dying hide := {
  "#{name}: hidin' n healin'" println
  self replace-delegate: Dying with: Healthy
}

Dying attack: other := {
  "#{name}: Hey, I'm dying over here, I'm not about to attack no #{other name}!" println
}