define(['zepto', 'player', 'viewport','animations'], function($,player,viewport,animations){
	
	// emulate focusIn and focus events for window object on i-devices
    var ua = navigator.userAgent.toLowerCase();
    if ( ua.search('iphone') > -1 || ua.search('ipod') > -1 || ua.search('ipad') > -1 ) {
        var checkDelay  = 1000,
            lastExec    = new Date().getTime();

        setInterval(function() {
            var currentTime = new Date().getTime();
            if ( (currentTime - lastExec) > checkDelay * 2 ) {
                $(window)
                    .trigger('focus')
                    .trigger('focusIn');
            }
            lastExec = currentTime;
        }, checkDelay);
    }
    
	
	return {
		init: function() {
			var emptySoundPath = 'sounds/empty.mp3';
			var soundSource = false;

			var focusOutHandler = function() {
				animations.viewportIsHidden = true;
				if(player.usingWebAudio) {
					player.setMute(true);
				} else {
					if (!soundSource) {
						soundSource = player.getContext().src;
					}
					
					if (!player.isMute()) {
						player.setMute();
						player.setVolume(1);
					}
					player.getContext().src = emptySoundPath;
					player.getContext().load();
				}
			};

			var focusInHandler = function() {
				animations.viewportIsHidden = false;
				if(player.usingWebAudio) {
					player.unMute(true);
				} else {
					player.getContext().src = soundSource;
					player.getContext().load();
					if (!player.isMute()) {
						player.setMute();
						player.setVolume(1);
					}
				}
				

				if(animations.notPlayedNumberSound) {
					player.stop();
					setTimeout( function() {
						player.stop();
						animations.playNumberSound();
					}, 500);
				}
			};
			
			
			window.addEventListener( 'focusout', focusOutHandler );
	        window.addEventListener( 'blur', focusOutHandler );
	
	        window.addEventListener( 'focusin', focusInHandler );
	        window.addEventListener( 'focus', focusInHandler );
	
	        var visibilityEvent = document.hidden != undefined ? 'visibilitychange' : 'webkitvisibilitychange',
	            isHiddenProperty = document.hidden != undefined ? 'hidden' : 'webkitHidden';
	        document.addEventListener(visibilityEvent, function(){
	            if(document[isHiddenProperty]) {
	                focusOutHandler();
	            } else {
	                focusInHandler();
	            }
	        });
			
			
		}
	};
});