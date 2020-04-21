const config = require('../../config/global');

function handler() {
	config.reset()

	console.log('You\'ve been logged out!');
}

module.exports = {
	command: 'logout',
	describe: 'Log the authenticated user out',
	handler
};
