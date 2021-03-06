const axios = require('axios');
const config = require('./config/global');

class Client {
	constructor() {
		this.client = axios.create({
			baseURL: 'https://app.sitesauce.app/api/',
			headers: {
				Authorization: `Bearer ${config.get('token')}`
			},

		});
	}

	isAuthenticated() {
		return config.has('token');
	}

	getUser() {
		return this.client.get('user').then(response => response.data);
	}

	getTeam() {
		return this.client.get(`team/${config.get('teamId')}`).then(response => response.data);
	}

	getTeams() {
		return this.client.get('user/teams').then(response => response.data);
	}

	getSites() {
		return this.client.get(`team/${config.get('teamId')}/sites`).then(response => response.data);
	}

	createSite(opts) {
		return this.client.post('sites/create', opts).then(response => response.data)
	}

	createDeployment(siteId, opts) {
		return this.client.post(`sites/${siteId}/deployments/tunnel`, opts).then(response => response.data)
	}

	getDeploymentInfo(siteId, deploymentId) {
		return this.client.get(`sites/${siteId}/deployments/${deploymentId}/info`).then(response => response.data)
	}
}

module.exports = new Client();
