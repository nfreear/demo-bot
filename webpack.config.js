/**
 *
 * @see https://webpack.js.org/configuration/
 * @see https://webpack.js.org/guides/code-splitting/
 */

const { readFileSync } = require('fs');
const { join, resolve } = require('path');
// Was: const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// Was: NamedModulesPlugin,
const { HotModuleReplacementPlugin, BannerPlugin } = require('webpack');

const NLPJS_LICENSE = resolve(__dirname, 'src', 'nlpjs-license.ts');

module.exports = {
    entry: './src/app.ts',
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
        hot: true
        // , port: 8080
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                include: [
                    join(__dirname, 'src'),
                    join(__dirname, 'node_modules/botbuilder-core/lib')
                ],
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        // new CleanWebpackPlugin(),
        // new NamedModulesPlugin(), // Is this needed??
        new HotModuleReplacementPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: resolve(__dirname, 'index.html'), to: '' },
                { from: resolve(__dirname, 'bot', 'corpus-en.json'), to: '' }
            ]
        }),
        new BannerPlugin({
            banner: readFileSync(NLPJS_LICENSE, 'utf8'),
            raw: true
        })
    ],
    resolve: {
        extensions: ['.css', '.js', '.ts']
    },
    output: {
        filename: 'app.js',
        path: resolve(__dirname, 'dist')
    },
    stats: {
        // errorDetails: true
    },
    // https://webpack.js.org/configuration/node/
    node: {
        global: true, // true = use Polyfill ?
        __filename: true, // ??
        __dirname: true
        /* fs: 'empty',
        net: 'empty',
        tls: 'empty' */ // Was:
    }
};
