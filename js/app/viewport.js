define(['zepto', 'config'], function($, config) {
	var userAgent = navigator.userAgent.toLowerCase();
	var viewport = {
		isMobile: userAgent.match(/(iphone|ipod|ipad|android|blackberry)/) != null,
		isiDevice: /ipad|iphone|ipod/i.test(userAgent),
		isAndroid: /android/i.test(userAgent),
		isAndroid_4_1: /android 4.1/.test(userAgent) ? true : false,
		isAndroidDefault: (/android/i.test(userAgent) && !(/chrome/i).test(userAgent)) ? true : false,
		isAndroidChrome: (/android/i.test(userAgent) && ((/chrome/i).test(userAgent))) ? true : false,
		isS2: ((/android/i.test(userAgent) && (userAgent.match(/gt-i9100/))) || (/android/i.test(userAgent) && (userAgent.match(/gt-i9105/)))) ? true : false,
		isS3: (/android/i.test(userAgent) && (userAgent.match(/gt-i9300/))) ? true : false,
		isS4: ((/android/i.test(userAgent) && (userAgent.match(/gt-i9500/))) || (/android/i.test(userAgent) && (userAgent.match(/gt-i9505/)))) ? true : false,
		isTablet:  ((userAgent.search('android') > -1 && userAgent.search('mobile') < 0) || userAgent.search('ipad') > -1),
		androidChromeVersion: (/android/i.test(userAgent) && ((/chrome/i).test(userAgent))) ? parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) : null,
		isGalaxyS3: userAgent.search('gt-i9300') > -1 ? true : false,
		screenSize: {},
		iScrollEnabled: false,
		hasiOSTopBar: false,
		isiOS7: false,
		isiPod4: false,
		iDeviceType: null,
		matchMedia: null,
        pageTransitionCompleted: true,
		mql: window.matchMedia("(orientation: portrait)"),
		uiwebview:       /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),
	/*	init: function() {
			//device detections
			var self = this;
			if(self.androidChromeVersion && self.androidChromeVersion<=28) {
				self.isAndroidDefault = true;
			}

			if (this.isiDevice) {
				if (userAgent.search('ipod') > -1) {
					this.iDeviceType = 'ipod';
				} else if (userAgent.search('iphone') > -1) {
					this.iDeviceType = 'iphone';
				} else if (userAgent.search('ipad') > -1) {
					this.iDeviceType = 'ipad';
				}
				else {
					this.iDeviceType = 'unknown';
				}
			}


			if (this.isiDevice || this.isAndroidDefault === true) {
				var iOSVer = userAgent.match(/os\ (\d+)/i);
				if (iOSVer !== null && iOSVer.length >= 2 && (iOSVer[1].toString() === '7') || iOSVer[1].toString() === '8') {
					this.isiOS7 = true;
				}
				setInterval(function() {
					self.resize();
				}, 1000);
			}

			if(this.isiOS7 || this.isAndroidChrome) {
				this.longerAspectRatio = true;
				config.gameSize.width = 783;
				var iosVer = navigator.userAgent.match(/os\ 7_(\d)/i);
				if(iosVer && this.isiOS7 && iosVer[1] == 1) {
					config.gameSize.width = 680;
					$('<link rel="stylesheet" type="text/css" href="css/ios7.css" >').appendTo("head");
				} else {
					$('<link rel="stylesheet" type="text/css" href="css/androidChrome.css" >').appendTo("head");
				}

			} else {
				this.longerAspectRatio = false;
				$('<link rel="stylesheet" type="text/css" href="css/not_ios7.css" >').appendTo("head");
			}

			if(this.iDeviceType=='ipod' && !this.isiOS7 && window.screen.height==480 && window.screen.width==320) {
				this.isiPod4 = true;
			}



			window.onload = self.resize;
			if (!self.isAndroidDefault) {
				window.onresize = self.resize.bind(self);
			} else {
				window.onresize = self.resizeDelayed.bind(self);
			}
			self.resize();

			// fix for iOS7 portrait orientation
			window.addEventListener( 'orientationchange', (function(){
				$( "#viewport iFix" ).remove();
				$( "#viewport" ).append( '<iFix></iFix>' );
				if (!self.isAndroidDefault) {
					self.resize();
				} else {
					self.resizeDelayed();
				}
			}).bind(self) );

			//Remove default behaviors
			document.body.addEventListener("touchstart", function(c) {
				if (self.iScrollEnabled) {
					$('#iScroller').addClass('iScrollerHover');
					return;
				}
				c.preventDefault();
			},false);
			document.body.addEventListener("touchmove", function(c) {
                if (self.iScrollEnabled) {
					return;
				}

				c.preventDefault();
			}, false);

			document.body.addEventListener("touchend", function(c) {
				if (self.iScrollEnabled) {
					$('#iScroller').removeClass('iScrollerHover');
					self.resize();
					return;
				}
				c.preventDefault();
				// self._hideUrlBar(true);
			}, false);

			// if (self.isiDevice && !self.isAndroidChrome){
			// 	$('.slider').css('position', 'relative');
			// } else {
			// 	$('.slider').css('position', 'absolute');
			// };

		},

		resizeDelayed: function() {
			var self = this;
			setTimeout(function() {
				self.resize();
			}, 500);
		},

		resize: function(){
			var self = this;
			var documentWidth = window.innerWidth; //self.isAndroidDefault && document.body.clientWidth ? document.body.clientWidth : window.innerWidth;
			var documentHeight = window.innerHeight; //self.isAndroidDefault && document.body.clientHeight ? document.body.clientHeight : window.innerHeight;
			var width = config.gameSize.width;
			var height = config.gameSize.height;

			var curOrientation = this.deviceOrientation();
			// landscape mode

			if(curOrientation==config.gameSize.orientation) {

				if(window.innerHeight < 320 && self.isiOS7 && self.pageTransitionCompleted) { //iPhone with iOS7 and adress bars
					self.iScrollEnabled = true;
					var iOSVer = navigator.userAgent.match(/os\ 7_(\d)/i);
					// alert(iOSVer[1]);
					if(!iOSVer || iOSVer[1] != '1') {
						if(!$('#iScroller').length) {
							$('body').prepend('<div id="iScroller" class="iScroller"><div></div></div>');
						}
					}

					var messageWidth = parseInt($('#iScroller').css('width'));
					self.scale = documentWidth / messageWidth;

					if(this.isiDevice) {
						$('#viewport').hide();
					} else {
						$('#viewport').css('visibility','hidden');
					}
					$('.sliderHolder').css('width', '2px');
					//$('#debug').append('<br/>iOS7 Scroller: ' + self.scale);

					var game = $('#iScroller');
					height = 1600;
				} else {
					//alert(1);
                    self.iScrollEnabled = false;
					var scaleX = documentWidth / width;
					var scaleY = documentHeight / height;
					self.scale = Math.min(scaleX, scaleY);

					if(self.scale*config.gameSize.height < documentHeight || (navigator.userAgent.match(/os\ 7_(\d)/i) != null && navigator.userAgent.match(/os\ 7_(\d)/i)[1] == 1)) {
						if(this.isiOS7) {
							var topMargin = (window.innerHeight - self.scale*config.gameSize.height) * 5/14;
						} else {
							var topMargin = (window.innerHeight - self.scale*config.gameSize.height) / 2;
						}

						if(navigator.userAgent.match(/os\ 7_(\d)/i)!=null && (navigator.userAgent.match(/os\ 7_(\d)/i) != null && navigator.userAgent.match(/os\ 7_(\d)/i)[1] == 1)) {
							topMargin = 10;
						}
						if(self.uiwebview) {
							topMargin = 0;
						}

						$('#viewport').css('margin-top', Math.ceil(topMargin) + 'px');

					}else {
						$('#viewport').css('margin-top', '0px');
					}

					if(self.scale*config.gameSize.width < documentWidth) {
						var leftMargin = (documentWidth - self.scale*config.gameSize.width) / 2;
						$('#viewport').css('margin-left', Math.ceil(leftMargin) + 'px');
					} else {
						$('#viewport').css('margin-left', '0px');
					}

					if(this.isiDevice) {
						$('#viewport').show();
					} else {
						$('#viewport').css('visibility','visible');
					}
					$('.sliderHolder').css('width', '4165px');
					$('#iScroller').remove();
					var game = $('#viewport');
				}


				$('#landscapeMessage').remove();
				// bettableElements_GLOBAL.setupBettingChipsIScroll();


			}
			// portrait mode
			else {
				if(!self.pageTransitionCompleted) {
					// $('#debug').html('Wait for it');
					setTimeout(function() {
						self.resize();
					}, 100);
					return;
				}

				if(!$('#landscapeMessage').length) {
					$('body').prepend('<div id="landscapeMessage"></div>');
				}

				// $('#debug').html(window.innerWidth + ' / ' + window.innerHeight);
				// $('#debug').append('<br/>' + document.documentElement.clientWidth	 + ' / ' + document.documentElement.clientHeight);
				// $('#debug').append('<br/>' + $(window).width()	 + ' / ' + $(window).height());
				// $('#debug').append('<br/>' + window.screen.availWidth	 + ' / ' + window.screen.availHeight);
				// $('#debug').append('<br/>' + document.body.clientWidth	 + ' / ' + document.body.clientHeight);

				var game = $('#landscapeMessage');

				width = parseInt($(game).css('width'));
				height = parseInt($(game).css('height'));
				var w = Math.min(documentWidth, documentHeight);
				var h = Math.max(documentWidth, documentHeight);
				self.scale = w / width;

				var topMargin = (h - self.scale*height) / 2;
				$(game).css('margin-top', topMargin+ 'px');
				if(this.isiDevice) {
					$('#viewport').hide();
				} else {
					$('#viewport').css('visibility','hidden');
				}
				$('.sliderHolder').css('width', '2px');
				$('#iScroller').remove();

			}
			game.css({
				'width': width +"px",
				'height': height +"px",
				'-webkit-transform':'scale('+self.scale+', '+self.scale+')',
				'transform':'scale('+self.scale+', '+self.scale+')',
				'-webkit-transform-origin':'0px 0px',
				'transform-origin':'0px 0px'
			});


			//if(this.isiOS7 || this.isAndroidDefault) {
			if(this.isiDevice || this.isAndroidDefault) {
				window.scrollTo(0, (self.isAndroidDefault ? 1 : 0) );
			}
		},

		_hideUrlBar: function(delay) {
			var self = this,
			_doDelay = delay || false,
			_delay = (_doDelay) ? 500 : 0;

			setTimeout(function() {
				// window.scrollTo(0, self.isAndroidDefault ? 1 : 0);

			}, _delay);
		},
*/
		deviceOrientation: function() {
			var self = this,
			_orientation = window.orientation;
			var win,scr;

			// check matchMedia supported
			if(window.matchMedia && self.isS4 && self.androidChromeVersion>=29) {
				if(self.matchMedia != null) {
					if(self.matchMedia.matches) {
						// Portrait orientation
						return 'portrait';
					} else {
						// Landscape orientation
						return 'landscape';
					}
				} else {
					if(self.mql.matches) {
						// Portrait orientation
						return 'portrait';
					} else {
						// Landscape orientation
						return 'landscape';
					}
				}
			} else {
				if (_orientation === 0 || _orientation === 180 || _orientation === -180) {
					// chrome on android sometimes reports 0 when in landscape
					if (self.isAndroidChrome && (document.documentElement.clientWidth > document.documentElement.clientHeight)) {
						return "landscape";
					}
					return "portrait";
				} else {
					return "landscape";
				}
			}
		}
	}
	return viewport;
});