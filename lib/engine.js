// Jade Client Template Engine wrapper for SocketStream 0.3
var jade = require('jade');
var pathlib = require('path');
var fs = require('fs');

exports.init = function(root, config) {

  // Set global/window variable used to access templates from the browser
  var namespace = config && config.namespace || 'JT';
  var self      = config && config.self      || false;
  var debug     = config && config.debug ? config.debug : false;

  var jadeRuntimePath = pathlib.join(__dirname, '/../node_modules/jade/jade.'+ (debug ? '' : 'min.') + 'js');
  var clientCode      = fs.readFileSync(jadeRuntimePath, 'utf8');
  root.client.send('lib', 'clientjade-template', clientCode, {minified: !debug});

  return {

    name: 'Jade',

    selectFormatter: function(path, formatters, defaultFormatter){
        if (pathlib.extname(path).toLowerCase() === '.jade') {
            return false;
        }
        return defaultFormatter;
    },

    // Opening code to use when a template is called for the first time
    prefix: function() {
      return ['<script type="text/javascript">',
        'if(!window.' + namespace + '){window.' + namespace + ' = {};}',
        '(function(){'
      ].join("\n");
    },

    // Closing code once all templates have been written into the <script> tag
    suffix: function() {
      return ['})();',
        '</script>'
      ].join("\n");
    },

    // Compile template into a function and attach to window.<windowVar>
    process: function(template, path, id) {
      var options = { 
          compileDebug : config && config.debug !== undefined ? config.debug : false, 
          client       : true,
          filename     : path,
          self         : self
      };
      var compiledTemplate = (jade.compile(template, options)+"")
        .split('attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;')
        .join('attrs = jade.runtime.attrs; escape = jade.runtime.escape; rethrow = jade.runtime.rethrow; merge = jade.runtime.merge;');

      return '\nwindow.' + namespace + '[\'' + id + '\'] = (' + compiledTemplate + ');\n';    
    }
  };
};