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

completer.getIdentifierRegex = function() {
    // Allow slashes for package names
    return (/[a-zA-Z_0-9\[\$\/]/);
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

      if( e.data.ast )
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

    if( e.data.ast )
      completer.ast = e.data.ast;

    callback();
  });
};

/* TODO completer.onDocumentClose = function() {} */
/* This needs to be written, to save the parsed AST somewhere (last known good parse) in case the file is saved with a syntax error*/
/* This also might not need to be written, depending on how obvious errors are in the debugger. */

var solidity_doc = {
    "address": "a 160 bit value that does not allow any arithmetic operations",
};

var solidity_icon = {
    "address": "property2",
    "VariableDeclaration": "property"
};

var solidity_meta = {
    "VariableDeclaration": "var",
};

var solidity_priority = {
    "VariableDeclaration": 7,
};

completer.complete = function(doc, ast , pos, currentNode, callback) {
  ast = completer.ast.ast;
  currentNode = null; //use native impl instead, unused

  var results = []
  var currentLine = doc.getLine( pos.row );

  // completion for mappings (todo make sure this won't trigger on array)
  var posBracketL = (currentLine.indexOf("[")+1) == pos.column;
  if( posBracketL ) 
    { 
      var tokenNode = findTokenAST( currentLine.split('[')[0] , ast);

      findTypeAST( "VariableDeclaration", ast, "address" , tokenNode , '[') 
    }

/*
  var posDotL = (currentLine.indexOf(".")+1) == pos.column;
  if( posDotL ) 
    { 
      var tokenNode = findTokenAST( currentLine.split("\.")[0] , null);

      if( tokenNode === "msg" ) //special case
	{
          //findTypeAST( "VariableDeclaration", ast, null , tokenNode , '[') 
	}
    }*/

  function findTokenAST( token , ast) 
   {
     //locate token in ast
     console.log(token, 't');
     return token.replace(/ /g, '');
   }

  function findTypeAST( type, ast, typeAdd, token, splitToken)
   {
     for( var p in ast ) 
      { 
        if( ast.hasOwnProperty(p) ) 
         {
           if( p === "children" )
            {
	      ast[p].forEach(function(e)
               {
                findTypeAST( type, e , typeAdd, token, splitToken );
               });
            }

           if( p === "name" )
            {
	      if( ast["name"] === type )
		{
                  var attrs = ast['attributes'];
		  var subAttrs = [];
		  var varType = ast['children'][0].hasOwnProperty('attributes') ? ast['children'][0]['attributes']['name'] : "No info available";
		  /*ast['children'].forEach(function(e,i) 
		   {
		     var hasChildren = ast['children'].slice(-1).hasOwnProperty('children');
		     if( i != hasChildren ? ast['children'].length-1 : ast['children'].length )
		       {
//console.log(e, typeof e);
			  subAttrs.push(e['attributes']);
		       }
		   });*/ 
                  //console.log('type', varType, 'ASTtype', ast[p], 'Var-name', attrs['name'] , 'ast', ast, 'attributes', attrs, 'nodes', subAttrs);
		  if( typeAdd === varType || typeAdd === null )
		   {
		     results.push
	               ({ 
    		         name: attrs['name'], 
		         replaceText: token + splitToken + attrs['name'], 
		         doc: "<pre> Type: " + (typeAdd ? solidity_doc[ varType ] : varType) + "</pre>",
		         icon: solidity_icon[ type ], 
			 meta:  varType, /*solidity_meta[ type ]*/
    		         priority: solidity_priority[ type ] 
                       });
		   }
		}
            }
         }
      }
   }

  //TODO completion logic...
  callback(results);
};

});
