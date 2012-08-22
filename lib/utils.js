/*
Copyright (C) 2012 by Jonathan Brachthäuser (http://b-studios.de)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, 
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES 
OR OTHERLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var util = require('util');

module.exports = {
  // makes shure, that the element is an array
  // is needed, as we don't have the ...operator
  assure_array: function(el) {
    if(el instanceof Array) 
      return el;
    else
      return [el];
  },

  join: function() {
    return Array.prototype.join.call(arguments, '');
  },

  join_nl: function() {
    return Array.prototype.join.call(arguments, '\n');
  },

  force_block: function(input) {
    input = input || '';
    if(input[0] === '{' && input[input.length -1 ] === '}')
      return input;
    else 
      return ['{', input, '}'].join('');
  },

  // Got major trouble with this. Because
  // "\"" is being double escaped...
  escape_string: function(str) {
    
    var str = String(str),
        result = [],
        len = str.length,
        escaped = false;
    
    for(var i=0; i < len; i++) {
      
      var character = str.charAt(i);
      
      if(escaped) {
        escaped = false;
      } else {
        // starting escape sequence
        if(character === "\\")
          escaped = true;
        
        else if(character === '"')
          result.push("\\");
      }
      result.push(character);
    }
    return result.join('');
  },

  /**
   * Recursivly prints the tree with intendation
   * To print a tree, it needs to be in the JsonML-Format
   * i.e. `['nodename', { properties }, ...children]`
   *
   * @return [String] the formatted tree
   */
  print_tree: function(tree, opts) {
  
    opts = opts || {};

    var in_level = [''],
        indent   = opts.indent || "  ",
        result   = [];
    
    function print_node(node) {
      
      result.push(in_level.join(indent));

      if(node === undefined) {        
        result.push('undefined');
        return;
      }

      var node_name = node[0],
          props     = util.inspect(node[1], false, null);

      result.push(node_name, " ", props);

      // there are childnodes
      if(node.length > 2) {
        in_level.push('');
        for(var i=2,len=node.length; i<len; i++) {
          result.push("\n");
          print_node(node[i]);      
        }
        in_level.pop();
      }
    }

    print_node(tree);

    return result.join("");
  },

  to_string: function(tree) {

    var result = [];

    function print_node(node) {
      
      // don't transform undefined-values
      if(node === undefined) {        
        result.push('undefined');
        return;
      }

      var node_name = node[0],
          props     = util.inspect(node[1], false, null);

      result.push('["', node_name, '", ', props);

      // there are childnodes
      if(node.length > 2) {
        for(var i=2,len=node.length; i<len; i++) {
          result.push(',');
          print_node(node[i]);      
        }
      }
      result.push(']');
    }

    print_node(tree);

    return result.join("");
  }
}
