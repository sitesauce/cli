const inquirer = require('inquirer');
const client = require('./../client');
const config = require('./../config/local');

async function handle() {
	await ensureOverwrite();

	const sites = await client.getSites();

	const {siteId} = await inquirer.prompt([{
		type: 'list',
		name: 'siteId',
		message: 'What site should we associate this project with?',
		choices: [
			...sites.map(site => ({name: `${site.name} (${site.url})`, value: site.id})),
			new inquirer.Separator(),
			{
				name: 'Create New Site',
				disabled: 'soon'
			}
		]
	}]);

	config.set({
		init: true,
		siteId
	});
}

async function ensureOverwrite() {
	if (config.get('init')) {
		const {overwrite} = await inquirer.prompt([{
			type: 'confirm',
			name: 'overwrite',
			message: 'This project has already been configured, do you want to do it again?',
			default: false
		}]);

		if (!overwrite) {
			process.exit();
		}

		config.reset();
	}
}

module.exports = handle;
