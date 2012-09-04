Number fib := {
  self match: {
    when: 0 do: 0
    when: 1 do: 1
    when: _ do: { (self - 1) fib + (self - 2) fib }
  }
}

8 times: @{ fib println }