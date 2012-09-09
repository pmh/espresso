Boolean type = "Boolean"

Boolean false? := `this.valueOf() === false`
Boolean true?  := `this.valueOf() === true`

Boolean if_true: blk := {
	`this["true?"]() ? blk[0]["send:"]("_call") : nil`
}

Boolean if_false: blk := {
  `this["false?"]() ? blk[0]["send:"]("_call") : nil`
}

Boolean if_true: true_branch if_false: false_branch := {
  `this["true?"]() ? true_branch[0]["_call"]() : false_branch[0]["_call"]()`
}

Boolean == other := `self == other`

Boolean to-s := self value-of