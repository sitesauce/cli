#!/usr/bin/env node
'use strict';
const yargs = require('yargs')

yargs.scriptName('$ sitesauce')
	.usage('$0 <cmd> [args]')
	.commandDir('src/commands', {
		recurse: true,
	})
	.help()
	.recommendCommands()
	.demandCommand(1, '')
	.showHelpOnFail()
	.argv
