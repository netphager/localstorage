define(['zepto','config','viewport','animations'],function ($,config,viewport,animations) {
    var pages = config.pages;
    return page = {
        _currentPage: null,
        _pagesCache: {},
        _sliderLastPos: 0,
        showPage: function( name, callback,effect ){
            if( !pages[name] ){
                throw 'There is no page "' + name + '" in configs';
            }

            if(this._currentPage && this._currentPage.attr('id') == name){
                if ( callback ) callback();
                return;
            }

            helpers.hideButtons();
            var width = config.gameSize.width;

            var that = this,
            $slider = $('.sliderHolder'),
            $left = $('.sliderDisplay.left'),
            $center = $('.sliderDisplay.center'),
            $right = $('.sliderDisplay.right'),
            $optionsWrapper = $('.optionsWrapper');
            sliderStartDirection = 'left',
            sliderPositions = {
                left: 0,
                center: '-'+width+'px',
                right: '-'+(2*width)+'px',
                minusOne: width + 'px'
            };
            if($('#'+name).closest('.optionsWrapper').length != 0) {
                $('#'+name).show();
            }
            viewport.pageTransitionCompleted = false;
            if(name == 'preloader') {
                viewport.pageTransitionCompleted = true;
            }
            if(that._currentPage != null) {
                if(that._currentPage.closest('.optionsWrapper').length != 0 && $('#'+name).closest('.optionsWrapper').length != 0) {
                    effect = 'fade';
                }
            }

            if(viewport.isiPod4) {
            	if(that._currentPage) {
					that._currentPage.hide();
				}

				if($('#'+name).closest('.optionsWrapper').length != 0) {
                    $optionsWrapper.prepend($('#'+name));
				}



				$slider.css('margin-left', (name == 'bettable' ? sliderPositions.left : ( name == 'maingame' ? sliderPositions.minusOne : sliderPositions.center ) ) );
				that._currentPage = (that._pagesCache[name] || (that._pagesCache[name] = $(pages[name]))).show();
                if(name == 'bettable') {
                    $('#maingame').hide();
                    $('.optionsWrapper').hide();
                    bettableElements_GLOBAL.setupBettingChipsIScroll();
                } else {
                    $('#maingame').show();
                    $('.optionsWrapper').show();
                }
                viewport.pageTransitionCompleted = true;
                helpers.showButtons();
                if(callback) {
                	callback();
                }
			} else if(effect == 'slider') {
                if(name == 'maingame') {
                    sliderStartDirection = 'left';
                } else if(name == 'bettable') {
                    sliderStartDirection = 'center';
                } else {
                    sliderStartDirection = 'right';
                    $optionsWrapper.prepend($('#'+name));
                }

                left = sliderPositions[sliderStartDirection];
                var has3d = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()); // Checks for 3d css support
                // Hardware accelerated
                has3d ? (
                    slideAnim = function(pos,speed,callback){
						$('#settigs_btn').attr("active", "inactive").css('opacity', '0.5');
                        $slider.animate( {translate3d: pos + ', 0, 0'}, speed, 'linear', function(){
							setTimeout(function(){
                            	$('#settigs_btn').attr("active", "active").css('opacity', '1');
							}, 500);
                            callback();
                        });
                    }
                ) : (
                    // Non-Hardware accelerated
                    slideAnim = function(pos, speed, callback){
						$('#settigs_btn').attr("active", "inactive").css('opacity', '0.5');
                        $slider.animate( {translateX: pos}, speed, 'linear', function() {
							setTimeout(function(){
                            	$('#settigs_btn').attr("active", "active").css('opacity', '1');
							}, 500);
                            callback();
                        });
                    }
                );
                slideAnim(left,500, function() {
                    that._currentPage = (that._pagesCache[name] || (that._pagesCache[name] = $(pages[name])));
                    helpers.showButtons();
                    viewport.pageTransitionCompleted = true;
                    if ( callback ) callback();
                    return;
                });

         } else {
            if(that._currentPage != null) {
                $('.optionsWrapper').find('section').each(function() {
                    if($(this).attr('id') != that._currentPage.attr('id')) {
                        $(this).hide();
                    }
                });
            }
            // Hide current page if there is any
            if( this._currentPage ){
                if (viewport.deviceOrientation() === 'portrait' ) {
                    // no animations
                    setTimeout(function(){$("#page_change_overlay").css({ "z-index": -1, "opacity": 0 });}, 100);
                    that._currentPage.hide();
                    that._currentPage = (that._pagesCache[name] || (that._pagesCache[name] = $(pages[name]))).show();
                    viewport.pageTransitionCompleted = true;
                    helpers.showButtons();
                    if ( callback ) return callback();
                    return;
                }

                $("#page_change_overlay").css( "z-index", 290 ).animate({
                    "opacity": 1
                }, 250, "linear", function () {
                    that._currentPage.hide();
                    that._currentPage = (that._pagesCache[name] || (that._pagesCache[name] = $(pages[name]))).show();


                    setTimeout(function () {
                        $("#page_change_overlay").animate({
                            "opacity": 0
                        }, 250, "linear", function () {
                            $(this).css("z-index", "-1");
                             viewport.pageTransitionCompleted = true;
                             helpers.showButtons();
                            if ( callback ) callback();

                        });
                    },100);
                });
            } else {
                setTimeout(function () {
                    $("#page_change_overlay").css({
                        "z-index": 290,
                        "opacity": 1
                    });

                    that._currentPage = (that._pagesCache[name] || (that._pagesCache[name] = $(pages[name]))).show();
                    setTimeout(function () {
                        var afterAnimationCallbackStarted = false;
                        $("#page_change_overlay").animate({
                            "opacity": 0
                        }, 250, "linear", function () {
                            afterAnimationCallbackStarted = true;
                            helpers.showButtons();
                            if ( callback ) callback();
                            $(this).css("z-index", "-1");
                        });
                        setTimeout(function() {
                            if(viewport.isAndroid) {
                                viewport.pageTransitionCompleted = true;
                            } else {
                                if (!afterAnimationCallbackStarted) {
                                    $("#page_change_overlay").css("z-index", "-1");
                                    viewport.pageTransitionCompleted = true;
                                }
                            }

                        }, 350);
                    },100);
                }, 250);
            }
        }
    },
    getCurrentPage: function() {
        return this._currentPage;
    },
    getLastPage: function() {
        var currentPage = this._currentPage;
    }

    };
});