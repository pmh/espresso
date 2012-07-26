var Espresso = require('./lib/espresso');

Espresso.parse(require("fs").readFileSync("./examples/HelloWorld.es", "utf8")).print_tree();

console.log('\n--------------------\n');

eval(Espresso.compileFile("./examples/HelloWorld.es"));