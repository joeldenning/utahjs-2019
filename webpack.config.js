const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/utah.js'),
  output: {
    filename: 'utah.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  devtool: 'sourcemap',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  devServer: {
    publicPath: '/dist/'
  }
}