define(['zepto', 'server','helpers','player','cookies','bettable_elements'], function($, server,helpers,player,cookies, bettableElements){
	return {

		totalWin: 0,
		animationDurations: {
			showWinner : 1000,
			removeLoseChips: 1000,
			addWinningChips: 1000,
			removeWinChips: 1000,
			animationPause: 1000
		},
		hasWin: false,
		removeAllChips: function(param1) {
			var pickZone = pickZones[param1];
			for (bet in lastBets) {
				var betChips = $('div.' + bet +', img.'+bet);
				betChips.each(function(i,el){
					$(this).remove();
				});
			}
		},
		getHasWin: function(param1) {
			var pickZone = pickZones[param1];
			var tableHeight = $('#bettable').height();
			
			for (bet in lastBets) {
				if (pickZone.indexOf(bet) != -1) {
					return true;
				}
			}
		},
		removeChips: function(param1) {
			var pickZone = pickZones[param1];
			this.hasWin = false;
			var tableHeight = $('#bettable').height();
			
			for (bet in lastBets) {
				var betChips = $('div.' + bet +', img.'+bet + ', .baloon_'+bet);
				if (pickZone.indexOf(bet) == -1) {
					betChips.each(function(i,el){
						$(this).animate(
							{
								top: (parseInt($(this).css('top'))-50)+'px',
								opacity: 0
							},
							{
								duration: 500,
								complete: function() {
									$('.baloon_'+bet).remove();
									$(this).remove();
								}
							}
						);
					})
				} else {
					this.hasWin = true;
					betChips.css({top: tableHeight + 37+"px"}).addClass('winChips');
					betChips.bind("transitionend webkitTransitionEnd" , function(){ 
						$('.baloon_'+bet).remove();
						$(this).remove();
					 });
				}
			}
		},

		showWinnerDialog: function(callback,zones) {
			var timeout = 0;
			var that = this;
			that.totalWin = 0;
			var winningZones = zones.play.betStates.bets;

			$.each(winningZones,function(index,value) {				
				winnings = parseFloat(winningZones[index].winnings);				
				if(winnings != 0.00) {
					that.totalWin += winnings;			
				}
			});
			if(that.totalWin > 0) {
				var title = 'You win:';
				var text  = (server.getRgsConfig().header.customer.account.ccyCode == 'GBP' ? '£' : '€') + this.totalWin.toFixed(2);
				
			
				helpers.showDialog(text,title,false,{additionalDialogClasses:'shortMsg youWinDialog'});
				// $('#buttonOK').hide();
				setTimeout(function() {
					helpers.hideDialog();
					if(typeof(callback) == 'function') {
						callback();
					}
				}, 2000)
			} else {
				if(typeof(callback) == 'function') {
					callback();
				}
			}
			
		},
	}
});