define(function(require, exports, module) {
    main.consumes = ['Plugin', 'ace'];
    main.provides = ['ethergit.solidity.language'];
    
    require('./solidity_mode.js');
    require('./solidity_highlight_rules.js');
    require('./solidity_snippets.js');
    
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var ace = imports.ace;
        
        var plugin = new Plugin('Ethergit', main.consumes);
        
        ace.defineSyntax({
            id: 'solidity',
            name: 'solidity',
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
        
        register(null, {
            'ethergit.solidity.language': plugin
        });
    }
});