const path = require('path')

module.exports = {
	mode: 'development',
	entry: {
		bundle: path.resolve(__dirname, 'public/main.js'),
	},
	output: {
		path: path.resolve(__dirname, 'public/dist'),
		filename: '[name].js',
	},
	devtool: 'source-map',
}
