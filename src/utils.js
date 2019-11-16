module.exports = {
	parseInput: input => {
		return {
			command: (command => command.length === 1 ? command[0] : null)(input.splice(0, 1)),
			args: input
		};
	}
};
