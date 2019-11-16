const axios = require('axios');
const config = require('./config/global');

class Client {
	constructor() {
		this.client = axios.create({
			baseURL: 'http://sitesauce.wip/api/',
			headers: {
				Authorization: `Bearer ${config.get('token')}`
			}
		});
	}

	isAuthenticated() {
		return config.has('token');
	}

	getUser() {
		return this.client.get('user').then(response => response.data);
	}

	getTeam() {
		return this.client.get('team').then(response => response.data);
	}

	getTeams() {
		return this.client.get('teams').then(response => response.data);
	}

	switchTeam(teamId) {
		return this.client.post(`teams/switch/${teamId}`).then(response => response.data);
	}

	getSites() {
		return this.client.get('team/sites').then(response => response.data);
	}
}

module.exports = new Client();
