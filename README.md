# Usage

Include this line in your app.js;

    ss.client.templateEngine.use(require('ss-clientjade'));

Templates are available in the JT global namespace, `var templateString = JT['path-to-templateName'](locals);` when templateName.jade is in client/templates/path/to/