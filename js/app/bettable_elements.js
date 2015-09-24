define(['zepto', 'server', 'helpers', 'player', 'emitter', 'requestAnimationFrame', 'cookies', 'config','viewport'], function($, server, helpers, player, eventEmitter, requestAnimationFrame, cookies, config,viewport) {
	return bettableElements_GLOBAL = {
		hoverAreas: {},
		isBig: false,
		navVisible: false,
		chipColors: ['gray', 'red', 'blue', 'green', 'black', 'purple', 'orange', 'cyan', 'pink', 'darkRed', 'yellow'],
		addingChipsAfterSpin: false,
		addingChips: function() {
			var config = server.getRgsConfig();
			var html = '';
			var numberOfChips = 0;
			var selectedChip = config.init.dfltStake;
			var counter = 0;
			var that = this;
			var countOfChipColors = that.chipColors.length;

			if (selectedChip == null) {
				selectedChip = config.init.stakeIncr[0];
			}
			for (var id in config.init.stakeIncr) {
				// var chipClass = config.init.stakeIncr[id].slice(0, -3);
				var chipLabel = config.init.stakeIncr[id];
				chipLabel = parseFloat(config.init.stakeIncr[id]);

				// if (chipLabel % 1 == 0) {
				// 	chipLabel = parseInt(config.init.stakeIncr[id]);

				// }
				numberOfChips++;
				if (parseFloat(chipLabel) == parseFloat(selectedChip)) {
					chipLabel = that.chipLabelGenerator(chipLabel);
					html += ' <li id="' + config.init.stakeIncr[id] + '" class="chips_list_item chips_selected" value="' +
							config.init.stakeIncr[id] + '" data-label="' + chipLabel + '"><span class="' + that.chipColors[counter] + '" data-value="' +
							that.chipColors[counter] + '">' + chipLabel + '</span>';
				} else {
					chipLabel = that.chipLabelGenerator(chipLabel);
					html += '<li id="' + config.init.stakeIncr[id] + '" class="chips_list_item " value="' +
							config.init.stakeIncr[id] + '" data-label="' + chipLabel + '"><span class="' + that.chipColors[counter] + '" data-value="' +
							that.chipColors[counter] + '">' + chipLabel + '</span> ';
				}
				html += '</a></li>';

				counter++;
				if (counter == countOfChipColors) {
					counter = 0;
				}
			}
			for (var i = 0; i < this.chipColors.length; i++) {
				this.chipColors[i];
			}

			$('.chips_list').html(html);
			//$('#scroller').css('width',(63 * numberOfChips) + 35 + 'px');
		},
		chipLabelGenerator: function(val) {
			if (val >= 1000) {
				val = parseInt(val / 100);
				var ext = '';
				if ((val % 10) != 0) {
					ext = '.' + val % 10;
				}
				val = parseInt(val / 10);
				return parseInt(val) + ext + 'k';
			}
			return val % 1 == 0 ? parseInt(val) : val;
		},
		updateChips: function() {
			return;
			//no longer needed as there is only one bettable size now
			this.addingZones();
			$('.bet_image').remove();
			for (var bet in bets) {
				events_GLOBAL.placeBet(bet, bets[bet], false, false);
			}
		},
		addingZones: function() {

			var squareWidth = 41;
			var squareHeight = 49;
			var areaHeight = 40;
			var borderWidth = 0;
			var zeroWidth = 32;
			var middleMargin = 10;
			var topOffset = 11.3;
			var leftOffset = -8.3;

			function addDiv(id, left, top, width, height, color, rounding) {
				hoverAreas[id] = {left: left, top: top, width: width, height: height, color: color, rounding: rounding};
				//drawDiv(id);
			}

			function drawDiv(id) {
				var elm = hoverAreas[id];
				//elm.color = 'none';
				var style = 'display: inline-block; cursor: pointer; background-color: ' + elm.color + '; position: absolute; left: ' + elm.left + 'px; top: ' + elm.top + 'px; width: ' + elm.width + 'px; height: ' + elm.height + 'px;';
				if (elm.rounding) {
					style += ' ' + elm.rounding;
				}
				var html = '<div class="bet" id="' + id + '" title="' + id + '" style="' + style + '"></div>';
				$('#bets').append(html);
			}

			//return;

			pickZones = new Object();

			for (var i = 0; i <= 36; i++) {
				var arr = ['PICK_' + i];
				if (i > 0) {
					if (i % 3 == 0) {
						arr.push('COLUMN_3_36');
					} else if ((i + 1) % 3 == 0) {
						arr.push('COLUMN_2_35');
					} else {
						arr.push('COLUMN_1_34');
					}

					if (i <= 12) {
						arr.push('DOZEN_1_12');
					} else if (i <= 24) {
						arr.push('DOZEN_13_24');
					} else {
						arr.push('DOZEN_25_36');
					}

					if (i <= 18) {
						arr.push('OUTSIDE_LOW');
					} else {
						arr.push('OUTSIDE_HIGH');
					}

					if (i % 2 == 0) {
						arr.push('OUTSIDE_EVEN');
					} else {
						arr.push('OUTSIDE_ODD');
					}

					var reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
					if (reds.indexOf(i) != -1) {
						arr.push('OUTSIDE_RED');
					} else {
						arr.push('OUTSIDE_BLACK');
					}

					if (i - 3 >= 1) {
						arr.push('SPLIT_' + (i - 3) + '_' + (i));
					}

					if (i + 3 <= 36) {
						arr.push('SPLIT_' + (i) + '_' + (i + 3));
					}

					if (i % 3 == 0) {
						arr.push('SPLIT_' + (i - 1) + '_' + (i));
					} else if ((i + 1) % 3 == 0) {
						arr.push('SPLIT_' + (i) + '_' + (i + 1));
						arr.push('SPLIT_' + (i - 1) + '_' + (i));
					} else {
						arr.push('SPLIT_' + (i) + '_' + (i + 1));
					}

					if (i % 3 != 0) {
						if (i + 4 <= 36) {
							arr.push('CORNER_' + (i) + '_' + (i + 1) + '_' + (i + 3) + '_' + (i + 4));
						}
						if (i - 3 >= 1) {
							arr.push('CORNER_' + (i - 3) + '_' + (i - 2) + '_' + (i) + '_' + (i + 1));
						}
					} else {
						if (i + 3 <= 36) {
							arr.push('CORNER_' + (i - 1) + '_' + (i) + '_' + (i + 2) + '_' + (i + 3));
						}

						if (i - 4 >= 1) {
							arr.push('CORNER_' + (i - 4) + '_' + (i - 3) + '_' + (i - 1) + '_' + (i));
						}
					}

					var dd = Math.floor((i - 1) / 3) * 3 + 1;
					arr.push('STREET_' + (dd) + '_' + (dd + 1) + '_' + (dd + 2));

					if (i <= 3) {
						arr.push('SIX_1_6');
					} else if (i <= 6) {
						arr.push('SIX_1_6');
						arr.push('SIX_4_9');
					} else if (i <= 9) {
						arr.push('SIX_4_9');
						arr.push('SIX_7_12');
					} else if (i <= 12) {
						arr.push('SIX_7_12');
						arr.push('SIX_10_15');
					} else if (i <= 15) {
						arr.push('SIX_10_15');
						arr.push('SIX_13_18');
					} else if (i <= 18) {
						arr.push('SIX_13_18');
						arr.push('SIX_16_21');
					} else if (i <= 21) {
						arr.push('SIX_16_21');
						arr.push('SIX_19_24');
					} else if (i <= 24) {
						arr.push('SIX_19_24');
						arr.push('SIX_22_27');
					} else if (i <= 27) {
						arr.push('SIX_22_27');
						arr.push('SIX_25_30');
					} else if (i <= 30) {
						arr.push('SIX_25_30');
						arr.push('SIX_28_33');
					} else if (i <= 33) {
						arr.push('SIX_28_33');
						arr.push('SIX_31_36');
					} else {
						arr.push('SIX_31_36');
					}
				} else {
					arr.push('STREET_0_1_2');
					arr.push('STREET_0_2_3');
				}
				pickZones[i] = arr;
			}

			var coordinates = new Object();
			areas = new Object();
			hoverAreas = this.hoverAreas = new Object();
			for (var col = 0; col < 3; col++) {
				for (var row = 0; row < 12; row++) {
					coordinates[col * 12 + row] = [
						leftOffset + zeroWidth + row * (squareWidth + borderWidth),
						topOffset + col * (squareHeight + borderWidth),
						leftOffset + zeroWidth + row * (squareWidth + borderWidth) + squareWidth,
						topOffset + col * (squareHeight + borderWidth) + squareHeight,
					];
				}
			}

			// PICK
			var id = 'PICK_0';
			var left = coordinates[0][0] - zeroWidth - borderWidth;
			var top = coordinates[0][1];
			var width = zeroWidth;
			var height = squareHeight * 3 + 2 * borderWidth;
			addDiv(id, left, top, width, height, 'red', 'border-radius: 7px 0 0 7px;');
			areas[id] = [{
					'coord': [left, top, width, height],
					'rounding': 'border-radius: 7px 0 0 7px;'
				}];

			for (var c in coordinates) {
				var y = Math.floor(c / 12);
				var x = c % 12;
				var tableNumber = 3 * x + (3 - y);

				var id = 'PICK_' + tableNumber;
				var left = coordinates[c][0];
				var top = coordinates[c][1];
				var width = squareWidth;
				var height = squareHeight;

				addDiv(id, left, top, width, height, 'red');

				areas[id] = [{
						'coord': [left, top, width, height]
					}];
			}
			//return;

			// COLUMN
			for (var c = 1; c <= 3; c++) {
				var id = 'COLUMN_' + c + '_' + (c + 33);
				var left = coordinates[0][0];
				var top = coordinates[((3 - c) * 12)][1];
				var width = squareWidth * 12 + 11 * borderWidth;
				var height = squareHeight;
				if (c == 1) {
					var rounding = 'border-radius: 0 0 7px 0;';
				} else if (c == 3) {
					var rounding = 'border-radius: 0 7px 0 0;';
				} else {
					var rounding = '';
				}

				addDiv(id, (coordinates[11][2] + borderWidth), top, squareWidth, height, 'green', rounding);
				areas[id] = [];
				areas[id].push({
					'coord': [left, top, (width + squareWidth + borderWidth), height],
					'rounding': rounding
				});
			}

			// DOZEN
			for (var c = 1; c <= 3; c++) {
				var id = 'DOZEN_' + (((c - 1) * 12) + 1) + '_' + (c * 12);
				var left = coordinates[(c - 1) * 4][0];
				var top = coordinates[(c - 1) * 4][1];
				var width = squareWidth * 4 + borderWidth * 3;
				var height = squareHeight * 3 + borderWidth * 2 + areaHeight;

				addDiv(id, left, coordinates[24][3], width, areaHeight, 'orange');
				areas[id] = [];
				areas[id].push({
					'coord': [left, top, width, (height)]
				});
			}

			// OUTSIDE_LOW
			var id = 'OUTSIDE_LOW';
			var left = coordinates[0][0];
			var top = coordinates[0][1];
			var width = squareWidth * 6 + 5 * borderWidth;
			var height = squareHeight * 3 + 2 * borderWidth;
			addDiv(id, left, coordinates[24][3] + borderWidth + areaHeight, (squareWidth * 2 + borderWidth), areaHeight, 'orange', 'border-radius: 0 0 0 7px;');
			areas[id] = [];
			areas[id].push({
				'coord': [left, top, width, height]
			});
			areas[id].push({
				'coord': [left, coordinates[24][3] + borderWidth + areaHeight, (squareWidth * 2 + borderWidth), areaHeight],
				'rounding': 'border-radius: 0 0 0 7px;'
			});
			// OUTSIDE_HIGH
			var id = 'OUTSIDE_HIGH';
			var left = coordinates[6][0];
			var top = coordinates[0][1];
			var width = squareWidth * 6 + 5 * borderWidth;
			var height = squareHeight * 3 + 2 * borderWidth;
			addDiv(id, left + 4 * squareWidth + 3 * borderWidth, coordinates[24][3] + borderWidth + areaHeight, (squareWidth * 2 + borderWidth), areaHeight, 'orange', 'border-radius: 0 0 7px 0;');
			areas[id] = [];
			areas[id].push({
				'coord': [left, top, width, height]
			});
			areas[id].push({
				'coord': [left + 4 * squareWidth + 3 * borderWidth, coordinates[24][3] + borderWidth + areaHeight, (squareWidth * 2 + borderWidth), areaHeight],
				'rounding': 'border-radius: 0 0 7px 0 ;'
			});

			// OUTSIDE_EVEN
			var id = 'OUTSIDE_EVEN';
			var left = coordinates[2][0];
			var top = coordinates[24][3] + squareHeight;
			var width = squareWidth * 2 + borderWidth;
			var height = squareHeight;

			areas[id] = [];
			for (var c = 0; c < 36; c++) {
				var y = Math.floor(c / 12);
				var x = c % 12;
				var tableNumber = 3 * x + (3 - y);
				if (tableNumber % 2 == 0) {
					areas[id].push({
						'coord': [coordinates[c][0], coordinates[c][1], squareWidth, squareHeight]
					});
				}
			}


			addDiv(id, left, coordinates[24][3] + borderWidth + areaHeight, width, areaHeight, 'orange');
			areas[id].push({
				'coord': [left, coordinates[24][3] + borderWidth + areaHeight, width, areaHeight]
			});

			// OUTSIDE_ODD
			var id = 'OUTSIDE_ODD';
			var left = coordinates[8][0];
			var top = coordinates[24][3] + squareHeight * 2 + borderWidth * 2;
			var width = squareWidth * 2 + borderWidth;
			var height = squareHeight;

			areas[id] = [];
			for (var c = 0; c < 36; c++) {
				var y = Math.floor(c / 12);
				var x = c % 12;
				var tableNumber = 3 * x + (3 - y);
				if (tableNumber % 2 == 1) {
					areas[id].push({
						'coord': [coordinates[c][0], coordinates[c][1], squareWidth, squareHeight]
					});
				}
			}
			addDiv(id, left, coordinates[24][3] + borderWidth + areaHeight, width, areaHeight, 'orange');
			areas[id].push({
				'coord': [left, coordinates[24][3] + borderWidth + areaHeight, width, areaHeight]
			});

			// OUTSIDE_RED
			var reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
			var id = 'OUTSIDE_RED';
			var left = coordinates[4][0];
			var top = coordinates[24][3] + borderWidth + areaHeight;
			var width = squareWidth * 2 + borderWidth;
			var height = areaHeight;

			areas[id] = [];
			for (var c = 0; c < 36; c++) {
				var y = Math.floor(c / 12);
				var x = c % 12;
				var tableNumber = 3 * x + (3 - y);
				if (reds.indexOf(tableNumber) !== -1) {
					areas[id].push({
						'coord': [coordinates[c][0], coordinates[c][1], squareWidth, squareHeight]
					});
				}
			}
			addDiv(id, left, top, width, height, 'orange');
			areas[id].push({
				'coord': [left, top, width, height]
			});

			// OUTSIDE_BLACK
			var id = 'OUTSIDE_BLACK';
			var blacks = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
			var left = coordinates[6][0];
			var top = coordinates[24][3] + borderWidth + areaHeight;
			var width = squareWidth * 2 + borderWidth;
			var height = areaHeight;
			addDiv(id, left, top, width, height, 'orange');
			areas[id] = [];
			for (var c = 0; c < 36; c++) {
				var y = Math.floor(c / 12);
				var x = c % 12;
				var tableNumber = 3 * x + (3 - y);
				if (blacks.indexOf(tableNumber) !== -1) {
					areas[id].push({
						'coord': [coordinates[c][0], coordinates[c][1], squareWidth, squareHeight]
					});
				}
			}
			areas[id].push({
				'coord': [left, top, width, height]
			});

			// SPLIT VERTICAL
			for (var c in coordinates) {
				c = parseInt(c);
				if (c > 23) {
					break;
				}

				var c2 = c + 12;

				var y = Math.floor(c / 12);
				var x = c % 12;
				var tableNumber = 3 * x + (3 - y);
				var y = Math.floor(c2 / 12);
				var x = c2 % 12;
				var tableNumber2 = 3 * x + (3 - y);

				var id = 'SPLIT_' + tableNumber2 + '_' + tableNumber;
				var left = coordinates[c][0];
				var top = coordinates[c][1];
				var width = squareWidth;
				var height = squareHeight * 2 + borderWidth;

				addDiv(id, coordinates[c][0], coordinates[c][3] - middleMargin, width, middleMargin * 2, 'magenta');
				areas[id] = [{
						'coord': [left, top, width, height]
					}];
			}

			// SPLIT HORIZONTAL
			for (var c in coordinates) {
				c = parseInt(c);
				if ((c + 1) % 12 == 0) {
					continue;
				}

				var y = Math.floor(c / 12);
				var x = c % 12;
				var tableNumber = 3 * x + (3 - y);
				var y = Math.floor((c + 1) / 12);
				var x = (c + 1) % 12;
				var tableNumber2 = 3 * x + (3 - y);

				var id = 'SPLIT_' + tableNumber + '_' + tableNumber2;
				var left = coordinates[c][0];
				var top = coordinates[c][1];
				var width = squareWidth * 2 + borderWidth;
				var height = squareHeight;

				addDiv(id, coordinates[c][2] - middleMargin, top, middleMargin * 2, height, 'magenta');
				areas[id] = [{
						'coord': [left, top, width, height]
					}];
			}

			var id = 'SPLIT_0_1';
			var left = coordinates[0][0] - middleMargin;
			var top = coordinates[12][3] + middleMargin;
			var width = middleMargin * 2 + borderWidth;
			var height = middleMargin * 2 + borderWidth;
			addDiv(id, left, top, width, height, 'yellow');
			areas[id] = [{
					'coord': [coordinates[0][0] - borderWidth - zeroWidth, coordinates[0][1], zeroWidth, squareHeight * 3 + 2 * borderWidth],
					'rounding': 'border-radius: 7px 0 0 7px;'
				}, {
					'coord': [left + middleMargin, coordinates[12][3] + borderWidth, squareWidth, squareHeight]
				}];

			var id = 'SPLIT_0_2';
			var left = coordinates[0][0] - middleMargin;
			var top = coordinates[12][1] + middleMargin;
			var width = middleMargin * 2 + borderWidth;
			var height = middleMargin * 2 + borderWidth;
			addDiv(id, left, top, width, height, 'yellow');
			areas[id] = [{
					'coord': [coordinates[0][0] - borderWidth - zeroWidth, coordinates[0][1], zeroWidth, squareHeight * 3 + 2 * borderWidth],
					'rounding': 'border-radius: 7px 0 0 7px;'
				}, {
					'coord': [left + middleMargin, coordinates[12][1], squareWidth, squareHeight]
				}];

			var id = 'SPLIT_0_3';
			var left = coordinates[0][0] - middleMargin;
			var top = coordinates[0][1] + middleMargin;
			var width = middleMargin * 2 + borderWidth;
			var height = middleMargin * 2 + borderWidth;
			addDiv(id, left, top, width, height, 'yellow');
			areas[id] = [{
					'coord': [coordinates[0][0] - borderWidth - zeroWidth, coordinates[0][1], zeroWidth, squareHeight * 3 + 2 * borderWidth],
					'rounding': 'border-radius: 7px 0 0 7px;'
				}, {
					'coord': [left + middleMargin, coordinates[0][1], squareWidth, squareHeight]
				}];

			// STREET
			for (var i = 0; i < 12; i++) {
				var c = i * 3 + 1
				var id = 'STREET_' + c + '_' + (c + 1) + '_' + (c + 2);

				var left = coordinates[i][0];
				var top = coordinates[i + 24][3] - middleMargin;
				var width = squareWidth;
				var height = 2 * middleMargin + borderWidth;
				addDiv(id, left, top, width, height, 'magenta');
				// areas[id] = [
				// 	{ 'coord': [ left, top, squareWidth, (3*squareHeight + 2*borderWidth)  ], 'rounding': 'border-radius: 7px 0 0 7px;' },
				// 	{ 'coord': [ coordinates[12][0], coordinates[12][1], squareWidth, squareHeight*2 + borderWidth ] }
				// ];
				// areas[id] = [ { 'coord': [ coordinates[c][0], coordinates[c][1], (squareWidth*2 + borderWidth), (squareHeight*3 + 2*borderWidth) ] } ];
				areas[id] = [{
						'coord': [left, coordinates[0][1], squareWidth, (3 * squareHeight + 2 * borderWidth)]
					}];
			}

			var id = 'STREET_0_1_2';
			var left = coordinates[12][0] - middleMargin;
			var top = coordinates[12][3] - middleMargin;
			var width = middleMargin * 2 + borderWidth;
			var height = middleMargin * 2 + borderWidth;
			addDiv(id, left, top, width, height, 'yellow');
			areas[id] = [{
					'coord': [coordinates[0][0] - borderWidth - zeroWidth, coordinates[0][1], zeroWidth, squareHeight * 3 + 2 * borderWidth],
					'rounding': 'border-radius: 7px 0 0 7px;'
				}, {
					'coord': [coordinates[12][0], coordinates[12][1], squareWidth, squareHeight * 2 + borderWidth]
				}];

			var id = 'STREET_0_2_3';
			var left = coordinates[0][0] - middleMargin;
			var top = coordinates[0][3] - middleMargin;
			var width = middleMargin * 2 + borderWidth;
			var height = middleMargin * 2 + borderWidth;
			addDiv(id, left, top, width, height, 'yellow');
			areas[id] = [{
					'coord': [coordinates[0][0] - borderWidth - zeroWidth, coordinates[0][1], zeroWidth, squareHeight * 3 + 2 * borderWidth],
					'rounding': 'border-radius: 7px 0 0 7px;'
				}, {
					'coord': [coordinates[0][0], coordinates[0][1], squareWidth, squareHeight * 2 + borderWidth]
				}];

			// CORNER
			for (var i = 0; i < 11; i++) {
				for (var j = 0; j < 2; j++) {
					c = j * 12 + i;

					//1
					var y = Math.floor((c + 12) / 12);
					var x = (c + 12) % 12;
					var tableNumber = 3 * x + (3 - y);
					//2
					var y = Math.floor(c / 12);
					var x = c % 12;
					var tableNumber2 = 3 * x + (3 - y);
					//3
					var y = Math.floor((c + 13) / 12);
					var x = (c + 13) % 12;
					var tableNumber3 = 3 * x + (3 - y);
					//4
					var y = Math.floor((c + 1) / 12);
					var x = (c + 1) % 12;
					var tableNumber4 = 3 * x + (3 - y);


					var id = 'CORNER_' + tableNumber + '_' + tableNumber2 + '_' + tableNumber3 + '_' + tableNumber4;

					var left = coordinates[c][2] - middleMargin;
					var top = coordinates[c][3] - middleMargin;
					var width = middleMargin * 2 + borderWidth;
					var height = middleMargin * 2 + borderWidth;

					addDiv(id, left, top, width, height, 'yellow');

					areas[id] = [{
							'coord': [coordinates[c][0], coordinates[c][1], (squareWidth * 2 + borderWidth), (squareHeight * 2 + borderWidth)]
						}];
				}
			}

			var id = 'CORNER_0_1_2_3';
			var left = coordinates[24][0] - middleMargin;
			var top = coordinates[24][3] - middleMargin;
			var width = middleMargin * 2 + borderWidth;
			var height = middleMargin * 2 + borderWidth;
			addDiv(id, left, top, width, height, 'yellow');
			areas[id] = [{
					'coord': [coordinates[0][0] - borderWidth - zeroWidth, coordinates[0][1], zeroWidth + borderWidth + squareWidth, squareHeight * 3 + 2 * borderWidth],
					'rounding': 'border-radius: 7px 0 0 7px;'
				},
			];

			// SIX
			for (var c = 0; c < 11; c++) {
				c = parseInt(c);

				var id = 'SIX_' + parseInt((c * 3) + 1) + '_' + ((c * 3) + 6);
				var left = coordinates[c][2] - middleMargin;
				var top = coordinates[c + 24][3] - middleMargin;
				var width = middleMargin * 2 + borderWidth;
				var height = middleMargin * 2 + borderWidth;

				addDiv(id, left, top, width, height, 'yellow');

				areas[id] = [{
						'coord': [coordinates[c][0], coordinates[c][1], (squareWidth * 2 + borderWidth), (squareHeight * 3 + 2 * borderWidth)]
					}];
			}
		},
		touchEvents: function() {
			var curHoveredObj;
			chipEvent = null;
			currentChip = null;
			isTouching = false;
			var that = this;

			function whatIsInside(e) {
				var touch = e.touches && e.touches.length ? e.touches[0] : (e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e);
  				var realPoint = convertPointFromPageToNode(document.getElementById('bets'), touch.pageX, touch.pageY);


				var foundObj = {};
				var found = null;
				var offset = $('#bets').offset();

				for (var i in hoverAreas) {
					var elm = hoverAreas[i];

					var left = parseInt(elm.left),
							right = left + parseInt(elm.width),
							top = parseInt(elm.top),
							bottom = top + parseInt(elm.height),
							touchX = realPoint.x
							touchY = realPoint.y;



					if (touchX > left && touchX < right && touchY > top && touchY < bottom) {

						var centerX = (right + left) / 2;
						var centerY = (top + bottom) / 2;
						var xs = 0;
						var ys = 0;

						xs = centerX - touchX;
						xs = xs * xs;

						ys = centerY - touchY;
						ys = ys * ys;

						foundObj[i] = Math.sqrt(xs + ys);
						found = true;
					}
				}

				if (found) {
					var min = 9000;
					var minKey = null;
					for (var i in foundObj) {
						if (foundObj[i] < min) {
							minKey = i;
							min = foundObj[i];
						}
					}

					if (curHoveredObj != minKey) {
						curHoveredObj = minKey;
						eventEmitter.emit('bettable.mouseover', minKey);
					}
					return minKey;
				}
				$('#bettableHover').hide();
				$('.bettableHoversAdditional').remove();
				return false;

			}
			helpers.bind($('#bettable .chips_list_item'),'touchend', function() {
				var currentChip = $(this);
				var selectedChipObj = currentChip !== null ? currentChip : $('.chips_selected');
				var selectedColor = selectedChipObj.find('span').attr('class');
				var selectedValue = selectedChipObj.attr('id');


				eventEmitter.emit('chip.click', selectedChipObj, selectedColor, selectedValue);
				$('.chips_selected').removeClass('chips_selected');
				console.log($(this));
				$(this).addClass('chips_selected');

			});

			helpers.bind($('#bettable'), 'touchstart', function(e) {
				var touch = e.touches && e.touches.length ? e.touches[0] : (e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e);
				isTouching = {x: touch.clientX, y: touch.clientY};
				var newChipSelected = null;

				//Има ли чип под пръста?
				var touchY = touch.pageY;
				var touchX = touch.pageX;
				if(topbar.viewport.iPhone6 && (window.innerHeight > 330 &&  window.innerHeight < 371)) {
					touchY -= 50;
				}
				var currentElement = document.elementFromPoint(touchX, touchY);
				if(topbar.viewport.isAndroid) {
					currentElement = document.elementFromPoint(touch.screenX, touch.screenY - 50);
				} else if (viewport.isS4 && viewport.isAndroidDefault) {
					currentElement = document.elementFromPoint(touch.screenX, touch.screenY);
				}
				if ($(currentElement).parent().hasClass('chips_list_item')) {
					currentChip = $(currentElement).parent();
					newChipSelected = true;
				}
				var selectedChipObj = currentChip !== null ? currentChip : $('.chips_selected');
				var selectedColor = selectedChipObj.find('span').attr('class');
				var selectedValue = selectedChipObj.attr('id');
				// eventEmitter.emit('chip.click', selectedChipObj, selectedColor, selectedValue);
				// if (newChipSelected) {
				// }

				//Добавяме скрит чип под пръста
				if(!viewport.isiPod4) {
					$('#movingChip').attr('class', selectedChipObj.find('span').attr('class') + '_small_chip');
					$('#movingChipLabel').html(selectedChipObj.find('span').html());
					var realPoint = convertPointFromPageToNode(document.getElementById('bets'), touch.pageX, touch.pageY);

					$('#movingChip').css({
						'left': (realPoint.x - 18.5) + 'px',
						'top': (realPoint.y - 18.5) + 'px'
					});
					if (!$(currentElement).parent().hasClass('chips_list_item')) {
						$('#movingChip').show();
					}
				}
				if ($('#settigs_btn').hasClass('active')) {
					$('#settigs_btn').removeClass('active');
				};
				$('#dropdown_menu_bubble').hide();
				whatIsInside(e);
				return false;
			});

			helpers.bind($('#bettable, .bettable_nav'), 'touchmove', function(e) {
				//Местим чипа под пръста
				if (isTouching) {
					var touch = e.touches && e.touches.length ? e.touches[0] : (e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e);
					if ((touch.pageY / viewport.scale) < config.gameSize.height - 70) {
						var realPoint = convertPointFromPageToNode(document.getElementById('bets'), touch.pageX, touch.pageY);
						if(!viewport.isiPod4) {
							$('#movingChip').css({
								'display': 'block',
								'left': (realPoint.x - 18.5) + 'px',
								'top': (realPoint.y - 18.5) + 'px'
							});
						}
						// window.currentIScrollInstance.disable();
					} else {
						$('#movingChip').hide();
					}
					whatIsInside(e);
				}
			});

			helpers.bind($(window), 'touchend', function(e) {
				if($(e.target).closest('#bettable').length == 0) {
					return false;
				}
				if(e.touches && e.touches.length > 0){
					$('#movingChip').hide();
					$('#bettableHover').hide();
					return false;
				}
				// window.currentIScrollInstance.enable();
				curHoveredObj = null;
				whatIsInside(e);
				//Не съм избрал чип
				var touch = e.touches && e.touches.length ? e.touches[0] : (e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e);
				$currentTarget = $(document.elementFromPoint(touch.pageX, touch.pageY));
				if (curHoveredObj == null) {
					if ($currentTarget.closest('.chips_list').length) {
						$('#movingChip').hide();
					} else {
						$('#movingChip').animate({
							top: $(document).height() + 'px'
						}, {
							duration: 150,
							complete: function() {
								$(this).hide();
							}
						});
						setTimeout(function(){
							$('#movingChip').hide();
						},160);
					};


				} else {
					$('#movingChip').hide();
					eventEmitter.emit('bettable.click', curHoveredObj, currentChip);
					eventEmitter.emit('bettable.mouseout', curHoveredObj);
				}
				isTouching = false;
				currentChip = null;
				return false;
			});
		},
		setupBettingChipsIScroll: function() {
			return;
			var $scrArrL = $('#scrollerArrowLeft');
			var $scrArrR = $('#scrollerArrowRight');
			var handleScroll = function() {
				var firstPage = this.x == 0,
					lastPage = this.x == this.pagesX[this.pagesX.length - 1];

				$scrArrL[(firstPage ? 'addClass' : 'removeClass')]('inactive');
				$scrArrR[(lastPage ? 'addClass' : 'removeClass')]('inactive');

				var firstPage = this.x < 0,
					lastPage = this.x > this.pagesX[this.pagesX.length - 1];
				$scrArrL[(firstPage ? 'removeClass' : 'addClass')]('inactive');
				$scrArrR[(lastPage ? 'removeClass' : 'addClass')]('inactive');


			}
			var myScroll = new iScroll('scrollerWrapper', {
				snap: true,
				momentum: true,
				hScrollbar: false,
				vScroll: false,
				bounce : false,
				onScrollMove: handleScroll,
				onScrollEnd: handleScroll
			});
			// window.currentIScrollInstance = myScroll;
			handleScroll.call(myScroll);
			$scrArrL.on(viewport.isMobile ? 'touchstart' : 'click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				myScroll.scrollToPage(0);
			})
			$scrArrR.on(viewport.isMobile ? 'touchstart' : 'click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				myScroll.scrollToPage(1);
			});
		},
		showButtonsAfterSpin: function(){
			// return;
			$('#settigs_btn').attr('active','active').css('opacity', 1);
			topbar.gameAdapter.emit('emitEvent',{event:'changeBonusBtn',state:'enabled'});
			// helpers.showButtons();
		},
		chipScrollerReloader: function(element) {
			return;
			var scrollerWidth = $('#scrollerWrapper').width();
			var scrollerElementWidth = $('.chips_list_item').width();
			var selectionCurrenPosition = $('.chips_selected').position().left;
			// var scroller = window.currentIScrollInstance;
			var containerWidth = $('#scroller').width();

			if (scroller.currPageX == 0 && scrollerWidth < (selectionCurrenPosition + scrollerElementWidth)) {
				scroller.scrollToPage(1);
			}

			if (scroller.currPageX == 1 && selectionCurrenPosition < (containerWidth - scrollerWidth)) {
				scroller.scrollToPage(0);
			}
		}

	}
});