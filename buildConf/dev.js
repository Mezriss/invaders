
const path = require('path');

module.exports = {
	context: path.resolve(__dirname, '../app'),
	entry: './index',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../build'),
	},
	devtool: 'inline-source-map'
};
