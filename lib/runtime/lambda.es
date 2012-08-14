Lambda type = "Lambda"

Lambda call := `this.call(this.__context)`
Lambda call-with: ctx := `this.call($elf.ctx)`
Lambda call: *args := `this.apply(this.__context, args)`
Lambda call: *args with-context: ctx := `this.apply($elf.ctx, args)`

Lambda apply: args := `this.apply(this.__context, $elf.args)`
Lambda apply: args with-context: ctx := `this.apply($elf.ctx, $elf.args)`

Lambda to-s := "<#{type}>"

Lambda println := `console.log(this["to-s"]())`