/**
 * @description Preloader class
 * @package Cayetano Game Framework
 * @augments Cayetano.stateButton
 * @author Kristiyan Ivanov
 * @copyright Cayetano Technologies Ltd. 2012 All rights reserved.
 *
 */

define(['zepto', 'config', 'page', 'helpers', 'player'], function($, config, page, helpers, player) {


    /**
     * @function
     * @description Returns a list with the items in the cache manifest file.
     */
    var getManifestList = (function() {
        var list = null,
            // Regular Expressions
            stripSectionsExpr = new RegExp(
                "(NETWORK|FALLBACK):" +
                "((?!(NETWORK|FALLBACK|CACHE):)[\\w\\W]*)",
                "gi"
            ),
            stripCommentsExpr = new RegExp("#[^\\r\\n]*(\\r\\n?|\\n)", "g"),
            stripManifestHeader = new RegExp("CACHE MANIFEST\\s*|\\s*$", "g"),
            stripLineBreaks = new RegExp("[\\r\\n]+", "g");


        return function() {
            if (list) {
                return list;
            }

            $.ajax({
                type: "get",
                url: document.documentElement.getAttribute('manifest'),
                dataType: "text",
                cache: false,
                async: false,
                success: function(totalFiles) {
                    // Strip out the non-cache sections.
                    // NOTE: The line break here is only to prevent
                    // wrapping in the BLOG.
                    totalFiles = totalFiles
                        .replace(stripSectionsExpr, "")
                    // Strip out all comments.
                    .replace(stripCommentsExpr, "")
                    // Strip out the cache manifest header and
                    // trailing slashes.
                    .replace(stripManifestHeader, "")
                    // Strip out extra line breaks and replace with
                    // a hash sign that we can break on.
                    .replace(stripLineBreaks, "#");

                    // Get array of files.
                    list = totalFiles.split("#");
                },
                error: function() {
                    // In case of error, get data from cache
                    list = false;
                }
            });

            return list;
        };
    })();


    /**
     * @class
     * @property {object} elements The elements that contain the preloader display
     * @description Creates preloader with the given selected elements
     */
    var preload = function(elements, msg, startButtonClick, finishedLoadingCallback) {

        this.STATUSES = {
            NOT_READY: 0, // it's still not loaded
            OBSOLETE: 1, // there was an error
            ERROR: 2, // there was an error - output the error message
            READY: 3, // the cache is loaded and ready for use
            UPDATE: 4 // has to reload the page, to get the new cache
        }
        /**
         * @field
         */
        this.msg = msg;
        this.maxTimeToLoadSet = false,
        this.lastTimeUpdate = 0,
        this.lastUpdateInt,
        this.isFF = /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
        this.loaded = false;
        var cache = getManifestList();

        this.cachedItems = cache ? cache.length : 30;

        this.progressCalled = 0;

        this.status = this.STATUSES.NOT_READY;
        this._isFinished = false;

        this.elements = elements;


        this._finishedLoadingCallback = finishedLoadingCallback;
        this.onclick = startButtonClick;
        this.removed = false;

        this._init();
    };

    preload.prototype.remove = function() {
        if (this.removed) {
            return
        }
        this.removed = true;
        var that = this;

        $(that.elements.gameStart).css('opacity', '1');
        setTimeout(function() {
            that.elements.gameStart.style.opacity = '1';
        }, 100);
        setTimeout(function() {
            $(that.elements.preloader).animate({
                "opacity": 0
            }, 500, 'linear', function() {
                that.elements.preloader.parentNode.removeChild(that.elements.preloader);
            });
        }, 200);

    };

    /**
     * @description Adding methods to the prototype
     */
    preload.prototype._init = function() {
        page.showPage('preloader');
        // this.elements.preloader.style.display = 'block';
        // this.elements.topbar.style.display = 'block';
        // this.elements.preloader.style.background = "url('img/game_bg.jpg') center 0";
        this.isUsedAppCache = !! document.documentElement.hasAttribute('manifest');

        this.deactivateButton();

        // check for lastupdate
        var that = this;
        that.lastUpdateInt = setInterval(function() {
            that.checkForLastUpdate();
        }, 1000);
        this.update(0, 1);

        if (this.isUsedAppCache) {
            this.load();
        } else {

            this.finished();
        }
    };

    preload.prototype.checkForLastUpdate = function() {
        var that = this;
        if(that.lastTimeUpdate < ((new Date()).getTime()) - (20 * 1000)) {
            that.finished();
            clearInterval(that.lastUpdateInt);
            return;
        }
    };

    preload.prototype.load = function() {


        var that = this,
            isChecked = false;


        if (that.isFF) {
            setTimeout(function() {
                that.activateButton(function() {
                    setTimeout(function() {
                        that._finishedLoadingCallback();
                    }, 500);
                });
            }, config.preloader.maxTimeToLoad * 1000);
        }
        //  Opera seems to ignore app cache events sometimes,
        // if there is cache update - everything is ok, but ...
        // when game is cached after a couple of reloads opera stops
        // emitting of cache events.
        //
        window.opera && setTimeout(function() {
            that.finished();
            that.status = that.STATUSES.READY;
        }, 2000);

        // Checking for an update. Always the first event fired in the sequence.
        applicationCache.addEventListener('checking', function() {

            isChecked = true;
        }, false);

        applicationCache.addEventListener('progress', function(e) {
            that.lastTimeUpdate = (new Date()).getTime();
            if (!e.loaded || !e.total) {
                // firefox doesn't support e.loaded and e.total
                that.update(that.progressCalled++, that.cachedItems);
            } else {

                that.update(e.loaded, e.total);
            }
        }, false);

        applicationCache.addEventListener('cached', function() {

            that.status = that.STATUSES.READY;
            that.finished();
        }, false);

        applicationCache.addEventListener('noupdate', function() {

            that.status = that.STATUSES.READY;
            that.finished();
        });

        applicationCache.addEventListener('updateready', function() {
            if (applicationCache.status == applicationCache.UPDATEREADY) {
                that.status = that.STATUSES.UPDATE;
                // alert('A new version is available. The game will reload to update', 'UPDATE', 'REFRESH', false);
            } else {
                that.status = that.STATUSES.READY;
            }
            try {
                window.applicationCache.swapCache();
            } catch (e) {};
            that.finished();
        }, false);

        applicationCache.addEventListener('obsolete', function() {

            that.status = that.STATUSES.OBSOLETE;
            //            alert('There was an error caching game resources. Please reload to avoid potential problems.', 'ERROR', 'CONTINUE', false);
            that.finished();
        }, false);

        applicationCache.addEventListener('error', function() {
            that.status = that.STATUSES.ERROR;
            //            alert('There was an error caching game resources. Please reload to avoid potential problems.', 'ERROR', 'CONTINUE', false);
            that.finished();
        }, false);

        if (applicationCache.status === applicationCache.IDLE) {
            // the status is IDLE, so the appcache is the newest
            if (!that.isFF) {
                that.status = that.STATUSES.READY;
                that.finished();
            }
        }

        // Chrome for Android fix
        // https://code.google.com/p/chromium/issues/detail?id=258191
        setTimeout(function() {
            if (applicationCache.status == that.STATUSES.ERROR) {
                that.status = that.STATUSES.READY;
                that.finished();
            }
        }, 5000);
    }

    preload.prototype.activateButton = function(callback) {

        if (typeof this.onclick !== 'function') {
            this.onclick = function() {};
        }
        var that = this;
        var _onclick = function() {

            that.onclick();
            // this.elements.preloader.style.background = "none";
            // that.elements.gameStart.removeEventListener("click", _onclick);
        }

        this.elements.progressWhole.style.display = 'none';
        this.elements.loadingServer.style.display = 'none';
        this.elements.progress_percent.style.display = 'none';

        this.elements.gameStart.className = 'active';

        this.elements.gameStart.style.display = 'block';

        // this.elements.gameStart.addEventListener("click", _onclick);
        this.loaded = true;
        callback();
        // this.elements.gameStart.onclick();
        // this._onclick();
        // setTimeout(_onclick,300);
        // _onclick();
        // this.onclick();

        // this.onclick();
    };

    preload.prototype.deactivateButton = function() {

        this.elements.gameStart.style.display = 'none';
    };



    preload.prototype.update = function(loaded, total) {
        var percent = Math.round((loaded / total) * 100);


        if (percent >= 100) {
            percent = 100;
        }

        if (this.elements.progress)
            this.elements.progress.style.width = percent + '%';
        if (this.elements.text) {
            this.elements.progress_percent.innerHTML = this.elements.text + ' ' + percent + '%';
        } else {
            this.elements.progress_percent.innerHTML = percent + '%';
        }
    };

    preload.prototype.finished = function() {
        var that = this;
        // preloader is ready
        if (this._isFinished) {
            return;
        }
        clearInterval(that.lastUpdateInt);

        if (!player.audioLoaded) {
        	this.elements.progress.style.width = '100%';
            this.elements.progress_percent.innerHTML = 'LOADING SOUNDS';
            setTimeout(function() {
            	if(player.usingWebAudio && !player.audioPlayer.soundDecodingStarted && player.audioPlayer.downloadCompleted) {
	        		player.decode();
	        	}
                that.finished();
            }, 300);
            return;
        }

        this._isFinished = true;
        this.update(100, 100);
        this.activateButton(function() {
            setTimeout(function() {
                that._finishedLoadingCallback();
            }, 500);
        });

    };

    return preload;
});