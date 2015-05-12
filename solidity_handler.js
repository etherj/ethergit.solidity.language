define(function(require, exports, module) {
    
var PluginBase = require("plugins/c9.ide.language.jsonalyzer/worker/jsonalyzer_base_handler");
var handler = module.exports = Object.create(PluginBase);
var util = require("plugins/c9.ide.language.jsonalyzer/worker/ctags/ctags_util");

handler.languages = ["plugins/ethergit.solidity.language/solidity_mode"];
handler.extensions = ["sol"];

handler.analyzeCurrent = function(path, doc, ast, options, callback) {
    var structure = {};
    
    doc.replace(/(?:^|\n)\s*function\s+(?!_)([^ \(:]+)/g, function(fullMatch, name, offset) {
        structure["_" + name] = [{
            row: util.getOffsetRow(doc, offset+40),
            kind: "method",
            guessFargs: true
        }];
    });
    doc.replace(/(?:^|\n)\s*contract\s+(?!_)([^{ \(:]+)/g, function(fullMatch, name, offset) {
        structure["_" + name] = [{
            row: util.getOffsetRow(doc, offset+20),
            kind: "event",
            guessFargs: true
        }];
    });
    doc.replace(/(?:^|\n)\s*bytes32\s+(?!_)([^ \(:]+)/g, function(fullMatch, name, offset) {
        structure["_" + name] = [{
            row: util.getOffsetRow(doc, offset+20),
            kind: "property",
            guessFargs: true
        }];
    });
    doc.replace(/(?:^|\n)\s*address\s+(?!_)([^ \(:]+)/g, function(fullMatch, name, offset) {
        structure["_" + name] = [{
            row: util.getOffsetRow(doc, offset+20),
            kind: "property",
            guessFargs: true
        }];
    });
    doc.replace(/(?:^|\n)\s*uint\s+(?!_)([^ \(:]+)/g, function(fullMatch, name, offset) {
        structure["_" + name] = [{
            row: util.getOffsetRow(doc, offset+20),
            kind: "property",
            guessFargs: true
        }];
    });
    var errors = [{
        pos: { sl: 0, sc: 0 },
        message: "This is a solidity file.",
        level: "info"
    }]

    return callback(null, { properties: structure }, errors);
};

});
