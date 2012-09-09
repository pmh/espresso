arr = [1, 2, 3]

 arr each: { v, i | "#{i} => #{v}" println }
(arr map:  { v, i | v * i                  }) println

obj = Object clone
obj foo = "bar"
obj baz = "quux"

obj each: { k, v | "#{k} => #{v to-s}" println }

arr push: 1, 2, 3

arr println

(arr join: ", ") println