var Espresso = require('./lib/espresso');

Espresso.compile('   23  ', 'foo.es');
Espresso.ast.print_tree();