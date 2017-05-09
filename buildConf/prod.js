const path = require('path'), webpack = require('webpack'),
	SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = {
	context: path.resolve(__dirname, '../app'),
	entry: './index',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../docs/js'),
		sourceMapFilename: '[name].js.map'
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true
		}),
		new SWPrecacheWebpackPlugin(
			{
				cacheId: 'Catgil Invaders',
				filepath: path.resolve(__dirname, '../docs/service-worker.js'),
				minify: true,
				staticFileGlobs: [
					'docs/*.{html,css,json,xml}',
					'docs/js/*.js'
				],
				stripPrefix: 'docs/'
			}
		)
	],
	module: {},
	devtool: 'source-map'
};
