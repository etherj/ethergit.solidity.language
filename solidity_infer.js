define(function(require, exports, module) {

var completeUtil = require("plugins/c9.ide.language/complete_util");
var baseLanguageHandler = require('plugins/c9.ide.language/base_handler');
var parser = require("treehugger/js/parse");
var tree = require('treehugger/tree');

var completer = module.exports = Object.create(baseLanguageHandler);
 
completer.parse = function(code, callback) {
    var result;
    try {
        code = code.replace(/^(#!.*\n)/, "//$1");
        result = parser.parse(code);
        traverse.addParentPointers(result);
    } catch (e) {
        result = null;
    }
console.log(" SDFDSFSDFSDFDSF ", result );    
console.log(" SDFDSFSDFSDFDSF ", code );    
    callback(result);
};


completer.isParsingSupported = function() {
    return true;
}; 

completer.findNode = function(ast, pos, callback) {
    var treePos = { line: pos.row, col: pos.column };
    callback(ast.findNode(treePos));
};

completer.getPos = function(node, callback) {
    callback(node.getPos());
};

completer.handlesLanguage = function(language) {
    return language == "plugins/ethergit.solidity.language/solidity_mode";
};

completer.getCompletionRegex = function() {
    return (/^[\.]$/);
};

completer.complete = function(doc, fullAst, pos, currentNode, callback) {
	//TODO
//console.log(doc);
var ast = parser.parse(doc);
console.log(fullAst, ast);
console.log("Testing");
};

});
