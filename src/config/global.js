const Conf = require('conf');

const schema = {
	token: {
		type: 'string'
	},
	teamId: {
		type: 'integer'
	}
};

const config = new Conf({
	schema,
	projectName: 'sitesauce-cli',
	projectSuffix: ''
});

module.exports = config;
