const querystring = require('querystring');
const ora = require('ora');
const open = require('open');
const uuid = require('uuid/v1');
const hapi = require('@hapi/hapi');
const config = require('../../config/global');

async function handler() {
	const spinner = ora('Logging you in...').start();
	const token = await executeAuthFlow();

	config.set({token});

	spinner.succeed('Successfully logged in to your Sitesauce account!');
}

const buildAuthorizeUrl = () => {
	const params = querystring.stringify({
		client_id: 3,
		response_type: 'token',
		scope: '',
		redirect_uri: 'http://localhost:49156/callback',
		state: uuid()
	});

	return `https://app.sitesauce.app/oauth/authorize?${params}`;
};

const executeAuthFlow = () => {
	return new Promise(async (resolve, reject) => {
		const server = hapi.server({
			port: 49156,
			host: 'localhost'
		});

		server.route({
			method: 'GET',
			path: '/callback',
			handler: async request => {
				try {
					resolve(request.query.access_token);

					return 'Authenticated successfully. You can close this tab now.<script>window.close();</script>';
				} catch (error) {
					reject(error);
				} finally {
					server.stop();
				}
			}
		});

		await server.start();

		open(buildAuthorizeUrl());
	});
};

module.exports = {
	command: 'login',
	describe: 'Connect your Sitesauce account',
	handler
};
