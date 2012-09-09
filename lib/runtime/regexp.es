RegExp type = "RegExp"

RegExp to-s := "<RegExp #{self}>"

RegExp == other := `self.toString() == other.toString()`
RegExp == expr @{type == "Boolean"} := `this[expr + "?"]`