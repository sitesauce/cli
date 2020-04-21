const Conf = require('conf')
const fs = require('fs')
const path = require('path')

const schema = {
	siteId: {
		type: 'integer'
	},
	teamId: {
		type: 'integer'
	},
};

class LocalConf extends Conf {
	empty() {
		return this.get('siteId', false) === false
	}

	deleteFile() {
		if (fs.existsSync(this.path)) fs.unlinkSync(this.path)

		return this
	}

	removeDir() {
		fs.rmdirSync(this._options.cwd)
	}

	addReadme() {
		const readmePath = path.join(this._options.cwd, 'README.md')

		if (fs.existsSync(readmePath)) return this

		fs.copyFileSync(path.join(__dirname, 'config.md'), readmePath)

		return this
	}

	async addGitignore() {
		try {
			const gitIgnorePath = path.join(process.cwd(), '.gitignore');

			const gitIgnore = fs.readFileSync(gitIgnorePath).toString()

			if (!gitIgnore || !gitIgnore.split('\n').includes('.sitesauce')) {
				fs.writeFileSync(gitIgnorePath, gitIgnore ? `${gitIgnore}\n.sitesauce` : '.sitesauce');
			}
		} catch (error) {
			// ignore errors since this is non-critical
		}
	}
}

const config = new LocalConf({
	schema,
	configName: 'site',
	projectName: 'sitesauce',
	cwd: path.join(process.cwd(), '.sitesauce'),
	clearInvalidConfig: true
});

module.exports = config;
