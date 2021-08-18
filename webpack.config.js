const path = require('path')
const mode = process.env.NODE_ENV || 'production'

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'worker.js',
    path: path.join(__dirname, 'dist'),
  },
  devtool: 'cheap-module-source-map',
  mode,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
			'@components': path.resolve(__dirname, './src/components'),
      "@type": path.resolve(__dirname, "./src/type"),
      "@route": path.resolve(__dirname, "./src/route"),
      "@service": path.resolve(__dirname, "./src/service"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@page": path.resolve(__dirname, "./src/page"),
      "@util": path.resolve(__dirname, "./src/util"),
      "@style": path.resolve(__dirname, "./src/style"),
      "@lang": path.resolve(__dirname, "./src/lang"),
      "@src": path.resolve(__dirname, "./src")
		}
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader',
          'ts-loader'
        ]
      },
    ],
  },
}
