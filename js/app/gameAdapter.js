define(function (require) {

    var $                   = require('zepto'),
        emitter = require('emitter'),
        // config              = require('game/js/config'),
        // generalWin           = require('base/js/components/generalWins'),
        mgr                 = null;

    var GameAdapter = function( mgr_ ){
        mgr = mgr_;
        this.listeners = {};
        this.originals = {};
        this.events  = {};
        this.events.stakeChanged = 'stakeChanged';
        this.events.changeBonusBtn = 'changeBonusBtn';
        this.events.stateFinished = 'stateFinished';
        this.addListeners();
    };

    GameAdapter.prototype = Object.create(emitter);
    GameAdapter.prototype.addEventListener = emitter.on;

    GameAdapter.prototype.addListeners = function(){
        var that = this;
        var callback = function(data) {
            // console.log('emit event', data);
            that.emit(that.events[data.event],data);
        };

        this.addEventListener('emitEvent',callback);

        /*mgr.events.newState.add( function( state ){
        }.bind(this));*/
    };

    GameAdapter.prototype.deactivateStakeButton = function( callback ){
        /*mgr.stakeButton.setState( 'inactive', false );
        this.originals.stakeButton = mgr.stakeButton.setState;
        mgr.stakeButton.setState = function(){};
        */
        callback && callback();
    };

    GameAdapter.prototype.reActivateStakeButton = function(){
        /*if( this.originals.stakeButton ){
            mgr.stakeButton.setState = this.originals.stakeButton;
        }

        mgr.stakeButton.setState( 'active', true );*/
    };

    GameAdapter.prototype.stopAutoplay = function(){
        var callback = function( state ){
            // if( state == mgr.STATE_FINISHED ){
            //     if( mgr.mode === mgr.MODES.AUTOPLAY ){
            //         mgr.mode = mgr.MODES.NORMAL;
            //         mgr.autoplayButton.resetCounters();
            //     }
            //     mgr.events.newState.remove( callback );
            // }
        }
        // mgr.events.newState.add( callback );
    };

    GameAdapter.prototype.getStake = function(){
        // return config.stake;
    };

    GameAdapter.prototype.setStake = function( stake, numberOfLines ){
        /*config.stake = stake;
        config.stakeCalculated = config.stake * numberOfLines;

        config.stakeVariant = config.stakeVariants.indexOf( stake );
        mgr.stakeWrapper.updateHtml();*/
    };

    GameAdapter.prototype.stateFinishedHandler = function( fun ){
        var that = this;
        var callback = function() {
            if(typeof(fun) == 'function') {
                fun();
                that.removeListener(that.events.stateFinished,callback);
            }
        };

        that.addEventListener(that.events.stateFinished,callback);
    };

    return GameAdapter;
});
