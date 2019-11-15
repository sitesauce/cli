const ping = require('./ping');
const login = require('./auth/login');
const logout = require('./auth/logout');
const user = require('./auth/user');
const team = require('./auth/team');

module.exports = {
	ping,
	login,
	user,
	logout,
	team,
};
