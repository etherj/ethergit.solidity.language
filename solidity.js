define(function(require, exports, module) {
    main.consumes = ['Plugin', 'ace', 'jsonalyzer', 'language'];
    main.provides = ['ethergit.solidity.language'];
    
    require('./solidity_mode');
    require('./solidity_highlight_rules');
    require('./solidity_snippets');
    
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var jsonalyzer = imports.jsonalyzer;
	var language = imports.language;
        var ace = imports.ace;
        
        var plugin = new Plugin('Ethergit', main.consumes);
        
        ace.defineSyntax({
            id: 'solidity',
            name: 'plugins/ethergit.solidity.language/solidity_mode',
            caption: 'Solidity',
            extensions: 'sol'
        });
        
        function load() {
            
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
