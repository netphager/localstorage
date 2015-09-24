define(['zepto', 'server','config','player','viewport','cookies','emitter','multiTouchDot'], function($, server,config,player,viewport,cookies,eventEmitter,multiTouchDot){

	/**
	  * Polyfill for older devices
	  **/
	if(typeof Object.keys === 'undefined'){
		Object.keys = function(o){
			if(o !== Object(o)){
				throw new TypeError('Object.keys called on a non-object');
			}
			var keys = [], p;
			for(p in o){
				if(({}).hasOwnProperty.call(o, p)){
					keys.push(p);
				}
			}
			return keys;
		}
	}

	if(typeof translateCurrency !== 'object'){
		translateCurrency = {
			'EUR' : '\u20AC',
			'GBP' : '\u00A3',
			'USD' : '\u0024'
		},
		defaultCurrency = 'EUR';

		/**
		  * Converts user currency code to currency sign
		  * @return string, formatted sign consistent with the C/C++/Java/Javascript source code
		  **/
		String.prototype.currencySign = String.prototype.cSign = function(){
			code = this.toString().toUpperCase();
			return translateCurrency[Object.keys(translateCurrency).indexOf(code) !== -1 ?code:defaultCurrency];
		}
	}

	/**
	  * Format money
	  * @param  integer d - decimals e.g. if is 0, it means user does not want to show any decimal, work like rounding
	  * @param  string ds - decimal separator defaults '.'
	  * @param  string ts - thousands separator defaults ','
	  * @return string formated value
	  **/
	Number.prototype.formatMoney = Number.prototype.fMoney = function(d, ds, ts){
		var n	=	isNaN(this)	? 0 : this,							// value
		d 		=	isNaN(d) ? 2 : Math.abs(d),						// decimals
		ds 		=	(typeof ds === 'undefined') ? '.' : ds,			// decimal separator
		ts		=	(typeof ts === 'undefined') ? ',' : ts,			// thousands separator
		s		=	(n < 0) ? '-' : '',                         	// minus sign if necessary
		i		=	parseInt(n = Math.abs(n).toFixed(d), 10) + '',	// absolute value of the integer to string
		j 		=	((j = i.length) > 3) ? j % 3 : 0;
		return	s
				+	(j ? i.substr(0, j) + ts : '')
				+	i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + ts)
				+	(d ? ds + Math.abs(n - i).toFixed(d).slice(2) : '');
	}



	return helpers = {
		historyMaxNumbers: 13,
		winData: null,
		winData2: null,
		showRebet2: false,
		getTransform: function(el) {
			var transform = window.getComputedStyle(el, null).getPropertyValue('-webkit-transform');
			var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/);


			if(!results) return [0, 0, 0];
			if(results[1] == '3d') return results.slice(2,5);

			results.push(0);
			return results.slice(5, 8); // returns the [X,Y,Z,1] values
		},
		setBalance: function(balance){
			balance = Number(balance).toFixed(2);
			topbar.setBalance(balance);
			$('.balance').data('value', balance);
			var output = this.formatMoneyValue(balance);
			$('.balanceValue').html(output);
		},
		getBalance: function(){
			var balance = $('.balance').data('value');
			return topbar.getBalance();
		},
		setBet: function(bet,callback){
			var that = this;

		    topbar.setBet(parseFloat(bet));
		    $('.bet').data('value', bet);
		    var output = this.formatMoneyValue(bet.toString());
		    $('.betValue').html(output);
		    callback && callback();
		},
		getBet: function(){
			var bet = $('.bet').data('value') ? parseFloat($('.bet').data('value')) : 0;
			return topbar.getBet();
		},
		setFreeBet: function(freeBet){
			var config = server.getRgsConfig();
			var that = this;
			if(freeBet == null) freeBet = 0;
			topbar.setFreeBet(parseFloat(freeBet));
			$('.freeBet').attr('data-value', freeBet);
			$('.free_betValue').html(that.formatMoneyValue(freeBet));
		},
		getFreeBet: function(){
			var freeBet = $('.freeBet').data('value');
			return topbar.getFreeBet();
		},
		setPaid: function(paid){
			topbar.setPaid(parseFloat(paid));
			$('.paid').data('value', paid);
			var output = this.formatMoneyValue(paid);
			$('.paidValue').html(output);
		},
		getPaid: function(){
			var paid = $('.paid').data('value');
			return topbar.getPaid();
		},
		getParameterByName: function(name) {
			var urlParams;
			(window.onpopstate = function () {
				var match,
					pl     = /\+/g,  // Regex for replacing addition symbol with a space
					search = /([^&=]+)=?([^&]*)/g,
					decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
					query  = window.location.search.substring(1);

				urlParams = {};
				while (match = search.exec(query))
				   urlParams[decode(match[1])] = decode(match[2]);
			})();
			return urlParams;
		},
		formatMoneyValue: function(money){

			var config = server.getRgsConfig();
			return String(config.header.customer.account.currencyCode).cSign() + Number(money).
				fMoney(2,config.header.customer.account.ccyDecimalSeparator,config.header.customer.account.ccyThousandSeparator);
		},
		thousandsSeparator: function(input) {
			var output = input;
			if (parseFloat(input)) {
				input = new String(input);
				var parts = input.split(".");
				parts[0] = parts[0].split("").reverse().join("").replace(/(\d{3})(?!$)/g, "$1,").split("").reverse().join("");
				output = parts.join(".");
			}

			return output;
		},
		setHistoryMaxNumbers: function(maxNumbers){
			if(typeof(maxNumbers) !== 'number'){
				console.error('History maxNumbers must be a number!');
			}
			this.historyMaxNumbers = maxNumbers;
		},
		getHistoryMaxNumbers: function(){
			return this.historyMaxNumbers;
		},

		showDialog: function(message, title,okButton,options){
			$('#settigs_btn').attr("active", "inactive").css('opacity', '0.5');

			if(okButton) {
				okButton = true;
			}
/*			if(player.audioLoaded === true) {
				if (title == 'Connection Error' || title == 'Server Error') {
					try {
						player.stop();
					} catch (e) { ; }
					$('#viewport').show();
				} else if(title == 'Max Payout reached') {
	                // don't stop player
					// see https://behappy.cayetano.bg/task/id/28870
				} else {
					player.stop();
					player.play('placeChipError');
				}
			}*/
			var defaultOptions = {
				additionalDialogClasses: null,
				okButtonCallback: null
			};
			var opts = $.extend(defaultOptions, options);
			// screenSize = viewport.getScreenSize();

			/*if(title == 'Bet Error') {
			}*/

			var $dialog = $('#dialog');
			var that = this;
			if(typeof(title) === 'undefined'){
				title = 'SYSTEM ERROR';
			}
			if(typeof(message) === 'undefined'){
				console.error('First param(message) is required!');
				return;
			}
			$('#title', $dialog).text(title);
			$('#message', $dialog).html(message);
			setTimeout(function() {

				$dialog.css('margin-top','-'+((parseInt($dialog.height()) / 2) + 40 )+ 'px');
				if(okButton === true) {
					$dialog.css({'visibility': 'visible', 'opacity': 1});
				}
			}, 100);
			if (opts.additionalDialogClasses) {
				$dialog.addClass(opts.additionalDialogClasses);
				$dialog.data('additionalClasses', opts.additionalDialogClasses);
			}



			if(okButton === true) {
				$('#page_change_overlay').css({ 'z-index' : 290,'opacity': 0.5});
				$('#errorDialogLinkArea').show().live('touchend',function(){
					$('#settigs_btn').attr("active", "active").css('opacity', '1');
					if (opts.okButtonCallback) {opts.okButtonCallback();opts.okButtonCallback = false}
					that.hideDialog();
					$('#movingChip').hide();
					$('#bettableHover, .bettableHoverAdditional').hide();
				});
			} else {
				// fade in
				$('#settigs_btn').attr("active", "active").css('opacity', '1');
				$('#errorDialogLinkArea').hide();
				$('#page_change_overlay').css('z-index', 290).animate({'opacity': 0.5},250,'linear',function() {
					$dialog.css('opacity', 0).css('visibility','visible').animate({opacity : 1}, 250);
				});
				$('#movingChip').hide();
				$('#bettableHover, .bettableHoverAdditional').hide();
			}

		},
		hideDialog: function(){
			var $dialog = $('#dialog');
			var removeAdditionalClasses = function () {
				if ($dialog.data('additionalClasses')) {
					$dialog.removeClass($dialog.data('additionalClasses'));
					$dialog.data('additionalClasses','');
				}
			};

			if($('#errorDialogLinkArea').css('display') != 'none') {
				$dialog.css({visibility:'hidden', opacity: 0});
				$('#page_change_overlay').css({'z-index' : -1,'opacity': 0});
				removeAdditionalClasses();
			} else {
				// fade out
				$('#dialog').animate({'opacity' : 0}, 250,'linear',function() {
					$(this).css('visibility','hidden').css('opacity', 0);
					removeAdditionalClasses();
				});
				$('#page_change_overlay').animate({'opacity': 0},250,'linear',function() {
					$(this).css('z-index', -1);
				});
			}


		},
		androidChipsAlign: function () {
			if ((viewport.isS2 && viewport.isAndroidDefault) || (viewport.isS3 && viewport.isAndroidDefault) )  {
				$('.chips_list_item span').css('line-height', '64px');
			}
		},
		isVis: function (ele) {
			if(ele.css('display')!='none' && ele.css('visibility')!='hidden' && ele.height()>0) {
				return(true);
			} else {
				return(false);
			}
		},
		getTableColor: function(){
			if(server.configJson.config.base.playMode == 'realplay') {
				return (localStorage.getItem('tableColor_'+server.configJson.config.server.custId) !== null) ?  localStorage.getItem('tableColor_'+server.configJson.config.server.custId) : 'green';
			} else {
				return (localStorage.getItem('tableColor') !== null) ?  localStorage.getItem('tableColor') : 'green';
			}

		},
		setTableColor: function(color) {
			var cookieName = 'tableColor';
			if(server.configJson.config.base.playMode == 'realplay') {
				cookieName += '_'+server.configJson.config.server.custId;
			}

			$('#rouletteWheelBackground').attr('class', 'rouletteWheelBackground bg_' + color);


			if (color != 'green') {
				$('.betBgColors').css('background', "url('img/bettable-"+color + (viewport.longerAspectRatio ? '_ios7' : '') +".jpg') no-repeat");
				if(viewport.longerAspectRatio){
					$('.betBgColors').css('background-position', '-27px 0');
				}
			} else {
				$('.betBgColors').css('background', "none");
			}

			localStorage.setItem(cookieName, color, 365);
		},
		showButtons:function(container) {
			if(typeof(container) != 'undefined') {
				$('#buttonsContainer'+container).show();
				return;
			}
			var curPage = page.getCurrentPage().attr('id');
			if(curPage == 'bettable') {
				if(this.showRebet2 === true) {
					$('#buttonUndo').hide();
					$('#buttonRebet2').show();
				} else {
					$('#buttonRebet2').hide();
					$('#buttonUndo').show();
				}
				$('#buttonsContainer1').show();
			} else if(curPage == 'maingame' && animationsGLobal.ballLanded === true) {
				$('#buttonsContainer2').show();
			}
		},
		hideButtons: function(container) {
			if(typeof(container) != 'undefined') {
				$('#buttonsContainer'+container).hide();
			} else {
				$('.bettable_nav_item').hide();
			}
		},
		isEventAllowed: function(callback,param,curentElement) {
			window.addEventListener("orientationchange", function () {
				if (window.orientation == 0 || window.orientation == 180) {
					multiTouchDot.preventTouches = true;
				} else {
					multiTouchDot.preventTouches = false;
				}
			}, false);
			if(multiTouchDot.preventTouches === true) {
				// if(parseInt($('#bettableHover').css('width')) != 0) {
				// 	bettable.clearHovers();
				// 	bettableFrench.clearHovers();
				// }
				return false;
			} else {
				callback.call(curentElement,param);
				return true;
			}
		},
		bind: function(element,eventType, callback) {
			var that = this;
			element.bind(eventType, function(e) {
				var curentElement = $(this);
				that.isEventAllowed(callback,e,curentElement);
			});

		},
		makeRequest: function(url,prefs,callback) {
			var that = this;
			var splittedUrl = url.split('/');
			var action = splittedUrl[splittedUrl.length - 1].replace('.json','');
			var type = typeof(prefs.type) == 'undefined' ? 'GET' : prefs.type;
			var request = {
				url: url,
				type: "GET",
				// async: false,
				timeout: 30000,
				dataType: 'json',
				beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                    topbar.notifyGameRequestSend(action,url,prefs.data ? prefs.data : {})
                },
				success:function(response) {
					topbar.notifyGameRequestSuccess(action,url,response);

					// HANDLE ERRORS
					if(typeof(response.error) != 'undefined') {
						if(response.error.type == 'INSUFFICIENT_FUNDS') {
							that.showDialog(response.error.msg, 'Error',
								true, {
									okButtonCallback: function () {
											player.stop();
											animationsGLobal.ballLanded = true;
											eventEmitter.emit('button.new_bet_btn');
										}
									}
								);
						} else if(response.error.code == 'INVALID_OR_EXPIRED_SESSION') {
							that.showDialog(response.error.msg, '',
								true, {
									okButtonCallback: function () {
											window.location.reload();
										}
									}
								);
						} else {
							that.showDialog(response.error.msg, 'Error',
								true, {
									okButtonCallback: function () {
											window.location.reload();
										}
									}
								);
						}

						that.hideButtons();
						return false;
					}

					callback(response)
				},
				error: function(xhr, text, error) {
					topbar.notifyGameRequestFail(action,url,text);
					that.showDialog(
						'Please try reloading the game or check your internet connection.',
						'Connection Error',
						true, {
							okButtonCallback: function () { window.location.reload() }
						}
					);
					// $('#preloader').show();
					// $('#buttonStart').hide();
				}
			};

			for(var typeIndex in prefs) {
				request[typeIndex] = prefs[typeIndex];
			}

			if(type == 'POST') {
				request.contentType = "application/json";
				request.dataType = 'json';
			}
			// setTimeout(function() {
				$.ajax(request);
			// },10000);
		}

	};
});
