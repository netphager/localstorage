if (typeof TOPBAR_URL === 'undefined' || !TOPBAR_URL) {
    var TOPBAR_URL = '/topbar/';
}

if (typeof TOPBAR_STYLE === 'undefined' || !TOPBAR_STYLE) {
    var TOPBAR_STYLE = 'TABLET';
}
require.config({
	// requirejs config
	baseUrl: 'js/app',
	shim: {
		zepto: {
			exports: '$'
		}
	},
	paths: {
		lib: 'lib',
		zepto: '../lib/zepto',
		config: 'config',
		fastclick: '../lib/fastclick',
		cookies: '../lib/cookies',
		eventemitter: '../lib/eventemitter2',
		playerJuke: '../lib/Player',
		player: 'audioWrapper',
		manager: '../lib/Manager',
		WebAudioPlayer: '../lib/webAudioPlayer',
		state_machine: '../lib/state-machine',
		pageToNode: '../lib/pageToNode',
		topbar: 'empty:',
		iscroll: '../lib/iscroll',
		convertPoint: '../lib/convertPoint'
	}
});

require.config({
	paths: {
		topbar: TOPBAR_URL
	}
});

require(['zepto', 'server', 'emitter', 'preloader', 'page', 'animations', 'manager', 'cookies', 'playerJuke', 'WebAudioPlayer',
	'Cayetano', 'player', 'helpers', 'events', 'requestAnimationFrame', 'iscroll', 'domReady', 'bettable_elements', 'focus','gameAdapter','multiTouchDot','topbar/topbar','statemachine','convertPoint', 'pageToNode'],
	function($, server, eventEmitter, preloader, page, animations, manager, cookies, playerJuke, WebAudioPlayer,
		Cayetano, player, helpers, events, requestAnimationFrame, iscroll, domReady, bettableElements, focus,gameAdapter,multiTouchDot,TopBar,state_machine) {
	buttonsLocked = false;

	window.topbar = new TopBar(document.getElementById('topbarDiv'), 'PHONE_ROULETTE', 'GREEN' );
	topbar.initViewport({
        height: 380,
		width: 733,
		maxWidth: 733,
		gaps: {
		    iOS8FullScreen:   { top: 25,  bottom: 30 },
		    iOS8NormalPhone6: {top:0,bottom:22},
		    iOS7FullScreen: 	{ top: 22, 	bottom: 33 }
		}
    });


	server.init(function() {

		if(server.configJson.config.base.playMode == 'realplay' && server.configJson.config.topbar.isLoggedIn === false) {
			window.location = decodeURIComponent(server.configJson.config.topbar.loginURL);
			return false;
		}
		$('#viewport').show();
		$('<link rel="stylesheet" type="text/css" href="css/not_ios7.css" >').appendTo("head");

		animations.init();
		placeBetLocked = false;
		preloaderInstance = preloader;
		document.getElementById('topbarDiv').style.display = 'block';

		window.addEventListener('online', updateOnlineStatus);
		window.addEventListener('offline', updateOnlineStatus);
		server.rgsConfigRequest(function(config){

			player.init();
			multiTouchDot.init();
			notPlayedNumberSound = false;
			helpers.bind($('.ub_button.help'),"touchend", function() {
				eventEmitter.emit('button.help');
			});
			helpers.bind($('.ub_button.home'),"touchend", function() {
				eventEmitter.emit('button.home');
			});

 

			if(!config) {
				return false;
			}
			var minGameStake = config.init.minStake;
			minGameStake = helpers.formatMoneyValue(minGameStake);
			var maxGameStake = config.init.maxStake;
			maxGameStake = helpers.formatMoneyValue(maxGameStake);
			maxGameStake = maxGameStake.substring(0, maxGameStake.length - 3);

			$('#minStake span').text(minGameStake);
			$('#maxStake span').text(maxGameStake);


			if(server.configJson.config.base.playMode == 'freeplay') {
				var configUrl = helpers.getParameterByName('config');
				if ($.isEmptyObject(configUrl)) {
					configUrl = 'config.json';
				} else {
					configUrl = configUrl.config;
				}
				configUrl = encodeURIComponent(configUrl + '&playMode=realplay&version=3');
				$('title').html(server.configJson.config.game.gameTitle);
				helpers.bind($('#playforreal'),'touchend',function() {
					var realPlayUrl = server.getFreePlayUrl();
					window.location = realPlayUrl
				});
				$('.playMode').show();
				$('#top_menu .free_bet').hide();
			} else {
				$('.playMode').hide();
				$('#top_menu .free_bet').show();
				// server.getFreebets(function(freebet) { helpers.setFreeBet(freebet); });
			}
			$('#home_btn').attr('href',decodeURIComponent(server.configJson.config.server.portalRefreshURL));

			//Set initial bet & free bet

			currencySymbols = {
			    GBP: "£",
			    EUR: "€",
			    USD: "$"
			};

			topbar.init({
			    balance: config.header.customer.account.balance,
			    freebet: config.header.customer.account.freeBetFunds,
			    currency: currencySymbols[config.header.customer.account.currencyCode],
			    bet: 0,
			    paid: 0,
			    userId: config.header.customer.account.userId,
			    gameId: server.configJson.config.server.gameId,
			    affId: server.configJson.config.server.affeId,
			    channel: server.configJson.config.server.channel,
			    realplay: server.configJson.config.base.playMode === 'realplay' ? true : false,
			    debug: false,
			    loggedIn: server.configJson.config.topbar.isLoggedIn,
			    urls: {
			        // contact: config.ppconfig.contactURL,
			        // deposit: config.ppconfig.depositURL,
			        help: server.configJson.config.server.helpURL,
			        // login: server.prefs.topbar.loginURL,
			        refresh: server.configJson.config.server.portalRefreshURL,
			        realPlay: server.configJson.config.server.realPlayURL
			    }
			});

		topbar.setGameAdapter(new gameAdapter(),{ 'target': document.getElementById('bettable'), 'property' : 'display', 'propertyState': 'block' });
			state_machine.init();


			var msg = '',
			preloader = new preloaderInstance({
					content: document.getElementById('content'),
					preloader: document.getElementById('preloader'),
					progress: document.getElementById('progress_inner'),
					progressWhole: document.getElementById('progress'),
					gameStart: document.getElementById('buttonStart'),
					progress_percent: document.getElementById('percent'),
					topbar: document.getElementById('top_menu'),
					loadingServer: document.getElementById('connect'),
					text: 'LOADING GAME: '
				},
				msg,
				function() {},
				function() {
					helpers.setBet('0.00');
					helpers.setPaid('0.00');
					helpers.setBalance(config.header.customer.account.balance);


					focus.init();
					window.removeEventListener('online',updateOnlineStatus);
					window.removeEventListener('offline',updateOnlineStatus);


					helpers.bind($('#buttonStart'),"touchstart", function(e) {
						$('#buttonStart').css('background', 'url("img/btn_start.png") no-repeat scroll -1px 0 transparent');
					});

					helpers.bind($('#buttonStart'),"touchend", function(e) {
						topbar.gameStart();
						$('#buttonStart').css('background', 'url("img/btn_start.png") no-repeat scroll -188px 0 transparent');
						$(this).remove();
						eventEmitter.emit('button.start');

						player.play('empty');
						if(server.configJson.config.base.playMode == 'realplay') {
							$('.data.freebet').show();
						}
					});

					attachEvents();
					if(cookies.readCookie('sound')) {
						eventEmitter.emit('button.sound', this,cookies.readCookie('sound'));
					}

				}
			);


			requestAnimationFrame.run();

			i = 0;
			$(window).resize(function() {
				bettableElements.updateChips();
			});



		});
	});


	var attachEvents = function() {

		helpers.bind($('#buttonHistory,#buttonPaytable,#buttonOptions'),'touchend',function() {
			buttonsLocked = true;
			if (animations.winboxVisible) {
				animations.hideNav();
			};
		});
		helpers.bind($('.touchButton'), 'touchstart', function (e) {
			var element = $(this);
			element.addClass("active")
		});
		helpers.bind($('.touchButton'), 'touchend', function (e) {
			var element = $(this);
			element.removeClass("active")
		});

		//History
		helpers.bind($('a#buttonHistory'),'touchend',function(e) {
			eventEmitter.emit('button.history');
			e.preventDefault();
			e.stopPropagation();
		});
		helpers.bind($('#historyClose'),'touchend',function() {
			eventEmitter.emit('button.historyClose');
			return false;
		});
		//Paytable
		helpers.bind($('#buttonPaytable'),'touchend',function(e) {
			eventEmitter.emit('button.paytable');
			e.preventDefault();
			e.stopPropagation();
		});
		helpers.bind($('#paytableClose'),'touchend', function() {
			eventEmitter.emit('button.paytableClose');
			return false;
		});
		//Settings

		helpers.bind($('#buttonOptions'),'touchend',function(e) {
			eventEmitter.emit('button.options');
			e.preventDefault();
			e.stopPropagation();

		});

		helpers.bind($('#optionsClose'),'touchend', function() {
			eventEmitter.emit('button.optionsClose');
			return false;
		});

		helpers.bind($('#buttonSpin'),'touchend',function() {
			eventEmitter.emit('button.spin');
			return false;
		});

		helpers.bind($('#new_bet_btn'),'touchend',function() {
			eventEmitter.emit('button.new_bet_btn');
			return false;
		});
		helpers.bind($('#buttonBettable'),'touchend',function() {
			eventEmitter.emit('button.bettable');
			return false;
		});
		helpers.bind($('#buttonUndo'),'touchend',function() {
			if ($(this).hasClass('clearButton')) {
				eventEmitter.emit('button.clear');
				$(this).removeClass('clearButton');
			} else {
				eventEmitter.emit('button.undo');
			}
			return false;
		});
		helpers.bind($('#buttonClear'),'touchend',function() {
			eventEmitter.emit('button.clear');
			return false;
		});
		helpers.bind($('#buttonBack'),'touchend',function() {
			eventEmitter.emit('button.back');
			return false;
		});
		helpers.bind($('#buttonClose'),'touchend',function() {
			eventEmitter.emit('button.close');
			return false;
		});
		helpers.bind($('#buttonRespin'),'touchend',function() {
			eventEmitter.emit('button.respin');
			return false;
		});
		helpers.bind($('#buttonRebet'),'touchend',function() {
			eventEmitter.emit('button.rebet');
			return false;
		});
		helpers.bind($('#buttonRebet2'),'touchend',function() {
			eventEmitter.emit('button.rebet2');
			return false;
		});
		helpers.bind($('#buttonRebetSpin'),'touchend',function() {
			eventEmitter.emit('button.buttonRebetSpin');
			bettableElements_GLOBAL.navVisible = false;
		});

		//pushed state
		$('#buttonSpin,#buttonUndo,#buttonClear,#buttonRebet2,#buttonRebet,#new_bet_btn,#buttonRebetSpin, #optionsClose, #paytableClose,#historyClose, #buttonOptions, #buttonPaytable, #buttonHistory, .sounds_on, .sounds_off').live('touchstart', function(event) {
			$(this).addClass('active');
		});
		$('#buttonSpin,#buttonUndo,#buttonClear,#buttonRebet2,#buttonRebet,#new_bet_btn,#buttonRebetSpin, #optionsClose, #paytableClose, #historyClose, #buttonOptions, #buttonPaytable, #buttonHistory, .sounds_on, .sounds_off').live('touchend', function(event) {
			$(this).removeClass('active');
		});

		$('#errorDialogLinkArea').live('touchstart', function(event) {
			$('#buttonOK').addClass('active');
		});
		$('#errorDialogLinkArea').live('touchend', function(event) {
			$('#buttonOK').removeClass('active');
		});

		$('.slider-frame, .slider-button, .options_content_upper').on('click', function(e) {
			if ($(this).hasClass('on')) {
				$(this).removeClass('on');
				$(this).parent('.slider-frame').removeClass('slider-frame_on');
			} else {
				$(this).addClass('on');
				$(this).parent('.slider-frame').addClass('slider-frame_on');
			}
		});

		bettableElements.addingChips();

		bettableElements.addingZones();

		//REMOVE BROWSER CONTEXT MENU
		// document.getElementById('settigs_btn').ontouchstart = function(e) {
		// 	e.preventDefault();z
		// };

        $('#settigs_btn').on('touchstart', function(e){
			e.preventDefault();
            $(this).addClass('active');
        });

		helpers.bind($('#settigs_btn, #dropdown_menu_bubble_list'),'touchend',function(element) {
			if ($(this).attr('id') == 'settigs_btn' && $(this).attr('active') != 'active') {
				return;
			}

			$('ul.dropdown_menu_bubble_list>li.sounds').hide();
			var sound = cookies.readCookie('sound');
			if (cookies.readCookie('sound') == null) {
				sound = 'on';
			}
			$('ul.dropdown_menu_bubble_list>li.sounds_'+sound).show();
			if (!$(element.target).parent().hasClass('sounds')) {
				$('#dropdown_menu_bubble').toggle();
			}

			if ($(this).attr('id') === 'settigs_btn') {
				// player.play('clickMenu');

				// Manage dropdown menu position when there is a bonus
				if ($('#topbar_bonus_button').css('display') !== 'none') {
					$('#dropdown_menu_bubble').css('left', '216px');
				} else {
					$('#dropdown_menu_bubble').css('left', '308px');
				}
				
                $(this)[$('#dropdown_menu_bubble').css('display') === 'none' ? 'removeClass' : 'addClass']('active');
			}

            //var e = event || window.event;
			element.preventDefault && element.preventDefault();
			element.stopPropagation && element.stopPropagation();
			element.cancelBubble = true;
			element.returnValue = false;

			return false;
		});

		bettableElements.touchEvents();

		$('#viewport, .bubble_list_item a, button').bind('touchend',function() {
			$('#dropdown_menu_bubble').hide();
			$('#settigs_btn').removeClass('active');
		});


		$('ul.dropdown_menu_bubble_list>li.sounds').bind('touchend',function() {
			eventEmitter.emit('button.sound', this);
		});

		helpers.androidChipsAlign();

		$('#bettable').live('touchstart', function() {
			$('#settigs_btn').removeClass('active');
			$('#dropdown_menu_bubble').hide();
		});
	}

	function updateOnlineStatus(event) {
		return;
		var condition = navigator.onLine ? "online" : "offline";
		if (condition != 'online') {
			helpers.showDialog('Please try reloading the game or check your internet connection.', 'Connection Error', true, {
				okButtonCallback: function() {
					window.location.reload()
				}
			});
		}
	}






});