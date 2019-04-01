'use strict';

const path = require( 'path' );
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

let componentName = 'tabs';

module.exports = {
	mode: process.env.NODE_ENV ? 'development' : 'production',
	entry: [
		'./src/index.js',
		'./src/style.css'
	],
	output: {
		path: path.resolve( __dirname, './dist' ),
		filename: `${ componentName }.js`,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				enforce: 'pre',
				use: {
					loader: 'eslint-loader'
				}
			},
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.css$/,
				exclude: /(node_modules)/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader'
				]
			}
		]
	},
	devtool: 'source-map',
	stats: {
		colors: true
	},
	plugins: [
		new BrowserSyncPlugin( {
			host: '0.0.0.0',
			port: 3000,
			server: { baseDir: [ __dirname ] },
			notify: false,
			files: ['index.html', 'dist/**/*'],
			stream: { once: true },
			injectChanges: true
		} ),
		new MiniCssExtractPlugin( {
			filename: `${ componentName }.css`,
		} ),
	],
};
