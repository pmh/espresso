traits Enumerable = Object clone

traits Enumerable map: block := {
  res = []
  self each: { *args | res push: (block apply: args) }
  res
}