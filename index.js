var Espresso = require('./lib/espresso');

Espresso.parse(require("fs").readFileSync("./examples/HelloWorld.es", "utf8")).print_tree();