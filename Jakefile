var espresso = Object.create(require("./index"))
  , fs       = require("fs");

task("compile_runtime", function() {
  fs.writeFileSync("lib/runtime.js", espresso.compileFile("lib/runtime.es", { skip_runtime: true }));
});