define(function(require, exports, module) {
    main.consumes = ['Plugin', 'ui', 'ace', 'jsonalyzer', 'language', 'ethergit.solidity.compiler', 'dialog.notification'];
    main.provides = ['ethergit.solidity.language'];
    
    require('./solidity_mode');
    require('./solidity_highlight_rules');
    require('./solidity_snippets');
    
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var ui = imports.ui;
        var compiler = imports['ethergit.solidity.compiler'];
        var jsonalyzer = imports.jsonalyzer;
        var language = imports.language;
        var ace = imports.ace;
        var notifyDialog = imports['dialog.notification'];
        
        var plugin = new Plugin('Ethergit', main.consumes);
        
        ace.defineSyntax({
            id: 'solidity',
            name: 'plugins/ethergit.solidity.language/solidity_mode',
            caption: 'Solidity',
            extensions: 'sol'
        });
        
        var loaded = false;
        function load() {
          if (loaded) return false;

          ui.insertCss(require("text!./ethergit-notify.css"),
                options.staticPrefix, plugin);

          language.getWorker(function(err, _worker) {
            if (err)
              return console.error(err);

            _worker.on("docParse", function(e, d) {
              var filePath = e.data.path;
              compiler.getAST(e.data.code,function(e, d){
                if( !e && d.ast ) 
                  localStorage[ filePath ] = JSON.stringify(d.ast);
                else
                  if( localStorage.hasOwnProperty( filePath ) ) 
                    { 
                      e = null; 
                      d = { 'ast': JSON.parse( localStorage[ filePath ] ) }; 
                    }

                _worker.emit("astParsed",
                  { data: 
                    {
                     err: e,
                     ast: d
                    }
                  });

		if( !loaded )
                  notifyDialog.show("<div class='bar'> Solidity plugin loaded! </div>", 900000);

          	loaded = true;
                });
            });
          });
          notifyDialog.show("<div class='bar'> Solidity plugin loading... </div>", 900000);
        }

        plugin.on('load', function() {
            load();
        });
        plugin.on('unload', function() {
        
        });
        
        plugin.freezePublicAPI({
            
        });
        
        jsonalyzer.registerServerHandler('plugins/ethergit.solidity.language/solidity_handler');
        language.registerLanguageHandler('plugins/ethergit.solidity.language/solidity_completer');
        language.registerLanguageHandler('plugins/ethergit.solidity.language/solidity_infer');

        register(null, {
            'ethergit.solidity.language': plugin
        });
    }
});
