define(function(require, exports, module) {

var completeUtil = require("plugins/c9.ide.language/complete_util");
var baseLanguageHandler = require('plugins/c9.ide.language/base_handler');
var parser = require("treehugger/js/parse");
var tree = require('treehugger/tree');
var worker = require("plugins/c9.ide.language/worker");

var completer = module.exports = Object.create(baseLanguageHandler);

completer.handlesLanguage = function(language) {
    return language == "plugins/ethergit.solidity.language/solidity_mode";
};

completer.getCompletionRegex = function() {
    return (/^[\.]$/);
};

completer.updateTime = 0;

completer.onUpdate = function(doc,callback) {
  var timeNow = new Date().getTime();

  if( (timeNow - completer.updateTime) > 15000) { //5sec
    completer.updateTime = timeNow;

    worker.sender.emit('docParse', { code: doc.$lines.join('\n') });

    worker.sender.on("astParsed", function(e) {
      if (e.data.err != null) {
  	  console.log("oops!", e.data.err.message);
	  callback();
      }

      completer.ast = e.data.ast;
      callback();
    });
  }
  callback();
};

completer.onDocumentOpen = function(path, doc, oldPath, callback) {
  worker.sender.emit('docParse', { code: doc.$lines.join('\n') });

  worker.sender.on("astParsed", function(e) {
    if (e.data.err != null) {
	console.log("oops!", e.data.err.message);
	callback();
    }

    completer.ast = e.data.ast;
    callback();
  });
};

completer.complete = function(doc, fullAst, pos, currentNode, callback) {
  console.log('ast', completer.ast);
  //TODO completion logic...
  callback([{ id: "test", name: "solidity_ast_parse_test", replaceText: "Success!", icon: "package" }]);
};

});
