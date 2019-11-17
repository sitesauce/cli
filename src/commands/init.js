const inquirer = require('inquirer');
const client = require('./../client');
const config = require('./../config/local');

async function handler(argv) {
	await ensureOverwrite(argv);

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

async function ensureOverwrite(argv) {
	if (config.get('init') && !argv.force) {
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

module.exports = {
	command: 'init',
	describe: 'Configure Sitesauce on the current directory.',
	builder: {
		force: {
			alias: 'f',
			default: false,
			type: 'boolean',
			description: 'Overwrite existing config if it exists'
		}
	},
	handler
};
