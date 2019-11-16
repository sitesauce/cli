const config = require('../../config/global');

function handle() {
	config.delete('token');

	console.log('You\'ve been logged out!');
}

module.exports = handle;
