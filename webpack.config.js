const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirApp = path.join(__dirname, 'app')
const dirImages = path.join(__dirname, 'images')
const dirAssets = path.join(__dirname, 'assets')
const dirShared = path.join(__dirname, 'shared')
const dirStyles = path.join(__dirname, 'styles')
const dirVideos = path.join(__dirname, 'videos')
const dirNode = 'node_modules'

module.exports = {
    entry: [
        path.join(dirApp, 'index.js'),
        path.join(dirStyles, 'index.scss')
    ],

    resolve: {
        modules: [
            dirApp,
            dirAssets,
            dirShared,
            dirStyles,
            dirNode,
            dirImages,
            dirVideos
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            IS_DEVELOPMENT
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './shared',
                    to: ''

                }
            ]
        }),

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),

        new ImageMinimizerPlugin({
            minimizerOptions: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                // Lossless optimization with custom option
                // Feel free to experiment with options for better result for you
                options: {
                    plugins: [
                        ["gifsicle", { interlaced: true }],
                        ["jpegtran", { progressive: true }],
                        ["optipng", { optimizationLevel: 5 }]
                    ],
                }
            },
        }),

        new CleanWebpackPlugin(),
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                }
            },

            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: ''
                        }
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            // Prefer `dart-sass`
                            implementation: require("sass"),
                          },
                    }
                ]
            },
            {

                test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp|mp4)$/,
                type: 'asset/resource',
                generator: {
                    filename: '[name].[hash].[ext]',
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg|webp)$/i,
                use: [
                    {
                        loader: ImageMinimizerPlugin.loader,
                    },
                ]
            },
            {
                test: /\.(glsl|frag|vert)$/,
                loader: 'raw-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(glsl|frag|vert)$/,
                loader: 'glslify-loader',
                exclude: /node_modules/
            }
        ]
    },

    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    }
}