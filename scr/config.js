const Conf = require('conf');

const schema = {
	token: {
		type: 'string',
		default: null
	}
};

const config = new Conf({
	schema
});

module.exports = config;
