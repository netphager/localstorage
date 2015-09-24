define(['zepto'], function($){
    return {
        fingerCounter: 0,
        // extract each finger data from list, call callback
        forEachChangedFinger: function(e, cb) {
            var that = this;
            // e = e.originalEvent;
            // e.changedTouches is a list of finger events that were changed
            for (var i = 0; i < e.changedTouches.length; i++) {
                var finger = e.changedTouches[i];
                var id = finger.identifier;
                cb(finger, id);
                
            }
        },
        addFinger: function() {
            this.fingerCounter++;
        },
        removeFinger: function() { 
            if(this.fingerCounter > 0) {
                this.fingerCounter--;
            }
        }
    };
});

