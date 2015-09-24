define(['zepto', 'emitter', 'server', 'config', 'animations', 'cookies', 'page', 'player', 'helpers', 'bettable_elements','bettable_animations', 'viewport'], function($, eventEmitter, server, config, animations, cookies, page, player, helpers, bettableElements,bettableAnimations, viewport){
	bets = new Object(); // DO  NOT CHANGE!!!
	withSound = false;
	lastBets = new Object();
	chipId = 0;
	var undoStates = new Array();
	// var animations = new animations();
	// var player = new jukebox.Player(config.sound);
	var lastStates = [];
	var lastStatesBets;
	var lastPage = '';
	var totalBet = 0;

	// window.addEventListener("offline", function(e) {
	// 	helpers.showDialog(
	// 		'Please try reloading the game or check your internet connection.',
	// 		'Connection Error',
	// 		true, {
	// 			okButtonCallback: function () { window.location.reload() }
	// 		}
	// 	);
	// }, false);

	function calculateStake(){
		$('div.bet_image').each(function() {
			bets[$(this).data('bet')] = 0;
		});
		$('div.bet_image').each(function() {
			bets[$(this).data('bet')] += $(this).data('stake');
			totalBet += $(this).data('stake');
		});
	}




	function calcChange(value) {
		var config = server.getRgsConfig();
		var self = this,
			res = {}, nominals = config.init.stakeIncr,
			factor = 100,
			overage = 0;
		value = parseInt(value.toString().replace('.', ''), 10);
		for (var i = nominals.length - 1; i >= 0; i--) {
			var chipVal = parseInt(parseFloat(nominals[i]) * factor),
				c = value / chipVal;
			if (c >= 1) {
				res[nominals[i]] = Math.floor(c);
				var denom = parseFloat(res[nominals[i]] * chipVal);
				value -= denom
			};
			overage = value
		};
		var fraction = (overage / factor),
			ret = [];
		if (fraction > 0) {
			nominals.unshift(fraction);
			res[fraction] = 1
		};
		for (v in nominals)
			if (res.hasOwnProperty(nominals[v])) {
				var tmp = {};
				tmp.nominal = nominals[v];
				tmp.count = res[nominals[v]];
				ret.push(tmp)
			};
		return ret.reverse()


		// var config = server.getRgsConfig();
		// var result = new Object();
		// var coins = [];

		// for (var i = config.init.stakeIncr.length - 1; i >= 0; i--) {
		// 	var count = Math.floor(value / parseFloat(config.init.stakeIncr[i]));
		// 	result[config.init.stakeIncr[i]] = count;
		// 	value -= count * parseFloat(config.init.stakeIncr[i]);
		// }

		// return result;
	};
	function placeBet(bet, value, withAnimation,push,undoChipId) {
		if(placeBetLocked === true) {
			return;
		}
		if(withSound) {
			player.play('placeBet');
		}

		if(typeof withAnimation == 'undefined' || withAnimation == 'undefined'){
			withAnimation = false;
		}
		if(bettableElements.addingChipsAfterSpin === true) {
			bettableElements.addingChipsAfterSpin = false;
			$('.bet_image').remove();
		}
		helpers.setPaid('0');
		if (value > 0) {
			var element = bettableElements.hoverAreas[bet];
			var x = element.left + element.width / 2 - 16.5;
			var y = element.top + element.height / 2 - 16.5;

			placeChips(bet, value, x, y,push,undoChipId);
		}
	}
	function objectFindByKey(array, key, value) {
		for (var i = 0; i < array.length; i++)
			if (array[i][key] === value || array[i].value === value) return {
				stake: array[i].value,
				color: array[i].color,
				label: array[i][key]
			};
		return {
			stake: value,
			color: 'gray',
			label: value
		}
	};
	function placeChips(bet, value, x, y,push,undoChipId){

		$('div.bet_image.' + bet).remove();
		var change = calcChange(value.toFixed(2));
		var first = true;
		// var stakeValue = 0;
		// undoStates = [];
		// document.getElementById('bets').innerHTML ='';
		for (var c in change) {
			for (var i = 0; i < change[c].count; i++) {

				chipId++;

				var chipLabel = change[c].nominal;

				chipLabel = chipLabel % 1 == 0 ? parseInt(chipLabel) : chipLabel;
				if (chipLabel >= 1000) {
					chipLabel = (chipLabel / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
				}
				// chipLabel = parseFloat(bettableElements.chipLabelGenerator(chipLabel));
				// if(typeof(undoChipId) == 'undefined' || undoChipId == 'undefined') {
				// 	undoChipId = '';
				// }
				var color = $('#scrollerWrapper ul li[data-label="'+chipLabel+'"] span').data('value');
				if(typeof(color) == 'undefined') {
					color = 'gray';
				}
				var html = '<div id="'+bet+'_'+chipId+'" data-stake='+chipLabel+' data-bet="'+bet+'" class="bet_image '+ bet + '"  style="'+
					'left: ' + x + 'px; top: ' + y + 'px; "><span class="chipBg '+ color +'_small_chip "><span class="chipLabel">'+chipLabel+'</span></span></div>';

					$('#bets').append(html);
				// document.getElementById('bets').innerHTML += html;
				// console.log(document.getElementById('bets').innerHTML);
				// stakeValue += parseFloat(chipLabel);
				x -= 2;
				y -= 2;
				first = false;
			}
		}

		if ((viewport.isS2 && viewport.isAndroidDefault ) || (viewport.isS3 && viewport.isAndroidDefault ))  {
			$('.chipLabel').addClass('fixLH');
		}

	}
	eventEmitter.on('button.home', function(){
		window.location = decodeURIComponent(server.configJson.config.server.portalRefreshURL);
	});
	eventEmitter.on('button.help', function(){
		window.open(server.configJson.config.topbar.helpURL, "_blank");
	});
	eventEmitter.on('button.start', function(){
		// helpers.showButtons(1);
		stateMachine.load();

		var tColor = helpers.getTableColor();
		if (tColor != 'green') {
			// alert(viewport.longerAspectRatio);
			$('.betBgColors').css('background', "url('img/bettable-"+tColor + (viewport.longerAspectRatio ? '_ios7' : '') +".jpg') no-repeat");
			if(viewport.longerAspectRatio){
				$('.betBgColors').css('background-position', '-27px 0');
			}
		} else {
			$('.betBgColors').css('background', "none");
		}

		$('#rouletteWheelBackground').attr('class', 'rouletteWheelBackground bg_' + tColor);

		animations.domReady();

	});

	eventEmitter.on('button.spin', function(){
		topbar.allowStake(topbar.getBet(),'stakeValue',function() {
			if(buttonsLocked === true) {
				return;
			}
			if(viewport.deviceOrientation() != config.gameSize.orientation && !topbar.viewport.isAndroid) {
				return;
			}

			$('#settigs_btn').attr('active','inactive').css('opacity', '0.5');
			placeBetLocked = true;

			/*var emptyObject = true;
			for (  ) {
				emptyObject = false;
			}*/
			if ( Object.keys(bets).length == 0 ) {
				$('.bet_image').remove();
				$('#movingChip').hide();
				helpers.showDialog('Please bet first', 'Bet Error', true, {additionalDialogClasses:'shortMsg'});
				placeBetLocked = false;
				return ;
			}
			// $('#buttonSpin').hide();

			//bettableAnimations.paymentAnimationStop = false;
			bettableElements.addingChipsAfterSpin = true;
			helpers.setPaid('0');
			undoStates = new Array();
			lastStates = new Array();

			stateMachine.getResponse(bets);
			return false;
		},function() {

		})



	});
/*
	eventEmitter.on('button.paytable', function(){
		page.showPage('paytable',function() {},'slider');
	});*/

	eventEmitter.on('button.new_bet_btn', function(){
		if(buttonsLocked === true) {
			return;
		}
		animations.hideNav();
		animations.stop();
		// $('.winbox').css('left', '-142px');
		bettableAnimations.removeAllChips(helpers.winData2);
		helpers.setBet('0');
		// See this : https://behappy.cayetano.bg/task/id/28758
		$('#pickNumber').val('-1');
		stateMachine.bettable(parseInt($('#pickNumber').val()), helpers.winData);
		return false;
	});

	eventEmitter.on('button.paytable', function(){
		if(animations.ballLanded == false) {
			return;
		}
		placeBetLocked = true;
		$('#dropdown_menu_bubble').hide();
		if (page.getCurrentPage().attr('id') === 'bettable') {
			lastPage = 'bettable';
		} else if (page.getCurrentPage().attr('id') === 'maingame') {
			lastPage = 'maingame';
		}
		animations.hideNav();
		// player.play('putWinningChips');
		page.showPage('paytable',function() {},'slider');
	});

	eventEmitter.on('button.options', function(){
		if(animations.ballLanded == false) {
			return;
		}
		placeBetLocked = true;
		$('#dropdown_menu_bubble').hide();
		that = this;
		var tableColor = helpers.getTableColor();



		if (page.getCurrentPage().attr('id') === 'bettable') {
			lastPage = 'bettable';
		} else if (page.getCurrentPage().attr('id') === 'maingame') {
			lastPage = 'maingame';
		}

		$('.colors_selected', $('.options_list_colors')).hide();
		$('.colors_' + tableColor).parent().find('img.colors_selected').show();

		$('.table_color').click(function(event){
			// alert($(event.target).data('color'))
			helpers.setTableColor($(event.target).data('color'));
			$('.colors_selected', $('.options_list_colors')).hide();
			$('.colors_' + $(event.target).data('color')).parent().find('img.colors_selected').show();
			return false;
		});
		animations.hideNav();
		// player.play('putWinningChips');
		page.showPage('options',function() {},'slider');
	});

	eventEmitter.on('button.history', function(){
		if(animations.ballLanded == false) {
			return;
		}
		placeBetLocked = true;
		$('#dropdown_menu_bubble').hide();
		var config = server.getRgsConfig();

		server.getHistory(function(serverHistory) {
			$('ul#history_numbers').html('<li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>');

            if (server.configJson.config.base.playMode === 'realplay') {
            	serverHistory.reverse();
			}

			for(var i in serverHistory) {
				console.log(serverHistory[i]);
				var classes = 'numbers_list_item';
				if($.inArray(serverHistory[i], config.init.betPayout.OUTSIDE_RED.seln) !== -1){
					classes += ' number_list_item_red';
				} else if(serverHistory[i] == 0){
					classes += ' number_list_item_green';
				}
				$('ul#history_numbers').prepend('<li class="' + classes + '"><span>' + serverHistory[i] + '</span></li>');
				$('ul#history_numbers').find('li').last().remove();
			}

			if (page.getCurrentPage().attr('id') === 'bettable') {
				lastPage = 'bettable';
			} else if (page.getCurrentPage().attr('id') === 'maingame') {
				lastPage = 'maingame';
			}
			animations.hideNav();
			page.showPage('history',function() {},'slider');
		});

	});

	eventEmitter.on('button.historyClose', function(){
		buttonsLocked = false;
		$('#dropdown_menu_bubble').hide();
		// player.play('putWinningChips');
		page.showPage(lastPage, function() {
			if (lastPage === 'maingame') {
				animations.domReady();
				animations.showNav(true);
			} else {
				bettableElements.setupBettingChipsIScroll();
				placeBetLocked = false;
				// animations.showNav(false);
			}

		},'slider');


	});

	eventEmitter.on('button.paytableClose', function(){
		buttonsLocked = false;
		$('#dropdown_menu_bubble').hide();
		// player.play('putWinningChips');
		page.showPage(lastPage, function() {},'slider');
		if (lastPage === 'maingame') {
			animations.domReady();
			setTimeout(function () {
				animations.showNav(true);
			}, 500);
		} else {
			placeBetLocked = false;
			bettableElements.setupBettingChipsIScroll();
			// animations.showNav(false);
		}
	});

	eventEmitter.on('button.optionsClose', function(){
		buttonsLocked = false;
		$('#dropdown_menu_bubble').hide();
		// player.play('putWinningChips');
		$('.replaced_bettable').hide();
		if (helpers.getTableColor() != 'green') {
			$('.betBgColors').css('background', "url('img/bettable-"+helpers.getTableColor() + (viewport.longerAspectRatio ? '_ios7' : '') +".jpg') no-repeat");
			if(viewport.longerAspectRatio){
				$('.betBgColors').css('background-position', '-27px 0');
			}
		} else {
			$('.betBgColors').css('background', "none");
		}
		page.showPage(lastPage, function() {},'slider');
		if (lastPage === 'maingame') {
			animations.domReady();
			setTimeout(function () {
				animations.showNav(true);
			}, 500);
		} else {
			placeBetLocked = false;
			bettableElements.setupBettingChipsIScroll();
			// animations.showNav(false);
		}

	});

	eventEmitter.on('button.undo', function(){
		if(buttonsLocked === true) {
			return;
		}
		player.play('clearUndoChips');
		var undoStatesCount = undoStates.length;
		var lastStatesCount = lastStates.length;
		if (undoStatesCount > 0) {
			totalBet = 0;
			var states = undoStates.pop();
			// console.log(states);
			if(!(states instanceof Array)) {
				states = [states];
			}

			var oldBets = $.extend({}, bets);


			states.forEach(function(state) {
				// var last = undoStates.length-1;

				// if(realValue) {
					bets[state.bet] -= state.stake;
				// } else {
					if (bets[state.bet] <= 0) {
						delete bets[state.bet];
					}
					$('div.bet_image.' + state.bet).remove();
				// }

			});
			for(var i in bets) {
				if(oldBets[i]!=bets[i]) {
					$('div.bet_image.' + i).remove();
					placeBet(i,bets[i],false,false);
				}
			}

			calculateStake();

			helpers.setBet(totalBet);
		} else if(undoStatesCount == 0 && lastStatesCount > 0){
			totalBet = 0;
			for(state in lastStates){
				var stateObj = lastStates[state];
				placeBet(stateObj.bet, stateObj.stake);
				//totalBet += stateObj.stake;
				bets[stateObj.bet] = stateObj.stake;
			}
			calculateStake();
			undoStates = lastStates;
			helpers.setBet(totalBet);
		} else if(undoStatesCount == 0) {
			// delete type clear states
			helpers.setBet('0');
			if($('div.bet_image').length != 0) {
				$('div.bet_image').each(function(){
					delete bets[$(this).data('bet')];
					$(this).remove();

				});
				return false;
			}
		}

	});

	eventEmitter.on('button.clear', function(){
		if(buttonsLocked === true) {
			return;
		}
		player.play('clearUndoChips');
		$('#buttonRebet2').hide();
		$('#buttonUndo').show();
		$('#bets div.bet_image').remove();
		if(undoStates.length != 0){
			lastStates = undoStates;
		}
		bets = new Object();
		undoStates = new Array();
		lastStates = [];
		helpers.setBet(0);
	});

	eventEmitter.on('button.bettable', function(){
		// BETTABLE

		stateMachine.bettable();
	});

	eventEmitter.on('chip.click', function(element){

		var elId = $(element).attr('id');
		if($('.chips_selected').attr('id') !== elId){
			player.play('chipSwitchColor');
			$('.chips_selected').removeClass('chips_selected');
			$(element).addClass('chips_selected');
			bettableElements.chipScrollerReloader(element);
		}
	});

	eventEmitter.on('button.sound', function(element,mode){
		if(typeof(mode) == 'undefined') {
			if($(element).hasClass('sounds_on')) {
				mode = 'off';
			} else {
				mode = 'on';
			}
		}

		if(mode == 'off'){
			player.setMute();
			player.setVolume(0);
			cookies.createCookie('sound', 'off', 365);
			$('ul.dropdown_menu_bubble_list>li.sounds_on').hide();
			$('ul.dropdown_menu_bubble_list>li.sounds_off').show();
		} else {
			player.unMute();
			player.setVolume(1);
			cookies.createCookie('sound', 'on', 365);
			$('ul.dropdown_menu_bubble_list>li.sounds_off').hide();
			$('ul.dropdown_menu_bubble_list>li.sounds_on').show();
		}
	});

	eventEmitter.on('button.back', function(){

	});

	eventEmitter.on('button.close', function(){
		stateMachine.close();
	});

	eventEmitter.on('button.respin', function(){
		stateMachine.getResponse(bets);
	});

	eventEmitter.on('button.buttonRebetSpin', function() {
		topbar.allowStake(topbar.getBet(),'stakeValue',function() {
			if(buttonsLocked === true) {
				return;
			}
			if(viewport.deviceOrientation() != config.gameSize.orientation) {
				return;
			}
			$('#settigs_btn').attr('active','inactive').css('opacity', '0.5');
			// $('.winbox').css('left', '-142px');

			bets = lastBets;
			undoStates = new Array();
			var state = [];
			totalBet = 0;
			for (var bet in bets) {
				totalBet += bets[bet];
			}

			undoStates = state;
			helpers.setBet(totalBet,animations.prepareSpin.bind(animations));
		});
	});

	eventEmitter.on('button.rebet', function(){
		if(buttonsLocked === true) {
			return;
		}
		bets = lastBets;
		undoStates = new Array();
		var state = [];
		totalBet = 0;
		cnt = 0;
		for (var bet in bets) {
			totalBet += bets[bet];
			cnt++;
		}

		for (var bet in bets) {
			state.push({'bet': bet, 'stake': bets[bet]});
		}

		helpers.setBet('0');
		helpers.setPaid('0');
		animations.stop();
		animations.hideNav();
		undoStates.push(state);
		helpers.setBet(totalBet);
		player.play('rebetDouble');
		$('#bettableHover').hide();
		$('.bettableHoversAdditional').remove();

		for (var bet in bets) {
			placeBet(bet, bets[bet]);
		}
		bettableElements.addingChipsAfterSpin = false;
		stateMachine.bettable('rebet');
	});

	eventEmitter.on('button.rebet2', function(){
		if(buttonsLocked === true) {
			return;
		}
		var singleBet = bets;
		bettableAnimations.paymentAnimationStop = true;
		//$('.bet_image, img[data-chip="profit_chips"], .baloon, .winHover').remove();
		var config = server.getRgsConfig();
		var newBets = new Object();
		// undoStates = new Array();
		bets = lastBets;
		var state = [];

		for (var bet in bets) {
			newBets[bet] = bets[bet] * 2;
			var configBet = bet.substr(0, 5) == 'PICK_' ? 'PICK_1' : bet;
			var maxStake = parseFloat(config.init.betPayout[configBet].maxStake);
			if (newBets[bet] > maxStake) {
				helpers.showDialog('Bet exceeds max stake!', 'Bet Error', true, {okButtonCallback: function() {
					$('#buttonRebet2').hide();
					$('#buttonUndo').show();
				}});
				// bets = new Object();
				return;
			}
		}

		$('#bettableHover').hide();
		$('.bettableHoversAdditional').remove();

		$('#buttonRebet2').hide();
		$('#buttonUndo').show();
			helpers.showRebet2 = false;

		// bets = newBets;
		fullBet = 0;
		for (var bet in bets) {
			state.push({'bet': bet, 'stake': bets[bet]});

		}

		helpers.setBet('0');
		undoStates.push(state);
		bets = newBets
		// adding undostates
		for (var bet in bets) {
			placeBet(bet, bets[bet],false,false,false);
			fullBet += bets[bet];
		}

		calculateStake();
		helpers.setBet(fullBet);
		player.play('rebetDouble');
	});

	eventEmitter.on('bettable.mouseover', function(id){
		if(viewport.isiPod4) {
			return;
		}
		$('#bettableHover').hide();
		$('.bettableHoversAdditional').remove();
		var area = areas[id];
		var useDefault = true;
		for (var a in area) {
			if(useDefault) {
				var style = 'display: block; opacity: 0.5; background-color: white; position: absolute; left: ' + area[a].coord[0] + 'px; top: ' + area[a].coord[1] + 'px; width: ' + area[a].coord[2] + 'px; height: ' + area[a].coord[3] + 'px;';
				if (typeof area[a].rounding != 'undefined') {
					style += ' ' + area[a].rounding;
				}
				$('#bettableHover').attr('style', style);
				useDefault = false;
			} else {
				var style = 'display: block; opacity: 0.5; background-color: white; position: absolute; left: ' + area[a].coord[0] + 'px; top: ' + area[a].coord[1] + 'px; width: ' + area[a].coord[2] + 'px; height: ' + area[a].coord[3] + 'px;';
				if (typeof area[a].rounding != 'undefined') {
					style += ' ' + area[a].rounding;
				}
				var html = '<div class="bettableHoversAdditional" style="' + style + '"></div>';
				$('#bets').append(html);
			}
		}
	});

	eventEmitter.on('bettable.mouseout', function(){
		$('#bettableHover').hide();
		$('.bettableHoversAdditional').remove();
	});

	eventEmitter.on('bettable.click', function(bet, currentChip){
		if(placeBetLocked === true) {
			return;
		}
		withSound = true;
		if ($('#pawn').length > 0) {
			bets = new Object();
			undoStates = new Array();
			helpers.setBet(0);
			$('#pawn').remove();
			// $('#new_bet_btn').hide();
			// $('#buttonSpin').show();
		} else {
			// $('#buttonSpin').show();
		}
		totalBet = helpers.getBet();

		var config = server.getRgsConfig();
		// var configBet = bet.substr(0, 5) == 'PICK_' ? 'PICK_1' : bet;

		var stakeStr = /*currentChip !== null ? currentChip.attr('value') :*/ $('.chips_selected').attr('value');
		var stake = stakeStr ? parseFloat(stakeStr) : 0;
		var minStake = parseFloat(config.init.betPayout[bet].minStake);
		var maxStake = parseFloat(config.init.betPayout[bet].maxStake);
		var balance = helpers.getBalance();

		if (typeof bets[bet] != 'undefined') {
			var newStake = bets[bet] + stake;
		} else {
			var newStake = stake;
		}

		if (minStake != '' && newStake < config.init.betPayout[bet].minStake) {
			var minStake = helpers.formatMoneyValue(minStake)
			helpers.showDialog('Minimum stake is ' + minStake, 'Bet Error', true, {additionalDialogClasses:'shortMsg'});
			$('#movingChip').hide();
			withSound = false;
			return;
		}
		// if (maxStake != '' && newStake > 2000) {
		if (maxStake != '' && newStake > config.init.betPayout[bet].maxStake) {
			var maxStake = helpers.formatMoneyValue(maxStake)
			helpers.showDialog('Maximum stake is ' + maxStake, 'Max Bet', true, {additionalDialogClasses:'shortMsg'});
			$('#movingChip').hide();
			withSound = false;
			return;
		}

		totalBet += stake;


		if(totalBet>config.init.maxStake) {
			var maxStake = helpers.formatMoneyValue(config.init.maxStake)
			helpers.showDialog('Maximum total stake is ' + maxStake, 'Max Bet', true);
			$('#movingChip').hide();
			withSound = false;
			return;
		}


		helpers.setBet(totalBet);

		bets[bet] = newStake;

		if(viewport.isMobile){
			placeBet(bet, newStake, true);
		} else {
			placeBet(bet, newStake);
		}
		undoStates.push({
			'bet' : bet,
			'stake' : stake
		});
		withSound = false;
	});
	return events_GLOBAL = {placeBet: placeBet};
});

