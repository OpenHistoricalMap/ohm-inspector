const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ExtractSvgSpritePlugin = require('extract-svg-sprite-webpack-plugin');

module.exports = {
    entry: './api.js',
    output: {
        path: __dirname + '/api/',
        filename: 'api.js',
        publicPath: "/api/",
        // allow the export (which itself is a namespace object) into the global namespace
        library: 'openhistoricalmap',
        libraryTarget: 'var',
        libraryExport: 'default',
    },
    mode: 'production',
    plugins: [
        new MiniCssExtractPlugin({
            path: __dirname + '/api/',
            filename: 'api.css',
        }),
        new ExtractSvgSpritePlugin(),
    ],
    devtool: "nosources-source-map",
    devServer: {
      contentBase: '.',
      port: 8749,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                exclude: /node_modules/,
                use : [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"]
                        },
                    },
                    {
                        loader: 'eslint-loader',
                    },
                ],
            },
            {
                test: /\.(css|scss)$/,
                use : [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    ExtractSvgSpritePlugin.cssLoader,
                    'sass-loader',
                ],
            },
            {
                test: /\.html$/,
                use : [
                    "ignore-loader",
                ],
            },
            {
                test: /\.(svg)$/,
                use : [
                    {
                        loader: ExtractSvgSpritePlugin.loader,
                    },
                ],
            },
            {
                test: /\.(gif|jpg|jpeg|png)$/,
                use : [
                    "ignore-loader",
                ],
            },
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                use : [
                    "ignore-loader",
                ],
            },
        ]
    },
};
