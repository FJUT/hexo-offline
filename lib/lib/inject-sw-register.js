'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = _fs2.default.readFileSync(_path2.default.join(__dirname, './template.js'), 'utf-8');

var helperSWRegister = function helperSWRegister() {
  var registerContent = template.replace('__workerName__', _constants.workerName);
  return `<script>${registerContent}</script>`;
};

var injectSWRegisterWithContent = function injectSWRegisterWithContent(script) {
  return function (publicDir) {
    var indexHTMLPath = _path2.default.join(publicDir, 'index.html');

    // early return when no index.html presets in public directory
    if (!_fs2.default.existsSync(indexHTMLPath)) {
      return;
    }

    var fileContent = _fs2.default.readFileSync(indexHTMLPath, 'utf-8');

    // early return if it has been injected before
    if (fileContent.includes(_constants.workerName)) {
      return;
    }

    var injectedContent = fileContent.replace(/<\/body>\s*<\/html>\s*$/, `${script}</body></html>`);
    _fs2.default.writeFileSync(indexHTMLPath, injectedContent);
  };
};

exports.default = injectSWRegisterWithContent(helperSWRegister());