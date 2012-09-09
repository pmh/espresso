// The Strategy pattern in Espresso

traits OpenedFile = Object clone

traits OpenedFile read: n := "reading #{n} bytes from #{filename}" println

traits OpenedFile close := {
  "closing file: #{filename}" println
  self replace-delegate: traits OpenedFile with: traits ClosedFile
}

traits ClosedFile = Object clone

traits ClosedFile open: filename := {
  self filename = filename
  "opening file: #{filename}" println
  self replace-delegate: traits ClosedFile with: traits OpenedFile
}

File = Object clone

File extend: traits ClosedFile

file = File clone

file read: 1024
file close
file open: "foo.es"
file read: 1024
file close