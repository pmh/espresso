var Espresso = require('./lib/espresso');

Espresso.compile("10", 'foo.es', 'number');
Espresso.ast.print_tree();