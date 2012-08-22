// The Strategy pattern in Espresso

traits OpenedFile = Object clone

traits OpenedFile read: n := "reading #{n} bytes from #{filename}" println

traits OpenedFile close := {
  self replace-delegate: traits OpenedFile with: traits ClosedFile
  "closing file: #{filename}" println
}



traits ClosedFile = Object clone

traits ClosedFile open: filename := {
  self filename = filename
  self replace-delegate: traits ClosedFile with: traits OpenedFile
  "opening file: #{filename}" println
}

File = Object clone: {
  self filename = nil
}
File extend: traits ClosedFile

file = File clone
file open: "foo.es"
file read: 1024
file close
