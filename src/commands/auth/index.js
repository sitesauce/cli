const login = require('./login');
const logout = require('./logout');
const user = require('./user');
const team = require('./team');
const switchTeam = require('./switch');

module.exports = {
	login, logout, user, team, switch: switchTeam
};
