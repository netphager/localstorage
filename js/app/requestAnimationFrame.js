define(['zepto'], function($, server,helpers,player){
	var callbacks = {};
	var lastFrameTime = 0;
	var IAmAlive = true;
	var requestId = false;
	setInterval(function() {
		if ( IAmAlive ) {
			IAmAlive = false;
		} 
		else 
		{
			// if (requestId) {
			// 	obj.removeCallback(requestId);
			// }
			realRun();
		}
	}, 1000);

	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function(callback){
			window.setTimeout(callback, 1000 / 24);
		};
	})();
	
	function realRun(){
		IAmAlive = true;
		requestAnimFrame( function() {
			realRun();
		});
		for (var i in callbacks) {
			callbacks[i]();
		}
	}
	return {
		addCallback: function(identifier, callback){
			requestId = identifier;
			if(typeof callback != 'function'){
				console.error('You can set only functions as callbacks.');
				return;
			}
			if(typeof callbacks[identifier] != 'undefined'){
				console.error('You can have only 1 callback with "' + identifier + '" identifier.');
				return;
			}
			
			callbacks[identifier] = callback;
		},
		
		removeCallback: function(identifier){
			if(typeof callbacks[identifier] == 'undefined'){
				// console.error('There\'s no callback with"' + identifier + '" identifier.');
				return;
			}
			
			delete callbacks[identifier];
		},

		hasCallback: function(identifier) {
			return callbacks[identifier] !== undefined;
		},
		
		run: function() {
			realRun();
		}

		
	}
});