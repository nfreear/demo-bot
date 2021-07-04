/**
 * Vary the build based on the `BOT_ID`.
 *
 * @copyright © Nick Freear, 22-June-2021.
 *
 * @see https://webpack.js.org/configuration/
 */

const { readFileSync } = require('fs');
const { join, resolve } = require('path');
// Was: const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// Was: NamedModulesPlugin,
const { HotModuleReplacementPlugin, BannerPlugin, NormalModuleReplacementPlugin } = require('webpack');
const logging = require('webpack/lib/logging/runtime');
const logger = logging.getLogger('default');

module.exports = (env) => {
  const BOT_ID = env.BOT_ID && env.BOT_ID === 'survey' ? 'survey' : 'demo';
  const IS_SURVEY_BOT = BOT_ID === 'survey';

  const NLPJS_LICENSE = resolve(__dirname, 'src', 'nlpjs-license.ts');

  logger.info('>> Env:', env);

  // process.exit( 1 );

  return {
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
                    join(__dirname, 'node_modules/botbuilder-core/lib'),

                    // join(__dirname, 'src', `getNlpConfig${IS_SURVEY_BOT ? 'Survey' : ''}.*`),
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
        /* new DefinePlugin({
            BOT_ID: JSON.stringify(BOT_ID),
            IS_SURVEY_BOT,
            // getNlpConfigImportPath: JSON.stringify(`./getNlpConfig${IS_SURVEY_BOT ? 'Survey' : ''}`),
        }), */
        // new CleanWebpackPlugin(),
        // new NamedModulesPlugin(), // Is this needed??
        new HotModuleReplacementPlugin(),
        new CopyWebpackPlugin({
            patterns: getCopyWebpackPluginPatterns(IS_SURVEY_BOT),
        }),
        new BannerPlugin({
            banner: readFileSync(NLPJS_LICENSE, 'utf8'),
            raw: true
        }),
        new NormalModuleReplacementPlugin(
            /\.\/getNlpConfig/,
            `./getNlpConfig${IS_SURVEY_BOT ? 'Survey' : ''}`
        )
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
  }; // End: return.

}; // End: => function.

// --------------------------------------------------------

function getCopyWebpackPluginPatterns(isSurveyBot) {
    let patterns;

    if (isSurveyBot) {
        const SB_DIR = resolve(__dirname, 'survey-bot');
        const _X_SB_DIR = resolve(__dirname, '..', 'node_modules', '@nfreear', 'survey-bot');

        patterns = [
            { from: resolve(__dirname, 'bot', 'survey', 'index.html'), to: '' },
            { from: resolve(SB_DIR, 'public', 'styles', 'app.css'), to: 'survey-app.css' },
            { from: resolve(SB_DIR, 'bot', 'corpus-en.json'), to: '' },
            { from: resolve(__dirname, 'bot', 'survey', 'pipelines.md'), to: '' },
            { from: resolve(__dirname, 'README.md'), to: '' }
        ];
    } else {
        patterns = [
            { from: resolve(__dirname, 'index.html'), to: '' },
            { from: resolve(__dirname, 'bot', 'corpus-en.json'), to: '' },
            { from: resolve(__dirname, 'bot', 'pipelines.md'), to: '' },
            { from: resolve(__dirname, 'README.md'), to: '' }
        ];
    }

    console.debug('>> Patterns:', patterns);

    return patterns;
}
