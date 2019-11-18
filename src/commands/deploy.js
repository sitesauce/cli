const ora = require('ora')
const inquirer = require('inquirer')
const client = require('./../client')
const localtunnel = require('localtunnel')
const config = require('./../config/local')
const isPortReachable = require('is-port-reachable')

async function handler(argv) {
	if (! config.get('init')) {
		config.deleteFile()
		console.log('This project has not been configured. Run sitesauce init to configure it.')
		process.exit()
	}

	let port = await validatePort(await getPort(argv))

	const baseUrl = getBaseUrl(port, argv.host)

	let spinner = ora('Starting reverse tunnel...').start();
	const tunnel = await localtunnel({
		port,
		host: 'https://tunnel.sitesauce.app',
		local_host: argv.host ? argv.host : 'localhost',
		allow_invalid_cert: true,
	}).catch(() => {
		spinner.fail()
		console.error('There was an error when opening the reverse tunnel, please try again later.')
		process.exit()
	});
	spinner.succeed('Reverse tunnel started')

	spinner = ora('Starting deployment...').start();
	let deployment = await startDeployment(tunnel.url, baseUrl)
	spinner.succeed('Deployment started')

	deployment = await waitForDeployment(deployment.id, () => {
		tunnel.close()
	})

	console.log(`Successfully deployed ${baseUrl} to ${deployment.provider}.`)

	process.exit()
}

async function getPort(argv) {
	if (argv.port) return argv.port

	return inquirer.prompt([{
		type: 'number',
		name: 'port',
		message: 'What port is this project running its server on?',
		default: 8080,
	}]).then(answers => answers.port)
}

async function validatePort(port) {
	if (await isPortReachable(port)) return port

	console.log('The port you specified is not reachable.')
	process.exit(1)
}

function getBaseUrl(port, host) {
	if (host) return `http://${host}`

	return `http://localhost:${port}`
}

function startDeployment(tunnelUrl, baseUrl) {
	return client.createDeployment(config.get('siteId'), {
		tunnelUrl,
		baseUrl,
	})
}

function waitForDeployment(deploymentId, stopTunnel) {
	const deploymentPipeline = [
		{
			stage: 'site_exists',
			spinner: ora('Ensure Site Exists').start()
		},
		{
			spinner: ora('Initialize Deployment'),
			stage: 'init'
		},
		{
			spinner: ora('Generate Artifact'),
			stage: 'generate_artifact'
		},
		{
			spinner: ora('Upload Artifact'),
			stage: 'upload_artifact'
		},
		{
			spinner: ora('Build pages'),
			stage: 'provider_build',
		},
		{
			spinner: ora('Finalize Deployment'),
			stage: 'finalize'
		},
	]

	const stages = deploymentPipeline.map(stage => stage.stage)

	let oldStage;

	return new Promise((resolve, reject) => {
		const request = () => {
			client.getDeploymentInfo(config.get('siteId'), deploymentId).then(deployment => {
				if (deployment.stage && deployment.stage !== oldStage) stageChanged(oldStage, deployment.stage)

				if (deployment.stage && deployment.stage === 'done') resolve(deployment)

				if (deployment.stage && deployment.stage.startsWith('failed_')) reject(deployment)

				setTimeout(() => {
					request()
				}, 3000)

				oldStage = deployment.stage ? deployment.stage : null
			})
		}

		const stageChanged = (oldStage, newStage) => {
			if (newStage.startsWith('failed_')) return;

			deploymentPipeline.filter(stage => {
				return parseInt(Object.keys(deploymentPipeline).find(key => deploymentPipeline[key].stage === newStage)) > parseInt(Object.keys(deploymentPipeline).find(key => deploymentPipeline[key].stage === stage.stage))
			}).forEach(stage => {
				if (stage.spinner.isSpinning) {
					stage.spinner.succeed()
				}

				if (stage.stage === 'generate_artifact') stopTunnel()
			})

			if(newStage === 'done') return;

			deploymentPipeline.find(stage => stage.stage == newStage).spinner.start()
		}

		request()
	}).catch(deployment => {
		if (deployment.stage && deployment.stage.startsWith('failed_')) {
			deploymentPipeline.find(stage => stage.stage == deployment.stage.split('failed_').filter(str => str !== '')[0]).spinner.fail()
		}

		console.error('Failed to deploy to Sitesauce')
		process.exit()
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
			description: 'The host to bind your server to.'
		},
	},
	handler
};
