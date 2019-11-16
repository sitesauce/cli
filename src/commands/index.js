const ping = require('./ping');
const init = require('./init');
const auth = require('./auth');
const client = require('./../client');

module.exports = {
	...auth,
	...(client.isAuthenticated() && {
		ping,
		init
	})
};
