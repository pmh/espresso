nil if_true:  blk := nil
nil if_false: blk := blk call

nil if_true: _ if_false: blk := blk call

nil true?  = false
nil false? = true
nil nil? = true

nil to-s := type value-of
nil println := nil to-s println

nil type = "nil"

nil toString := nil to-s
nil inspect  := nil to-s