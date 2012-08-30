RegExp type = "RegExp"

RegExp to-s := "<RegExp #{self}>"

RegExp == other := `self.toString() == other.toString()`