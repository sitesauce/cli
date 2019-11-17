const ora = require('ora')
const inquirer = require('inquirer')
const client = require('./../../client');

async function handler() {
	let spinner = ora('Fetching teams').start();
	const [teams, currentTeam] = await Promise.all([client.getTeams(), client.getTeam()])
	spinner.succeed();

	const { teamId } = await inquirer.prompt([{
		type: 'list',
		name: 'teamId',
		message: 'Select a team to switch to',
		choices: Object.values(teams).map(team => ({ value: team.id, name: team.is_personal ? 'Personal Team' : team.name })),
		default: currentTeam.id
	}])

	const team = Object.values(teams).filter(team => team.id === teamId)[0]

	spinner = ora('Switching to team').start();
	await client.switchTeam(teamId)
	spinner.succeed(`Successfully switched to ${team.is_personal ? 'your personal team' : team.name}.`);
}

module.exports = {
	command: 'switch',
	describe: 'Switch the team',
	builder: {
		team: {
			alias: 't',
		}
	},
	handler
};
