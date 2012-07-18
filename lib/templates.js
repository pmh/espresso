var join         = require('./utils.js').join
  , join_nl      = require('./utils.js').join_nl
  , escape       = require('./utils.js').escape_string;

module.exports = function (_) {
  return {
    // Templates

    File: function (attr, exprs) {
      return exprs.map(this.implicit_self).join(';\n');
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
      var params = args.slice(2).map(function (Id) {
        var name = Id.value();
        return join('$elf["', name, '"] = ', name, ';');
      }).join(' ');

      return join_nl(
        'function (' + _.translate(args) + ') {',
          this.indent('var self = this, $elf = self.clone();') +
          (params.length !== 0 ? ('\n' + this.indent(params)) : '') +
          (body.length   !== 0 ? ('\n' + this.indent(body))   : ''),
        '}'
      );
    },

    FunArgs: function (attr, args) {
      return args.join(', ');
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
      if (message.hasType("KeywordMsg") || message.hasType("BinaryMsg"))
        return join(receiver, _.translate(message));
      else
        return join(receiver, '["send:"]("', _.translate(message), '")');
    },

    KeywordMsg: function (attr, args) {
      return join('["send:args:"]("', attr.name(), '"', ', [', args.map(this.implicit_self).join(', ') , '])');
    },

    BinaryMsg: function (attr, operand) {
      return join('["send:args:"]("', attr.operator(), '"', ', [', this.implicit_self(operand) , '])');
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
        
        // does not end with }
        if(!cs[i].match(/}$/))
          output.push(cs[i] + ';');
        else
          output.push(cs[i]);
      }

      return output.join('\n');
    }
  }
};