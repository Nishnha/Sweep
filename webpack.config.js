const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/js/hive.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader', options: {
              sourceMap: true
            }
          }, {
            loader: 'sass-loader', 
            options: {
              sourceMap: true
            }
          }]
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules|lib/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'main.css'
    })
  ]
};

