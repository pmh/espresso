Enumerable = Object clone

Enumerable map: block := {
  res = []
  self each: { *args | res push: (block apply: args) }
  res
}