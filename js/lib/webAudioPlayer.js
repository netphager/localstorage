/*
 @Auothor: Cayetano Gaming
 @File: webAudioPlayer.js
 @Revision:
*/
var testVar;
define(['zepto', 'config', 'Cayetano'], function ($, config, Cayetano) {
    var gameAudio = '',
        WebAudioPlayer = function () {
            this.audioContext = null;
            this.mainBuffer = null;
            this.audioLoaded = false;
            this.muted = false;
            this.volumeNode = null;
            this.sounds = {};
            this.soundDecodingStarted = false;
            this.downloadCompleted = false;
            this.objectType = null;
            this.pastSources = [];
            this.onReady = function () {}
        };
    WebAudioPlayer.isSupported = function () {
        return typeof AudioContext !== "undefined" || typeof webkitAudioContext !== "undefined"
    };
    Cayetano.extend(WebAudioPlayer.prototype, {
        getResourceName: function () {
            return config.sound.resources[0]
        },
        createGain: function () {
            if (this.audioContext.createGain) {
                return this.audioContext.createGain()
            } else if (this.audioContext.createGainNode) return this.audioContext.createGainNode()
        },
        load: function () {
            if (typeof AudioContext !== "undefined") {
                this.audioContext = new AudioContext();
                this.objectType = 'generic'
            } else if (typeof webkitAudioContext !== "undefined") {
                this.audioContext = new webkitAudioContext();
                this.objectType = 'webkit'
            };
            this.mainVolumeNode = this.createGain();
            this.mainVolumeNode.connect(this.audioContext.destination);
            var previousEventTime = null,
                focusOutCheck = function () {
                    if (!this.muted) {
                        if (previousEventTime !== null) this.mainVolumeNode.gain.setValueAtTime(1, previousEventTime);
                        previousEventTime = this.audioContext.currentTime + 1;
                        this.mainVolumeNode.gain.setValueAtTime(0, previousEventTime)
                    } else this.mainVolumeNode.gain.setValueAtTime(0, 0);
                    setTimeout(focusOutCheck, 500)
                }.bind(this);
            focusOutCheck();
            var webAudioPlayer = this,
                request = new XMLHttpRequest();
            request.open('GET', this.getResourceName(), true);
            request.responseType = 'arraybuffer';
            /*request.onload = function () {
                webAudioPlayer.rawData = request.response;
                webAudioPlayer.downloadCompleted = true
            };*/
            request.onload = function() {
               webAudioPlayer.audioContext.decodeAudioData(request.response,
                   function(buffer){
                       webAudioPlayer.soundBuffer = buffer;
                       webAudioPlayer.audioLoaded = true;
                       webAudioPlayer.onReady();
                   });
           };
            request.send()
        },
    /*    decode: function () {
            if (this.soundDecodingStarted) return;
            this.soundDecodingStarted = true;
            this.soundBuffer = this.audioContext.createBuffer(16,5, 64000);
            this.audioLoaded = true;
            this.onReady();
        },*/
        play: function (name, callback, settings) {
            if (!this.audioLoaded) return;
            settings = Cayetano.extend(config.sound.spritemap[name], settings || {});
            var duration = settings.end - settings.start;
            this.pastSources[this.pastSources.length] = this.source = this.audioContext.createBufferSource();
            this.source.buffer = this.soundBuffer;
            if (this.objectType == 'generic') {
                this.volumeNode = this.audioContext.createGain()
            } else if (this.objectType == 'webkit') this.volumeNode = this.audioContext.createGainNode();
            this.volumeNode.gain.value = this.muted ? 0 : 1;
            this.source.connect(this.volumeNode);
            this.volumeNode.connect(this.mainVolumeNode);
            if (settings.loop) {
                this.source.loopStart = settings.start;
                this.source.loopEnd = settings.end;
                this.source.loop = true
            };
            this.startTime = new Date().getTime();
            if (this.objectType == 'generic') {
                this.source.start(0, settings.start, duration)
            } else if (this.objectType == 'webkit') this.source.noteGrainOn(0, settings.start, duration)
        },
        stop: function () {
            for (var i in this.pastSources) {
                if (this.objectType == 'generic') {
                    this.pastSources[i].stop()
                } else if (this.objectType == 'webkit') this.pastSources[i].noteOff(0);
                delete this.pastSources[i]
            }
        },
        isMute: function () {
            return this.muted
        },
        setMute: function () {
            if (this.volumeNode) this.volumeNode.gain.value = 0;
            this.muted = true
        },
        unMute: function () {
            this.muted = false
        },
        setVolume: function (volume) {
            if (volume > 0) this.muted = false;
            if (this.volumeNode && this.volumeNode.gain) this.volumeNode.gain.setValueAtTime(volume, 0)
        }
    });
    return WebAudioPlayer
})