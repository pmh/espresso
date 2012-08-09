var join         = require('./utils.js').join
  , join_nl      = require('./utils.js').join_nl
  , escape       = require('./utils.js').escape_string;

module.exports = function (_) {
  return {
    // Templates

    File: function (attr, exprs) {
      return exprs.map(this.implicit_self).join(';\n\n');
    },

    Require: function (attr) {
      // TODO: We should probably generalize this and make it openly extendable 
      // so that languages other than es and js may be supported.
      try {
        var path = attr.path(), ext = {es: "es", js: "js"}[path.split(".").pop()];
        if (ext === "js")
          return '`$js$`' + require("fs").readFileSync(path, 'utf8')
        else
          return require('./espresso').compileFile(ext ? path : (path + ".es"), { skip_runtime: true });
      } catch (ex) {
        console.log(ex.toString());
      }
    },
    
    Id: function (attr) {
      return attr.value();
    },
    
    Number: function (attr) {
      return attr.value().toString();
    },
    
    String: function (attr) {
      return join('"', escape(attr.value()).replace(/\n/g, '\\n'), '"');
    },

    StringExpr: function (attr, exprs) {
      return join('[', exprs.map(this.implicit_self).join(', '), '].join("")');
    },

    Array: function (attr, exprs) {
      return join('[', exprs.map(this.implicit_self).join(', '), ']');
    },
    
    RegExp: function (attr) { 
      return join('/', attr.body(), '/', attr.flags());
    },

    RawJS: function (attr) {
      // This is really ugly but we need a way to distinguish raw javascript in implicit_self.
      // This is one of the reasons why we would like to implicitly add self in an earlier pass instead. 
      return join('`$js$`', attr.value());
    },

    Lambda: function (attr, args, body) {

      var params = args.slice(2).map(function (node) {
        if (node.hasType("VarArg")) {
          var name = node[2].value();
          return join('$elf["', name, '"] = ', name, ';');          
        } else {
          var name = node.value();
          return join('$elf["', name, '"] = (', name, ' && ', name, '.type === "Array") ? ', name, '[0] : ((typeof ', name, ' !== "undefined") ? ', name, ' : nil);')
        }
      }).join(' ');

      return join_nl(
        '(function (ctx, fn) { fn.__context = ctx; return fn; })($elf, function (' + _.translate(args) + ') {',
          this.indent('var $elf = this.clone();') +
          (params.length !== 0 ? ('\n' + this.indent(params)) : '') +
          (body.length   !== 0 ? ('\n' + this.indent(body))   : ''),
        '})'
      );
    },

    Method: function (attr, args, body) {

      var params = args.slice(2).map(function (node) {
        if (node.hasType("VarArg")) {
          var name = node[2].value();
          return join('$elf["', name, '"] = ', name, ';');          
        } else {
          var name = node.value();
          return join('$elf["', name, '"] = (', name, ' && ', name, '.type === "Array") ? ', name, '[0] : ((typeof ', name, ' !== "undefined") ? ', name, ' : nil);');
        }
      }).join(' ');

      return join_nl(
        '(function (' + _.translate(args) + ') {',
          this.indent('var self = this, $elf = self.clone();') +
          (params.length !== 0 ? ('\n' + this.indent(params)) : '') +
          (body.length   !== 0 ? ('\n' + this.indent(body))   : ''),
        '})'
      );
    },

    FunArgs: function (attr, args) {
      return args.join(', ');
    },

    VarArg: function (attr, arg) {
      return arg.value();
    },

    FunBody: function (attr, exprs) {
      exprs = exprs.map(this.implicit_self);
      var last = exprs.pop();
      if (exprs.length !== 0)
        return this.join_sc(exprs) + '\nreturn ' + (last || 'nil') + ';';
      else
        return 'return ' + (last || 'nil') + ';';
    },

    UnaryMsg: function (attr, receiver, message) {
      if (message.hasType("KeywordMsg") || message.hasType("BinaryMsg") || message.hasType("AssignMsg") || message.hasType("MethodDef"))
        return join(receiver, _.translate(message));
      else if (message.hasType("Number") || message.hasType("Lambda"))
        return join(receiver, '["send:"](', _.translate(message), ')');
      else
        return join(receiver, '["send:"]("', _.translate(message), '")');
    },

    KeywordMsg: function (attr, args) {
      return join('["send:args:"]("', attr.name(), '"', ', [', args.join(', ') , '])');
    },

    KeywordArg: function (attr, args) {
      return join('[', args.map(this.implicit_self).map(function (arg) { return arg }).join(', '), ']');
    },

    KeywordDef: function (attr, args) {
      return join('["send:args:"]("', attr.name(), '"', ', [', args.map(this.implicit_self).join(', ') , '])');
    },

    BinaryMsg: function (attr, operand) {
      return join('["send:args:"]("', attr.operator(), '"', ', [', this.implicit_self(operand) , '])');
    },

    AssignMsg: function (attr, id, expr) {
      return join('["send:args:"]("set:to:", ["', id.value(), '", ', this.implicit_self(_.translate(expr)) ,']',')')
    },

    MethodDef: function (attr, id, expr) {
      return join('["send:args:"]("set:to:", ["', id.value(), '", (function(body) { body.type = "Method"; return body; })(', this.implicit_self(expr) ,')]',')')
    },

    // Helpers

    implicit_self: function (compiled_expr) {
      // TODO: This is a temporary solution and should be done by 
      //       rewriting the ast instead.
      if (compiled_expr) {
        if (compiled_expr.match(/^\[\"send:args:\"\]/)) {
          return join("$elf", compiled_expr);
        } else if (compiled_expr.match(/^\`\$js\$\`/)) {
          return compiled_expr.replace(/^\`\$js\$\`/, '');
        } else if (compiled_expr.match(/^\$elf/)) {
          return compiled_expr;
        } else if (compiled_expr.match(/^(true|false)/)) {
          return compiled_expr;
        } else {
          return compiled_expr.replace(/^[a-zA-Z$_]+/, function (m) {
            if (!m.match(/self|function/)) {
              return '$elf["send:"]("' + m + '")';
            } else {
              return m;
            }
          });
        }
      } else {
        return compiled_expr;
      }
    },

    indent : function(source, opts) {

      opts = opts || {};
      
      function defaults(key, value) { if(typeof opts[key] == 'undefined') opts[key] = value; }
      
      defaults('width',      this.tab_width);
      defaults('first_line', true);
      
      var space = Array(opts.width+1).join(' ');
      return (opts.first_line ? space : '') + source.split('\n').join('\n' + space);
    },

    join_sc: function(cs) {

      var output = [];
          
      for(var i = 0; i < cs.length; i++) {
        
        // does not end with } or ;
        if(!cs[i].match(/}$/) && !cs[i].match(/;$/))
          output.push(cs[i] + ';');
        else
          output.push(cs[i]);
      }

      return output.join('\n');
    }
  }
};