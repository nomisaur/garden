const webpack = require('webpack');
const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const resolvePath = (filePath) => path.resolve(__dirname, filePath);

module.exports = (env, argv) => {
   const isDev = argv.mode === 'development';

   return {
      entry: resolvePath('./src/index.js'),
      module: {
         rules: [
            {
               test: /\.(js|jsx)$/,
               exclude: /node_modules/,
               use: ['babel-loader'],
            },
            {
               test: /\.(jpg|png)$/,
               use: {
                  loader: 'url-loader',
               },
            },
         ],
      },
      resolve: {
         extensions: ['*', '.js', '.jsx'],
      },
      output: {
         path: resolvePath('./dist'),
         filename: 'build/bundle.js',
      },
      plugins: [
         new webpack.HotModuleReplacementPlugin(),
         new webpack.DefinePlugin({ webpackConfig: { isDev } }),
         new CircularDependencyPlugin({
            exclude: /a\.js|node_modules/,
            include: /src/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: process.cwd(),
         }),
      ],
      devServer: {
         contentBase: resolvePath('./dist'),
         hot: true,
      },
      ...(isDev ? { devtool: 'eval-source-map' } : {}),
   };
};
