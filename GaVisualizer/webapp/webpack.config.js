const webpack = require('webpack');
const path = require('path');

const outputPath = path.resolve(__dirname, 'dist');
const Dotenv = require('dotenv-webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: [
        './src/index.js'
    ],
    output: {
        path: outputPath,
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: '/node_modules/',
                use: ['babel-loader']
            },
            {
                test: /\.(jsx?)$/,
                loader: 'eslint-loader',
                exclude: '/node_modules',
                options: {
                  configFile: '.eslintrc.js'
                }
            },
            {
                test: /\.(scss|sass)/,
                loader: 'style-loader!css-loader!sass-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            },
            { 
                test: /\.(png|gif|woff|woff2|eot|ttf|svg)$/, 
                loader: 'url-loader?limit=100000' 
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
            filename: 'index.html',
            path: outputPath
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new Dotenv({
            path: './.env',
            systemvars: true
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devServer: {
        historyApiFallback: true,
        contentBase: outputPath,
        publicPath: '/',
        port: 3000,
        inline: true,
        hot: true
    }
}

module.exports = config;