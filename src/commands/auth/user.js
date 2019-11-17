const ora = require('ora');
const client = require('./../../client');

async function handler() {
	if (!client.isAuthenticated()) {
		return console.error('You aren\'t logged in. Please run sitesauce login to login.');
	}

	const spinner = ora('Fetching user').start();
	const user = await client.getUser();
	spinner.succeed();

	console.log(`Hi there! You're logged in as ${user.name}`);
}

module.exports = {
	command: 'user',
	describe: 'Show the authenticated user',
	handler
};
