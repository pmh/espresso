Lambda type = "Lambda"

Lambda call := self.call(__context)
Lambda call-as: ctx := self.call(ctx)
Lambda call: *args := self.apply(__context, args)
Lambda call: *args as: ctx := self.apply(ctx, args)

Lambda apply: args := self.apply(__context, args)
Lambda apply: args as: ctx := self.apply(ctx, args)

Lambda to-s := "<#{type}>"

Lambda == other := `self.toString() == other.toString()`
Lambda == expr @{type == "Boolean"} := `this[expr + "?"]`