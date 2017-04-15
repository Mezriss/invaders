const path = require('path'), webpack = require('webpack');

console.info(path.resolve(__dirname, '../app'));

module.exports = {
	context: path.resolve(__dirname, '../app'),
	entry: './index',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../docs'),
		sourceMapFilename: '[name].js.map'
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true
		})
	],
	module: {},
	devtool: 'source-map'
};
