const ora = require('ora');
const client = require('./../../client');

async function handler() {
	if (!client.isAuthenticated()) {
		return console.error('You aren\'t logged in. Please run sitesauce login to login.');
	}

	const spinner = ora('Fetching team').start();
	const team = await client.getTeam();
	spinner.succeed();

	console.log(`Hi there! You're currently working on ${team.is_personal ? 'your personal team' : team.name}. You can switch using sitesauce switch`);
}

module.exports = {
	command: 'team',
	describe: 'Show the authenticated team',
	handler
};
