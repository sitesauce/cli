const Conf = require('conf');
const fs = require('fs')

const schema = {
	init: {
		type: 'boolean',
		default: false
	},
	siteId: {
		type: 'integer'
	}
};

class LocalConf extends Conf {
	deleteFile() {
		fs.unlinkSync(`${process.cwd()}/.sitesauce.json`)
	}
}

const config = new LocalConf({
	schema,
	configName: '.sitesauce',
	projectName: 'sitesauce',
	cwd: process.cwd(),
	clearInvalidConfig: false
});

module.exports = config;
