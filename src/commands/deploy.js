const ora = require('ora')
const inquirer = require('inquirer')
const client = require('./../client')
const localtunnel = require('localtunnel')
const config = require('./../config/local')
const isPortReachable = require('is-port-reachable')

async function handler(argv) {
	if (! config.get('siteId')) return ora().fail('This project has not been configured. Run sitesauce init to configure it.')

	const port = await getPort(argv)

	if (! isPortReachable(port)) return ora().fail('The port you specified is not reachable.')

	const { baseUrl, host } = await getBaseUrl(port, argv.host)

	let spinner = ora('Starting reverse tunnel...').start();

	let tunnel;

	try {
		tunnel = await localtunnel({
			port,
			host: 'https://tunnel.sitesauce.app',
			local_host: host,
			allow_invalid_cert: true,
		})

		spinner.succeed('Reverse tunnel started')
	} catch {
		return spinner.fail('There was an error when opening the reverse tunnel, please try again later.')
	}

	spinner = ora('Starting deployment...').start();
	let deployment = await startDeployment(tunnel.url, baseUrl)
	spinner.text = 'Deploying your site...'

	await waitForDeployment(deployment.id, spinner, tunnel)
}

async function getPort(argv) {
	if (argv.port) return argv.port

	return inquirer.prompt([{
		type: 'number',
		name: 'port',
		message: 'What port is this project running its server on?',
		default: 3000,
	}]).then(answers => answers.port)
}

async function getBaseUrl(port, host) {
	if (host) return { baseUrl : `http://${host}`, host }

	if (port !== 80) return { baseUrl: `http://localhost:${port}`, host: 'localhost' }

	const { shouldDemandHost } = await inquirer.prompt([{
		name: 'shouldDemandHost',
		type: 'confirm',
		message: "Do you want to specify a virtual host? Do this if you're using something like Laravel Valet to serve your sites",
		default: false,
	}])

	if (!shouldDemandHost) return { baseUrl: `http://localhost:${port}`, host: 'localhost' }

	host = await inquirer.prompt([{
		type: 'input',
		name: 'host',
		message: 'What virtual host should we connect to? (domain.tld)',
		validate: host => host.trim().length > 0 && host.includes('.') && ! host.includes('/')
	}]).then(answers => answers.host)

	return getBaseUrl(port, host)
}

function startDeployment(tunnelUrl, baseUrl) {
	return client.createDeployment(config.get('siteId'), {
		tunnelUrl,
		baseUrl,
	})
}

function waitForDeployment(deploymentId, spinner, tunnel) {
	const deploymentPipeline = [
		{
			stage: 'site_exists',
			spinnerText:'Ensuring Site Exists...'
		},
		{
			stage: 'init',
			spinnerText: 'Initializing Deployment...',
		},
		{
			stage: 'zeit_deploy',
			spinnerText: 'Deploying to ZEIT',
		},
		{
			stage: 'zeit_build',
			spinnerText: 'Building static site...',
		},
		{
			stage: 'finalize',
			spinnerText: 'Finishing up deployment...',
		},
		{
			stage: 'done',
			spinnerText: 'Cleaning up the tunnel...',
		},
	]

	let oldStage;

	return new Promise((resolve, reject) => {
		const request = () => {
			client.getDeploymentInfo(config.get('siteId'), deploymentId).then(deployment => {
				if (deployment.stage) {
					if (deployment.stage !== oldStage) stageChangedTo(deployment.stage)

					if (deployment.stage === 'done') resolve(deployment)

					if (deployment.stage.startsWith('failed_')) reject(deployment)
				}

				setTimeout(() => {
					request()
				}, 3000)

				oldStage = deployment.stage ? deployment.stage : null
			})
		}

		const stageChangedTo = newStage => {
			if (newStage.startsWith('failed_')) return spinner.fail();

			spinner.text = deploymentPipeline.find(stage => stage.stage == newStage).spinnerText
		}

		request()
	}).then(() => {
		tunnel.close()

		spinner.succeed(`Successfully deployed to Sitesauce.`)
	}).catch(deployment => {
		if (deployment.stage && deployment.stage.startsWith('failed_')) {
			spinner.fail()
		}
	})
}

module.exports = {
	command: 'deploy',
	describe: 'Deploy the current project to Sitesauce',
	builder: {
		port: {
			alias: 'p',
			type: 'int',
			description: 'The port your project is running on.'
		},
		host: {
			alias: 'h',
			type: 'string',
			description: 'The virtual host to bind your server to.'
		},
	},
	handler
};
