Enumerable = Object clone

Enumerable map: block := {
  res = []
  each: { *args | res push: (block apply: args) }
  res
}