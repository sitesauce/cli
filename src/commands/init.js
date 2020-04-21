const inquirer = require('inquirer');
const ora = require('ora')
const client = require('./../client');
const { local: config, global: globalConfig } = require('./../config');

async function handler(argv) {
	await ensureOverwrite(argv);

	const sites = await client.getSites();

	let { siteId } = await inquirer.prompt([{
		type: 'list',
		name: 'siteId',
		message: 'What site should we associate this project with?',
		choices: [
			...sites.map(site => ({name: `${site.name} (${site.cli ? 'CLI-only' : site.url})`, value: site.id})),
			new inquirer.Separator(),
			{
				name: 'Create New Site',
				value: 'create'
			}
		]
	}]);

	if (siteId === 'create') siteId = await createSite()

	config.set({
		siteId,
		teamId: globalConfig.get('teamId')
	});

	ora('Associating your site').succeed('Site associated successfully')
}

async function createSite() {
	const { siteName } = await inquirer.prompt([
		{
			type: 'input',
			name: 'siteName',
			message: 'How should this site be called?',
			validate: (siteName) => siteName.trim().length > 0,
		},
	]);

	const spinner = ora(`Creating ${siteName}...`).start();
	const site = await client.createSite({ name: siteName, cli: true })
	spinner.succeed('Site created successfully')

	return site.id
}

async function ensureOverwrite(argv) {
	if (config.get('teamId') && !argv.force) {
		const {overwrite} = await inquirer.prompt([{
			type: 'confirm',
			name: 'overwrite',
			message: 'This project has already been configured, do you want to do it again?',
			default: false
		}]);

		if (!overwrite) return

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
