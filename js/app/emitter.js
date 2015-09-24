define(['eventemitter', 'config'], function(eventEmitter, config){
	return new eventEmitter(config.eventEmitter);
});