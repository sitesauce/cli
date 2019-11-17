function handler() {
	console.log('Pong!');
}

module.exports = {
	command: 'ping',
	describe: 'Pong!',
	handler
};
