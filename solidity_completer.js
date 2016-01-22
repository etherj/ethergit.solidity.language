define(function(require, exports, module) {
  var completeUtil = require("plugins/c9.ide.language/complete_util");
  var baseLanguageHandler = require('plugins/c9.ide.language/base_handler');
  
  var solSnippets = {
    "sol_contract": "contract MyContract {^^};",
    "sol_bytes32": "bytes32 myNewBytes = \"^^\";",
    "sol_address": "address myNewAddress = \"^^\";",
    "sol_int": "int myNewInt = \"^^\";",
    "sol_function": "function myNewFunction(uint args) {^^}"
  };
  
  var solExplain = {
    "sol_contract": "This creates a new contract.",
    "sol_bytes32": "This creates a new bytes32 object.",
    "sol_address": "This creates a new address.",
    "sol_int": "This creates a new int.",
    "sol_function": "This creates a new function."
  };

  var solName = {
    "sol_contract": "Contract",
    "sol_bytes32": "Bytes32",
    "sol_address": "Address",
    "sol_int": "Int",
    "sol_function": "Function"
  };
 
  var completer = module.exports = Object.create(baseLanguageHandler);
  
  completer.handlesLanguage = function(language) {
    return language == "plugins/ethergit.solidity.language/solidity_mode";
  };

  completer.complete = function(doc, fullAst, pos, currentNode, callback) {
    var line = doc.getLine(pos.row);
    var identifier = completeUtil.retrievePrecedingIdentifier(line, pos.column);
    var allIdentifiers = Object.keys(solSnippets);
    var matches = completeUtil.findCompletions(identifier, allIdentifiers);
    callback(matches.map(function(m) {
      return {
        name: solName[m],
        replaceText: solSnippets[m],
        doc: "<pre>" + solSnippets[m].replace("\^\^", "&#9251;").replace(/</g, "&lt;") + "\n\n" + solExplain[m] + "</pre>",
        icon: "package",
        meta: ".sol snippet",
        priority: 2,
	isGeneric: true
      };
    }));
  };


});
