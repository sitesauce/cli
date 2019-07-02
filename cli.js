#!/usr/bin/env node
'use strict';
const meow = require('meow');
const utils = require('./scr/utils');
const commands = require('./scr/commands');

const cli = meow(`
		Usage
			command [options] [arguments]

		Options
			-h, --help	Display this help message
			-d, --debug	Shows debug information

		Available commands
			ping	Shows an important message
	`, {
	flags: {
		debug: {
			type: 'boolean',
			default: false,
			alias: 'd'
		}
	}
});

const {command, args} = utils.parseInput(cli.input);

if (command === 'help' || !commands[command]) {
	cli.showHelp();
}

commands[command](cli, args);
