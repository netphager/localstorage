define({
	viewportElements: {
		'viewportContainer': 'viewport',
		'gameContainer': 'content',
		'gameBackground': 'wrapper',
		'preloader': 'preloader',
		'landscapeMessage': 'landscapeMessage',
		'debugMenu': 'debugMenu',
		'overlay': 'page_change_overlay'
	},
	gameSize: {
		width: 733,
		height: 384,
		orientation: 'landscape'
	},

	eventEmitter: {
		wildcard: true, // should the event emitter use wildcards.
		newListener: false, // if you want to emit the newListener event set to true.
		maxListeners: 15 // the max number of listeners that can be assigned to an event, defaults to 10.
	},
	preloader: {
		maxTimeToLoad: 40
	},
	pages: {
		'maingame': '#maingame',
		'paytable': '#paytable',
		'options' : '#options',
		'bettable': '#bettable',
		'history': '#history',
		'preloader': '#preloader',
	},
	requestedPage: false,
	currentPage: false,
	'sound': {
		resources: [
		'sounds/sounds.mp3'
		// 'sounds/sounds.ogg',
		],
		spritemap: {
			'empty':{
				'start':0.01,
				'end':0.5,
				'loop':false
			},
			/*'ballFall3': {
				'start': 11.28,
				'end': 11.80,
				'loop': false
			},
			'ballFall4': {
				'start': 11,
				'end': 11.80,
				'loop': false
			},*/
			'ballFall5': {
				'start': 11.04,
				'end': 11.80,
				'loop': false
			},
			'ballFall6': {
				'start': 10.99,
				'end': 11.80,
				'loop': false
			},
			'ballFall7': {
				'start': 10.88,
				'end': 11.80,
				'loop': false
			},
			'ballFall8': {
				'start': 10.75,
				'end': 11.80,
				'loop': false
			},
			'ballFall9': {
				'start': 10.61,
				'end': 11.80,
				'loop': false
			},
			'ballFall10': {
				'start': 10.47,
				'end': 11.80,
				'loop': false
			},
			'ballFall11': {
				'start': 10.45,
				'end': 11.80,
				'loop': false
			},
			'ballFall12': {
				'start': 10.36,
				'end': 11.80,
				'loop': false
			},
			'ballLoop': {
				'start': 13.03,
				'end': 22.30,
				'loop': false
			},
			'chipSwitchColor': {
				'start': 0.96,
				'end': 1.60,
				'loop': false
			},
			'placeBet': {
				'start': 1.95,
				'end': 2.6,
				'loop': false
			},
			'rebetDouble': {
				'start': 23.99,
				'end': 24.25,
				'loop': false
			},
			'clearUndoChips': {
				'start': 4.95,
				'end': 5.65,
				'loop': false
			},
			'placeChipError': {
				'start': 5.98,
				'end': 6.60,
				'loop': false
			},
			'removeLoseChips': {
				'start': 7,
				'end': 9,
				'loop': false
			},
			'menuClick': {
				'start': 3,
				'end': 3.3,
				'loop': false
			},
			'menuOpenClose': {
				'start': 4,
				'end': 4.4,
				'loop': false
			},
			'number_1': {
				'start': 28,
				'end': 29,
				'loop': false
			},
			'number_2': {
				'start': 30,
				'end': 31,
				'loop': false
			},
			'number_3': {
				'start': 32,
				'end': 33,
				'loop': false
			},
			'number_4': {
				'start': 34,
				'end': 35,
				'loop': false
			},
			'number_5': {
				'start': 36,
				'end': 37,
				'loop': false
			},
			'number_6': {
				'start': 38,
				'end': 39,
				'loop': false
			},
			'number_7': {
				'start': 40,
				'end': 41,
				'loop': false
			},
			'number_8': {
				'start': 42,
				'end': 43,
				'loop': false
			},
			'number_9': {
				'start': 44,
				'end': 45,
				'loop': false
			},
			'number_10': {
				'start': 46,
				'end': 47,
				'loop': false
			},
			'number_11': {
				'start': 48,
				'end': 49,
				'loop': false
			},
			'number_12': {
				'start': 50,
				'end': 51,
				'loop': false
			},
			'number_13': {
				'start': 52,
				'end': 53,
				'loop': false
			},
			'number_14': {
				'start': 54,
				'end': 55,
				'loop': false
			},
			'number_15': {
				'start': 56,
				'end': 57,
				'loop': false
			},
			'number_16': {
				'start': 58,
				'end': 59,
				'loop': false
			},
			'number_17': {
				'start': 60,
				'end': 61,
				'loop': false
			},
			'number_18': {
				'start': 62,
				'end': 63,
				'loop': false
			},
			'number_19': {
				'start': 64,
				'end': 65,
				'loop': false
			},
			'number_20': {
				'start': 66,
				'end': 67,
				'loop': false
			},
			'number_21': {
				'start': 68,
				'end': 69,
				'loop': false
			},
			'number_22': {
				'start': 70,
				'end': 71,
				'loop': false
			},
			'number_23': {
				'start': 72,
				'end': 73,
				'loop': false
			},
			'number_24': {
				'start': 74,
				'end': 75,
				'loop': false
			},
			'number_25': {
				'start': 76,
				'end': 77,
				'loop': false
			},
			'number_26': {
				'start': 78,
				'end': 79.10,
				'loop': false
			},
			'number_27': {
				'start': 80,
				'end': 81,
				'loop': false
			},
			'number_28': {
				'start': 82,
				'end': 83,
				'loop': false
			},
			'number_29': {
				'start': 84,
				'end': 85,
				'loop': false
			},
			'number_30': {
				'start': 86,
				'end': 87,
				'loop': false
			},
			'number_31': {
				'start': 88,
				'end': 89,
				'loop': false
			},
			'number_32': {
				'start': 90,
				'end': 91,
				'loop': false
			},
			'number_33': {
				'start': 92,
				'end': 93,
				'loop': false
			},
			'number_34': {
				'start': 94,
				'end': 95,
				'loop': false
			},
			'number_35': {
				'start': 96,
				'end': 97,
				'loop': false
			},
			'number_36': {
				'start': 98,
				'end': 99,
				'loop': false
			},
			'number_black': {
				'start': 99.9,
				'end': 101,
				'loop': false
			},
			'number_red': {
				'start': 101.9,
				'end': 102.8,
				'loop': false
			},
			'number_0': {
				'start': 104,
				'end': 105,
				'loop': false
			},
			'number_double0': {
				'start': 106,
				'end': 107,
				'loop': false
			},
			'emptyLoop': {
				'start': 123,
				'end': 124,
				'loop': true
			},
			'ballHopLast': {
				'start': 122.6,//11.492,
				'end': 122.9,//11.795,
				'loop': false
			},
			'ballHop13': {
				'start': 122.4,//11.380,
				'end': 122.51,//11.491,
				'loop': false
			},
			'ballHop12': {
				'start': 122.20,//11.380,
				'end': 122.31,//11.491,
				'loop': false
			},
			'ballHop11': {
				'start': 122.0,//11.380,
				'end': 122.14,//11.491,
				'loop': false
			},
			'ballHop10': {
				'start': 121.8,//11.380,
				'end': 121.92,//11.491,
				'loop': false
			},
			'ballHop9': {
				'start': 120.20,    //'start': 121.600,
				'end': 120.32, //'end': 121.660,
				'loop': false
			},
			'ballHop8': {
				'start': 121.40,// 11.155,
				'end':  121.52,//11.275,
				'loop': false
			},
			'ballHop7': {
				'start': 121.2,// 11.045,
				'end': 121.33,// 11.155,
				'loop': false
			},
			'ballHop6': {
				'start': 121, //10.990,
				'end': 121.14, //11.045,
				'loop': false
			},
			'ballHop5': {
				'start': 120.8,
				'end': 120.95,
				'loop': false
			},
			'ballHop4': {
				'start': 120.6,
				'end': 120.72,
				'loop': false
			},
			'ballHop3': {
				'start': 120.4,
				'end': 120.51,
				'loop': false
			},
			'ballHop2': {
				'start': 120.2,
				'end': 120.32,
				'loop': false
			},
			'ballHop1': {
				'start': 120,
				'end': 120.13,
				'loop': false
			}
		}
	}
});