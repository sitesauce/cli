const Conf = require('conf');

const schema = {
	init: {
		type: 'boolean',
		default: false
	},
	siteId: {
		type: 'integer'
	}
};

const config = new Conf({
	schema,
	configName: '.sitesauce',
	projectName: 'sitesauce',
	cwd: process.cwd(),
	clearInvalidConfig: false
});

module.exports = config;
