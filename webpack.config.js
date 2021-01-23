const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
                    'sass-loader',
                ],
            },
            {
                test: /\.html$/,
                use : [ "ignore-loader", ],
            },
            {
                test: /\.(svg|gif|jpg|jpeg|png)$/,
                use : [
                    {
                        loader: "file-loader",
                        options: {
                            publicPath: './',
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                use : [
                    {
                        loader: "file-loader",
                        options: {
                            publicPath: './',
                        },
                    },
                ],
            },
        ]
    },
};
