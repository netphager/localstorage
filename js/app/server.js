define(['zepto'], function($){
	var prefs=[];
	prefs['statisticsSize'] = 6;
	prefs['ccyDecimalSeparator'] = '.';
	prefs['ccyThousandSeparator'] = ',';
	prefs['currencyCode'] = null;
	prefs['sessionId'] = null;
	prefs['playMode'] = null;
	prefs['channel'] = null;
	prefs['gameId'] = null;
	prefs['userType'] = null;
	prefs['userType'] = null;
	prefs['token'] = null;
	prefs['custId'] = null;
	prefs['initialBalance'] = null;
	prefs['dfltStake'] = null;
	prefs['stakeIncr'] = null;
	prefs['minStake'] = null;
	prefs['maxStake'] = null;
	prefs['affId'] = null;
	prefs['isLoggedIn'] = null;

	return server = {
		rgsConfig: null,
		history: [],
		configJson: {},
		lastSpinResult: {},
		urlToJson: {},
		init: function(callback) {
			var that = this;
			var configUrl = helpers.getParameterByName('config');
				configUrl = configUrl.config;
			if (!$.isEmptyObject(configUrl)) {
				configUrl = configUrl + '&version=3';
                that.urlToJson = configUrl?JSON.parse('{"' + configUrl.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
                    function(key, value) { return key===""?value:decodeURIComponent(value) }):{};
            }
            if ($.isEmptyObject(configUrl)) {
            	configUrl = 'config.json';
            }

			topbar.getPPConfig(function(configJson) {
				configJson = configJson.original;
				that.updatePrefs({
					playMode: configJson.config.base.playMode,
					channel: configJson.config.server.channel,
					gameId: configJson.config.server.gameId,
					custId: configJson.config.server.custId,
					affId: configJson.config.server.affId,
					isLoggedIn: configJson.config.topbar.isLoggedIn
				});
				that.configJson = (configJson);

				if(callback) {
					callback();
				}
			});

		},
		updatePrefs: function(newPrefs) {
			for(prop in newPrefs) {
				prefs[prop] = newPrefs[prop];
			}
		},
		getFreePlayUrl: function () {
			if (this.configJson.config.base.playMode !== "realplay")
				if (this.configJson.config.topbar.isLoggedIn === true) {
					return decodeURIComponent(this.configJson.config.topbar.realPlayURL)
				} else return decodeURIComponent(this.configJson.config.topbar.loginURL)
		},
		rgsConfigRequest: function(callback) {
			var that = this;


			var balance =  $('.balance').data('value');
			// LOAD GAME CONFIG


			if(prefs['playMode'] == 'realplay') {
				var data ={};
				if(that.configJson.config.base.debug == true && typeof(that.urlToJson.custId) != 'undefined') {
					data['custId'] = that.urlToJson.custId;
				}
				helpers.makeRequest(that.configJson.config.server.rgsConfigURL,{data:data},function(rgs) {
					 try {
						rgs = JSON.parse(rgs);
						console.log("parse json");
					} catch (e) {
						rgs = rgs;
					}

					var rgsConfig = rgs[0];

					if((rgsConfig.custId == '' || rgsConfig.custId.length == 0)  && prefs['isLoggedIn'] != true) {
						window.location = decodeURIComponent(that.configJson.config.topbar.loginURL);
					}

					custId = (prefs['custId'] == 'null' || typeof(prefs['custId']) =='undefined')
						? rgsConfig.custId : prefs['custId'];

					that.updatePrefs({
						custId: rgsConfig.custId,
						userType: rgsConfig.userType,
						token: prefs['playMode'] == 'realplay'  ? rgsConfig.token : null,
						custId: prefs['playMode'] == 'realplay' ? custId : null,
					});
					that.getConfigJSON(callback);
				});
			} else {
				that.getConfigJSON(callback);
			}

		},
		getConfigJSON:function(callback) {
			var that = this;
			var parameters = {
				"channel": prefs['channel'],
				"custId": prefs['custId'],
				"gameId": prefs['gameId'],
				"playMode": prefs['playMode'],
				"token": prefs['token'],
				"userType": 'C',
				"affId": prefs['affId']
			};

			if(prefs['playMode'] == 'realplay') {
				parameters['statisticsSize'] = prefs['statisticsSize'];
			}

			helpers.makeRequest(that.configJson.config.server.serverURL+'roulette/config.json',{type:'POST',data:JSON.stringify(parameters)},function(response) {
				topbar.afterGameConfig(response,function(){});
				var gameConfigJson = response.rouletteGameConfigWrapper;
				// update prefs
				that.updatePrefs({
					gameId: gameConfigJson.gameId,
					currencyCode:gameConfigJson.userData.currencyCode,
					sessionId: gameConfigJson.sessionId,
					initialBalance: gameConfigJson.userData.funds,
					dfltStake: gameConfigJson.defaultStake,
					stakeIncr: gameConfigJson.gameConfig.chips,
					minStake: gameConfigJson.minStake,
					maxStake: gameConfigJson.maxStake,
				});
				var json = {header: {customer: {account: {}}}, init: {betPayout: {}}};
				json.header.gameId = prefs['gameId'];
				// json.header.version = gameConfig.;
				// json.header.channel = $xml.find('GameId').attr('channel');
				json.header.customer.account = gameConfigJson.userData;
				json.header.customer.account.sessionId = prefs['sessionId'];
				json.header.customer.account.balance = prefs['initialBalance'];
				json.header.customer.account.ccyDecimalSeparator = prefs['ccyDecimalSeparator'];
				json.header.customer.account.ccyThousandSeparator = prefs['ccyThousandSeparator'];
				json.init.dfltStake = prefs['dfltStake'];
				json.init.stakeIncr = prefs['stakeIncr'];
				json.init.minStake = prefs['minStake'];
				json.init.maxStake = prefs['maxStake'];
				for(var zone in gameConfigJson.gameConfig.paytableMap.value) {
					json.init.betPayout[zone] = {};
					json.init.betPayout[zone].seln = gameConfigJson.gameConfig.paytableMap.value[zone].value['winning-numbers'];
					json.init.betPayout[zone].maxStake = gameConfigJson.gameConfig.paytableMap.value[zone].value['max-limit'];
					json.init.betPayout[zone].minStake = gameConfigJson.gameConfig.paytableMap.value[zone].value['min-limit'];
				}



				that.rgsConfig = json;
				callback(that.rgsConfig);
				// set freebet balance if available
				if(prefs['playMode'] == 'realplay') {
					var freebetBalance = gameConfigJson.userData.freeBetFunds;
					helpers.setFreeBet(freebetBalance);
					statistics = gameConfigJson.statistics;
					that.updateHistory(statistics);

				}
			});
		},
		getRgsConfig: function(){
			var that = this;

			return this.rgsConfig;
		},
		spin: function(bets, callback){
			var result = null;
			var that = this;
			var betsParam = [];
			for(var i in bets) {
				betsParam.push({
					amount: bets[i].stake,
					position: bets[i].name
				});
			}
			var parameters = {
				bets: betsParam,
				currencyCode: prefs['currencyCode'],
				sessionId: prefs['sessionId'],
			}

			if(prefs['playMode'] == 'realplay') {
				parameters['statisticsSize'] = prefs['statisticsSize'];
			}


			helpers.makeRequest(that.configJson.config.server.serverURL+'roulette/spin.json',{type:'POST',data: JSON.stringify(parameters)},function(response){

					var spinResultJson = response.rouletteGameSpinWrapper;
					that.lastSpinResult = spinResultJson;

					var statistics = spinResultJson.spinResult.ballPosition;
					if(prefs['playMode'] == 'realplay') {
						statistics = spinResultJson.statistics;
					}
					that.updateHistory(statistics);

					var json = {header: {customer: {account: {}}}, play: {betStates: {bets: {}}}};
					// json.header.gameId = $xml.find('GameId').attr('id');
					// json.header.version = $xml.find('GameId').attr('ver');
					// json.header.channel = $xml.find('GameId').attr('channel');
					json.header.customer.account = spinResultJson.userData;
					json.header.customer.account.balance = spinResultJson.userData.balanceFinal;
					json.header.customer.account.ccy_code = spinResultJson.userData.currencyCode;
					json.play.win = spinResultJson.spinResult.totalWin;
					json.play.betStates.drawn = spinResultJson.spinResult.ballPosition;
					json.play.betStates.totalBets = spinResultJson.spinResult.resultBets.length;
					for(var i in spinResultJson.spinResult.resultBets) {
						json.play.betStates.bets[spinResultJson.spinResult.resultBets[i].betId] = {
							stake: 2,
							winnings: spinResultJson.spinResult.resultBets[i].winAmount,
							// seln: that.RGSconfig.init.betPayout[spinResultJson.spinResult.resultBets[i].betId].seln
							seln: ''
						};
					}
					json.header.customer.account.freebetBalance = spinResultJson.userData.freeBalanceAfterRoll;
					callback(json);



			});
		},
		updateHistory: function(statistics) {
			if(prefs['playMode'] == 'realplay') {
				this.history = statistics;
			} else {
				this.history.push(statistics);
			}
		},
		getHistory: function(callback) {
			var that = this;
			callback(that.history);
			return;
		}
	};
});