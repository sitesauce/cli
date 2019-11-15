const Conf = require('conf');

const schema = {
	token: {
		type: 'string'
	}
};

const config = new Conf({
	schema
});

module.exports = config;
