const axios = require('axios')
const config = require('./config')

class Client {
	constructor() {
		this.client = axios.create({
			baseURL: 'http://sitesauce.wip/api/',
			headers: {
				Authorization: `Bearer ${config.get('token')}`
			}
		})
	}

	isAuthenticated() {
		return config.has('token')
	}

	async getUser() {
		return await this.client.get('user').then(response => response.data)
	}

	async getTeam() {
		return await this.client.get('team').then(response => response.data)
	}

	async getTeams() {
		return await this.client.get('teams').then(response => response.data)
	}

	async switchTeam(teamId) {
		return await this.client.post(`teams/switch/${teamId}`).then(response => response.data)
	}
}

module.exports = new Client
