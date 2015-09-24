define({
    extend: function( destination, props ){
        if( props === undefined ){
            props = destination;

            // Set current context to be default destination
            // NOTE: this can be executed from different contexts, so use this
            destination = this;
        }

        for( var prop in props ){
            if( props.hasOwnProperty( prop ) ){
                destination[ prop ] = props[ prop ];
            }
        }

        return destination;
    }
});