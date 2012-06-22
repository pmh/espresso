var Espresso = require('./lib/espresso');

Espresso.compile('"foo #{"bar"} baz #{10}"', 'foo.es');
Espresso.ast.print_tree();