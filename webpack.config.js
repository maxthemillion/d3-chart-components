const merge = require('webpack-merge');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

var commonConfig = {
  entry: path.resolve(__dirname + '/src/App.vue'),
  externals: {
    moment: 'moment',
    d3: 'd3'
  },
  output: {
    path: path.resolve(__dirname + '/dist/'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        include: __dirname
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]};

module.exports = [  
    // For Node-based development environments
    merge(commonConfig, {
        entry: path.resolve(__dirname + '/src/App.vue'),
        output: {
          filename: 'vue-d3Linechart.js',
          libraryTarget: 'umd',
          library: 'VueD3Linechart',
          umdNamedDefine: true
        }
      })
  ];
  