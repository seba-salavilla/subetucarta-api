const log4js = require('log4js');

log4js.configure({
	appenders: {
	  	console: { type: 'console' },
	  	file: { type: 'dateFile', filename: 'api.log', compress: true},
		multilog: {type:'multiFile', base:'logs/', property:'level', extension:'.log', maxLogSize: 10485760, compress: true},
	},
	categories: {
		api: { appenders: ['file','console', 'multilog'], level: 'info' },
	  	default: { appenders: ['file', 'console'], level: 'info' }
	}
});

module.exports = log4js