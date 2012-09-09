traits Comparable = Object clone

traits Comparable == other :=  (self <=> other) == 0
traits Comparable != other :=  (self <=> other) == -1
traits Comparable <  other :=  (self <=> other) == -1
traits Comparable <= other := ((self <=> other) == 1) || ((self <=> other) == 0)
traits Comparable >  other :=  (self <=> other) == 1
traits Comparable >= other := ((self <=> other) == 1) || ((self <=> other) == 0)

Object extend: traits Comparable