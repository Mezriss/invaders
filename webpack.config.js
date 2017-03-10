//todo eliminate dead code
//todo dev and prod builds; fix sourcemap issue

const path = require('path'),
	webpack = require('webpack'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
	context: path.resolve(__dirname, 'app'),
	entry: './index',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		sourceMapFilename: '[name].js.map'
	},
	plugins:[/*
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true
		}),*/
		new ExtractTextPlugin('[name].css'),
		new OptimizeCssAssetsPlugin({
			cssProcessorOptions: { discardComments: {removeAll: true}}
		})
	],
	module: {
		rules: [{
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				use: 'css-loader'
			})
		}]
	},
	devtool: 'inline-source-map'
};
