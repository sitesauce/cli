const hapi = require('@hapi/hapi')
const open = require('open')
const uuid = require("uuid/v1")
const querystring = require('querystring')
const config = require('./../config')

function handle() {
	executeAuthFlow().then(token => {
		config.set({ token })

		console.log('Successfully logged in to your Sitesauce account!')
	});
}

const buildAuthorizeUrl = codeChallenge => {
	const params = querystring.stringify({
		client_id: 6,
		response_type: "token",
		scope: '',
		redirect_uri: 'http://localhost:49156/callback',
		state: uuid(),
	});

	return `https://sitesauce.wip/oauth/authorize?${params}`;
};

const executeAuthFlow = () => {
	return new Promise(async (resolve, reject) => {
		const server = hapi.server({
			port: 49156,
			host: "localhost"
		});

		server.route({
			method: "GET",
			path: "/callback",
			handler: async request => {
				try {
					resolve(request.query.access_token);

					return `Authenticated successfully. You can close this tab now.`;
				} catch (err) {
					reject(err);
				} finally {
					server.stop();
				}
			}
		});

		await server.start();

		console.log(`Logging you in...`)

		open(buildAuthorizeUrl());
	});
};

module.exports = handle;
