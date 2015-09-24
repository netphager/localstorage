define(['zepto', 'state_machine', 'server', 'page', 'player', 'helpers', 'bettable_animations', 'bettable_elements', 'cookies'], function($, state_machine, server, page, player, helpers, bettableAnimations, bettableElements, cookies) {
    return {

        init: function() {
            window.stateMachine = state_machine.create({
                initial: 'init',
                events: [{
                    from: 'init',
                    to: 'bettable',
                    name: 'load'
                }, {
                    from: 'spin',
                    to: 'bettable',
                    name: 'bettable'
                }, {
                    from: 'bettable',
                    to: 'spin',
                    name: 'getResponse'
                }, {
                    from: 'bettable',
                    to: 'paytable',
                    name: 'paytable'
                }, {
                    from: 'paytable',
                    to: 'bettable',
                    name: 'close'
                }],
                callbacks: {
                    oninit: function(event, from, to) {},
                    onenterstate: function(eventName, from, to, param1, param2) {
                        var that = this;
                        $('#pane').html(to);
                        $('#buttons a').each(function() {
                            $(this).css('color', null);
                        });


                        switch (to) {
                            case 'init':
                                placeBetLocked = true;
                                topbar.gameAdapter.emit('emitEvent',{event:'changeBonusBtn',state:'disabled'});
                                break;
                            case 'ready':
                                placeBetLocked = true;
                                topbar.gameAdapter.emit('emitEvent',{event:'changeBonusBtn',state:'disabled'});
                                break;
                            case 'bettable':
                                animationsGLobal.buttonsLocked = false;
                                if (helpers.getTableColor() != 'green') {
                                    switch (helpers.getTableColor()) {
                                        case 'blue':
                                            $('.replaced_betttable_blue').show();
                                            break;
                                        case 'red':
                                            $('.replaced_betttable_red').show();
                                            break;
                                        case 'purple':
                                            $('.replaced_betttable_purple').show();
                                            break;
                                    }
                                }
                                effect = 'fade';
                                if (from != 'init') {
                                    effect = 'slider';
                                }

                                if (typeof(param1) != 'undefined' && param1 == 'rebet') {
                                    helpers.showRebet2 = true;
                                } else {
                                    helpers.showRebet2 = false;
                                }

                                topbar.gameAdapter.emit('emitEvent',{event:'changeBonusBtn',state:'enabled'});
                                page.showPage('bettable', function() {
                                    if ($('#scrollerWrapper').css('visibility') != 'visible') {
                                        bettableElements_GLOBAL.setupBettingChipsIScroll();
                                        $('#scrollerWrapper').css('visibility', 'visible');
                                    }

                                    $('.showAfterStart').show();
                                    $('#settigs_btn').attr('active', 'active').css('opacity', '1');

                                    placeBetLocked = false;

                                    if ($('.bet_image').length == 0 && !$.isEmptyObject(bets)) {
                                        bettableElements.updateChips();
                                    }
                                }, effect);
                                break;
                            case 'paytable':
                                page.showPage('paytable', function() {}, 'slider');
                                break;
                            case 'spin':
                                placeBetLocked = true;
                                animationsGLobal.prepareSpin();
                                topbar.gameAdapter.emit('emitEvent',{event:'changeBonusBtn',state:'disabled'});
                                break;
                            case 'results':
                                placeBetLocked = true;
                                topbar.gameAdapter.emit('emitEvent',{event:'changeBonusBtn',state:'disabled'});
                                $('#buttonClose, #buttonRespin').show();
                                $('#buttonBettable, #buttonStart, #buttonBack').hide();
                                break;
                        }
                    }
                }
            });
        }
    };
});