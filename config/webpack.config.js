const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const resolve = filePath => path.join(__dirname, filePath);
const isDev = process.env.NODE_ENV === 'development';
console.log('env:', process.env.NODE_ENV);

module.exports = {
  entry: './app.ts',
  devtool: isDev ? 'eval-cheap-source-map' : 'hidden-source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          compress: {
            ecma: 5,
            drop_console: true,
          },
        },
      }),
    ]
  },
  output: {
    path: resolve('../dist/'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    library: {
      type: 'commonjs-static',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css'],
    alias: {
      '@': resolve('../src'),
    },
  },
  plugins: [new ESLintWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.ts[x]?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      },
    ]
  },
};