const client = require('./../../client');

async function handle() {
	if (!client.isAuthenticated()) {
		return console.error('You aren\'t logged in. Please run sitesauce login to login.');
	}

	const team = await client.getTeam();

	console.log(`Hi there! You're currently working on ${team.is_personal ? 'your personal team' : team.name}. You can switch using sitesauce switch`);
}

module.exports = handle;
