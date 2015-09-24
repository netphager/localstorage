/*
 @Auothor: Cayetano Gaming
 @File: multiTouchDot.js
 @Revision:
*/
define(['zepto', 'viewport'], function ($, viewport) {
	var touchStartedTimes = 0,
		touchEndedTimes = 0,
		showDotTimeout = null,
		mtNotify = {
			dot: $('#multitouch_dot'),
			overlay: $('#multitouch_overlay'),
			dotGlow: $('#multitouch_dot .dot_glow')
		}, dotOffset = {
			left: 217 / 2,
			top: 217 / 2
		}, dotPosition = {
			left: 0,
			top: 0
		}, dotVisible = false,
		dotTimeout = null,
		dotShowDelay = 2000,
		repositionDot = function () {
			if (!dotVisible) return;
			var left = dotPosition.left,
				top = dotPosition.top;
			if (left > window.innerWidth - dotOffset.left) left = window.innerWidth - dotOffset.left;
			if (left < dotOffset.left) left = dotOffset.left;
			if (top < dotOffset.top) top = dotOffset.top;
			if (top > window.innerHeight - dotOffset.left) top = window.innerHeight - dotOffset.top;
			mtNotify.dot.css({
				transform: "translate(" + (left - dotOffset.left) + "px," + (top - dotOffset.top) + "px) scale(0.8)",
				"-webkit-transform": "translate(" + (left - dotOffset.left) + "px," + (top - dotOffset.top) + "px) scale(0.8)",
				"-ms-transform": "translate(" + (left - dotOffset.left) + "px," + (top - dotOffset.top) + "px) scale(0.8)",
				"-moz-transform": "translate(" + (left - dotOffset.left) + "px," + (top - dotOffset.top) + "px) scale(0.8)",
				"-o-transform": "translate(" + (left - dotOffset.left) + "px," + (top - dotOffset.top) + "px) scale(0.8)"
			})
		}, showDot = function () {
			mtNotify.dot.show();
			setTimeout(function () {
				mtNotify.dot.css('opacity', 1)
			}, 100);
			mtNotify.dotGlow.addClass('pulse');
			mtNotify.overlay.show();

			dotVisible = true
		}, hideDot = function () {

			if (dotVisible) {
				mtNotify.dot.hide().css('opacity', 0);
				mtNotify.dotGlow.removeClass('pulse');
				mtNotify.overlay.hide();
				dotVisible = false
			};
			if (dotTimeout !== null) {
				clearTimeout(dotTimeout);
				dotTimeout = null
			};
			touchStartedTimes = touchEndedTimes = 0
		};
	return {
		preventTouches: true,

		init: function () {
			var that = this;
			that.preventTouches = false;
			mtNotify.dot = $('#multitouch_dot');
			mtNotify.overlay = $('#multitouch_overlay');
			mtNotify.dotGlow = $('#multitouch_dot .dot_glow');
			window.addEventListener("orientationchange", function () {
				if (window.orientation == 0 || window.orientation == 180) hideDot();
			}, false);



			if ('ontouchstart' in window) document.body.addEventListener('touchstart', function (e) {

				if (window.orientation == 0 || window.orientation == 180 || $('#iScroller').length != 0) return;
				if (!viewport.iScrollEnabled) e.preventDefault();
				// that.preventEndHandler = false;
				touchStartedTimes++;
				if (touchStartedTimes < 2) {
					dotPosition.left = e.touches[0].pageX;
					dotPosition.top = e.touches[0].pageY;
					dotTimeout = setTimeout(function () {
						showDot();
						that.preventTouches = true;
						repositionDot()
					}, dotShowDelay)
				} else {
					that.preventTouches = true;
					e.stopPropagation()
				}
			}, true);
			if ('ontouchmove' in window) document.body.addEventListener('touchmove', function (e) {
				dotPosition.left = e.touches[0].pageX;
				dotPosition.top = e.touches[0].pageY;
				if (dotVisible) repositionDot()
			}, true);
			var endHandler = function (e) {



				touchEndedTimes++;
				if ($('.active').length != 0) $('.active').removeClass('active');
				if ((e.touches.length <= 0 || touchEndedTimes <= 0)) {
					hideDot();
					setTimeout(function () {
						that.preventTouches = false
					}, 300)
				} else e.stopPropagation()

				$('.bettableHoversAdditional').remove();
				$('#bettableHover').hide();
				$('#movingChip').hide();
			};
			if ('ontouchend' in window) {
				document.body.addEventListener('touchend', endHandler, true);
				document.body.addEventListener('touchleave', endHandler, true);
				document.body.addEventListener('touchcancel', endHandler, true)
			};
			$(window).on('focus', hideDot)
		},
		hide: hideDot,
		show: showDot,
		reposition: repositionDot
	}
})