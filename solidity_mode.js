define('ace/mode/solidity', ['require', 'ace/mode/solidity_highlight_rules'], function(require) {
    var oop = require('ace/lib/oop');
    var TextMode = require('ace/mode/text').Mode;
    var SolidityHighlightRules = require('ace/mode/solidity_highlight_rules').SolidityHighlightRules;
    var MatchingBraceOutdent = require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
    var Range = require("ace/range").Range;
    var WorkerClient = require("ace/worker/worker_client").WorkerClient;
    var CstyleBehaviour = require("ace/mode/behaviour/cstyle").CstyleBehaviour;
    var CStyleFoldMode = require("ace/mode/folding/cstyle").FoldMode;
    
    var Mode = function() {
        this.HighlightRules = SolidityHighlightRules;
        
        this.$outdent = new MatchingBraceOutdent();
        this.$behaviour = new CstyleBehaviour();
        this.foldingRules = new CStyleFoldMode();
    };
    oop.inherits(Mode, TextMode);
    
    (function() {
        this.lineCommentStart = '//';
        this.blockComment = { start: '/*', end: '*/' };
        
        this.getNextLineIndent = function(state, line, tab) {
            var indent = this.$getIndent(line);
    
            var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
            var tokens = tokenizedLine.tokens;
            var endState = tokenizedLine.state;
    
            if (tokens.length && tokens[tokens.length-1].type == "comment") {
                return indent;
            }
    
            var match = null;
            if (state == "start" || state == "no_regex") {
                match = line.match(/^.*(?:\bcase\b.*\:|[\{\(\[])\s*$/);
                if (match) {
                    indent += tab;
                }
            } else if (state == "doc-start") {
                if (endState == "start" || endState == "no_regex") {
                    return "";
                }
                match = line.match(/^\s*(\/?)\*/);
                if (match) {
                    if (match[1]) {
                        indent += " ";
                    }
                    indent += "* ";
                }
            }
    
            return indent;
        };
    
        this.checkOutdent = function(state, line, input) {
            return this.$outdent.checkOutdent(line, input);
        };
    
        this.autoOutdent = function(state, doc, row) {
            this.$outdent.autoOutdent(doc, row);
        };
    }).call(Mode.prototype);
    
    return { Mode: Mode };
});