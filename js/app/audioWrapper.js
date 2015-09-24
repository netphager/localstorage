define(['config','WebAudioPlayer'/*,'viewport'*/],function (config,WebAudioPlayer) {
    return {
        usingWebAudio: false,
        audioLoaded: false,
        callbackTimeout: null,
        currentSound: null,
        audioPlayer: null,
        webAudioSupport: null,
        isMuted: false,
        init: function() {
    /*    	if(viewport.isiPod4) {
        		this.audioLoaded = true;
        		return;
        	}*/
            var isWebAudio = WebAudioPlayer.isSupported();
            /*if(viewport.isS4 && viewport.androidChromeVersion < 30) {
                isWebAudio = false;
            }*/
            if (isWebAudio) {
               console.log('Webaudio');
                this.audioPlayer = new WebAudioPlayer();
                this.audioPlayer.load();
                this.usingWebAudio = true;
                this.webAudioSupport = true;
            } else {
            	console.log('HTML5 Audio');
                this.audioPlayer = new jukebox.Player(config.sound);
                this.audioLoaded = true;
                this.webAudioSupport = false;
            }
            this.audioPlayer.onReady = function(){this.onReady()}.bind(this);
        },
        play: function(sounds, callback) {
        	/*if(viewport.isiPod4) {
        		return;
        	}*/
            // console.log('PLAY: ' + sounds);
            var audioWrapper = this;
            if (typeof sounds == "string") {
                sounds = [ { name: sounds, callback: callback, priority: 0 } ]
            } else {
                sounds = sounds.map(function(sound){
                    if (typeof sound == "string") {
                        return { name: sound, callback: callback, priority: 0 };
                    }
                    return sound;
                });
            }

            if (this.usingWebAudio) {
                sounds.forEach(function(sound){
                    audioWrapper.playSound(sound);
                });
            } else {
                var prioritySound = null,
                    topPriority = -1;
                sounds.forEach(function(sound){
                    var priority = config.sound.spritemap[sound.name].priority || sound.priority;
                    if (typeof priority != "undefined" && priority > topPriority) {
                        prioritySound = sound;
                        topPriority = priority;
                    }
                });
                if (prioritySound) {
                    this.playSound(prioritySound);
                } else {
                    this.playSound(sounds[0]);
                }
            }
        },
        playSound:function(sound) {
            if(this.isMute()) {
                return;
            }
            if (this.usingWebAudio) {
                this.playWebAudioSound(sound);
            } else {
                this.playHtmlAudioSound(sound);
            }
        },
        playWebAudioSound: function(sound) {
            if(this.isMute()) {
                return;
            }
            if (sound.name == "emptyLoop") return;

            if (this.callbackTimeout) {
                clearTimeout(this.callbackTimeout);
                this.callbackTimeout = null;
            }
            var settings = config.sound.spritemap[sound.name];

            var duration = settings.end - settings.start;
            if (sound.callback) {
                this.callbackTimeout = setTimeout(sound.callback, duration*1000);
            }

            this.audioPlayer.play(sound.name);
        },
        playHtmlAudioSound:function(sound) {
            if(this.isMute()) {
                return;
            }
            var skipSound = false;
            if (this.currentSound) {
                var currentPriority = this.getSoundPriority(this.currentSound),
                    newPriority = this.getSoundPriority(sound);
                if( currentPriority != undefined && currentPriority > newPriority) {
                    skipSound = true;
                }
            }

            if(!skipSound) {
                this.currentSound = sound;

                var soundCallback = function() {
                    this.currentSound !== null && typeof this.currentSound.callback === 'function' && this.currentSound.callback();
                    this.currentSound = null;
                }.bind(this);

                this.audioPlayer.play(sound.name, soundCallback);
            }
        },
        getSoundPriority: function(sound) {
            return config.sound.spritemap[sound.name].priority || sound.priority || 0;
        },
        isReady: function() {
            return this.audioLoaded;
        },
        onReady: function() {
        	this.audioLoaded = true;
        },
        isMute: function() {
        	/*if(viewport.isiPod4) {
        		return;
        	}*/
            return this.audioPlayer.isMute();
        },
        loopSound: function(name) {
            if (this.usingWebAudio) {
                this.play(name, true);
            } else {
                this.audioPlayer.loopSound(name);
            }
        },
        loopRemove:function(name) {
            if (this.usingWebAudio) {
                this.stop(name);
            } else {
                this.audioPlayer.loopRemove(name);
            }
        },
        loopRemove: function(name) {
            if (this.usingWebAudio) {
                this.stop(name);
            } else {
                this.audioPlayer.loopRemove(name);
            }
        },
        stop:function(name) {
        	/*if(viewport.isiPod4) {
        		return;
        	}*/
            if(this.usingWebAudio) {
                this.audioPlayer.stop(name);
            } else if(this.currentSound && this.currentSound.name == name) {
                this.audioPlayer.stop(name);
                this.currentSound = null;
            }
        },
        setMute: function(focusout) {
        	if(!focusout) {
        		this.isMuted = true;
        	}

        	/*if(viewport.isiPod4) {
        		return;
        	}*/
            this.audioPlayer.setMute();
        },
        unMute: function(focusin) {
        	if(focusin && this.isMuted) {
        		return;
        	}

        	/*if(viewport.isiPod4) {
        		return;
        	}*/
            this.audioPlayer.unMute();
        },
        setVolume: function(volume) {
            this.audioPlayer.setVolume(volume);
        },
        playBackground: function(name) {
           if (this.usingWebAudio) {
                 this.audioPlayer.play(name);
             }
        },
        stopBackground: function(name) {
            if (this.usingWebAudio) {
                this.audioPlayer.stop(name);
            }
        },
        pauseBackground: function(name) {
            if (this.usingWebAudio) {
                this.audioPlayer.pause(name);
            }
        },
        resumeBackground: function(name) {
            if (this.usingWebAudio) {
                this.audioPlayer.resume(name);
            }
        },
        getContext: function() {
            if (!this.usingWebAudio) {
                return this.audioPlayer.context;
            }
        },
        decode: function() {
        	this.audioPlayer.decode();
        }
    };
});