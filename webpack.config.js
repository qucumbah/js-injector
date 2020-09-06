const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/app/index.tsx',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
    ],
  },
  devtool: 'inline-source-map',
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './src/extension',
        },
      ],
    }),
  ],
  output: {
    filename: 'bundle.js',
  },
};
