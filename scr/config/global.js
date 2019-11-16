const Conf = require('conf');

const schema = {
	token: {
		type: 'string'
	}
};

const config = new Conf({
	schema,
	projectName: 'sitesauce'
});

module.exports = config;
