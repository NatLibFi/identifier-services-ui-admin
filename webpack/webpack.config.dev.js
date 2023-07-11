const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(path.join(__dirname, '..', 'src', 'frontend', 'index.js')),
  output: {
    path: path.resolve(__dirname, '../dist/public'),
    filename: '[name]-bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpg|gif|png|svg|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[hash:8].[ext]',
              outputPath: 'images/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(path.join(__dirname, '../public/index.html')),
      filename: 'index.html'
    })
  ],
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [
        __filename
      ]
    }
  }
};
