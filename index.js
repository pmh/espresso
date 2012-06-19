var Espresso = require('./lib/espresso');

Espresso.compile("foobar", 'foo.es');
Espresso.ast.print_tree();