/*
 * @description Parses the get request part in the URL and returns the value of concrete parameter
 * @package Cayetano Game Framework
 *
 * @author Georgi Bachev
 * @copyright Cayetano Technologies Ltd. 2012 All rights reserved.
 */


define(function(){
	return function( parameterName ) {
	    var urlString 	= document.location.search.substring(1),
	    	urlParts 	= urlString.split('&'),
	    	pl 			= urlParts.length,
	    	i 			= 0;
	    	
	    for ( ; i < pl; i++ ) {
	        var parameterParts = urlParts[i].split('=');
	        if ( parameterParts[0] == parameterName ) return parameterParts[1]; 
	    }
	    
	    return null;
	}
});