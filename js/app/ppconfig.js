/**
 * @description Paddy Power Config
 *
 * @author Svetlozar Valchev
 * @copyright Cayetano Technologies Ltd. 2012 All rights reserved.
 */

define(['zepto','parseGetRequest'],function( $,parseGetRequest ){
    var
        configParameter = parseGetRequest('config'),
        configFile      = configParameter ? configParameter : 'config.json';

    return function ( config, callback, error ) {
        // alert(1);
        $.ajax({
            url:        decodeURIComponent(configFile),
            type:       'GET',
            dataType:   'json',
            success:    function ( ppdata, textStatus, jqXHR ) {
                            config.ppconfig = ppdata.config;
                            config.ppconfig.serverGaffURL = config.ppconfig.serverURL;
                            config.ppconfig.serverURL += 'slot/';

                            if( !callback || typeof callback !== 'function' ) {
                                throw "No callback() given!";
                            }

                            // check if object is empty
                            var emptyObject = true;
                            for ( var name in ppdata ) {
                               emptyObject = false;
                            }

                            if ( typeof ppdata === "object" && emptyObject === true ) {
                                error();
                            }

                            callback();
                        },
            error:      error
        });
    }
});