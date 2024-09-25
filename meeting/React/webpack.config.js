var webpack = require("webpack");
var path = require("path");
var DIST_DIR = path.resolve(__dirname, "webpack_output");
var SRC_DIR = path.resolve(__dirname, "src");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
	stats: {
		errorDetails: true,
	},
	mode: devMode ? 'development' : 'production',
	 devtool: 'cheap-module-source-map', 
  entry: [
	  path.join(__dirname, 'src/app/index.js') 
  ],
	output: {
		path: path.join(__dirname, '../../meeting_scheduler/meeting/frontend/static/js'),
		filename: "bundle.js",
		publicPath: "/frontend/static/js/"
	},
	plugins: [],
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: [ 'babel-loader' ], 
				exclude: /(node_modules)/,
				include: [
			    path.join(__dirname, 'src/app')		
				]
			},
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				type: 'asset/resource',
      },
      {
        test: /\.(jpe?g|png|gif)(\?v=\d+\.\d+\.\d+)?$/,
				type: 'asset/resource',
        generator: {
          filename: '../images/[name][ext]'
        }
      },
      {
		    test: /\.(sa|sc|c)ss$/,
        use: [
					devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ],	
			},
		]
 	}
};

