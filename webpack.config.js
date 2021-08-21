// 1. import default from the plugin module
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;

// 2. create a transformer;
// the factory additionally accepts an options object which described below
const styledComponentsTransformer = createStyledComponentsTransformer({
  ssr: true,
  minify: true
})

const path = require('path')
const { Stream } = require('stream')
const mode = process.env.NODE_ENV || 'production'

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'worker.js',
    path: path.join(__dirname, 'dist'),
  },
  devtool: 'cheap-module-source-map',
  mode,
  externals: [
    'stream',
    'string_decoder'
  ],
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
      "@exception": path.resolve(__dirname, "./src/exception"),
      "@interface": path.resolve(__dirname, "./src/interface"),
      "@model": path.resolve(__dirname, "./src/model"),
      "@view": path.resolve(__dirname, "./src/view"),
      "@src": path.resolve(__dirname, "./src")
		}
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          getCustomTransformers: () => ({ before: [styledComponentsTransformer] })
        }
      },
    ],
  },
}
