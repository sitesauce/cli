#!/usr/bin/env node
'use strict';
const yargs = require('yargs')
const config = require('./src/config/local')

yargs.scriptName('$ sitesauce')
	.usage('$0 <cmd> [args]')
	.commandDir('src/commands', {
		recurse: true,
	})
	.help()
	.recommendCommands()
	.demandCommand(1, '')
	.showHelpOnFail()
	.onFinishCommand(cleanConfig)
	.argv

function cleanConfig() {
	if (config.empty()) {
		config.deleteFile().removeDir()
	} else {
		config.addReadme().addGitignore()
	}
}
