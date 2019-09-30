/*
 * Basic usage:
 * - yarn install -- Initial setup of dependencies for build/watch tasks
 * - npm run build -- Analyze files, generate output files.
 * - npm run watch -- Watches for file changes, recompiles as needed.
 */

// the list of .js6 entry point files
// in addition to being ES2015 JavaScript code, these may require() the .src.html and .less files to also be compiled into their own outputs
// tip: require()ing other stuff, or even having JavaScript code in the file, is typical but optional
// you could have a .js6 file which effectively only serves to create a bundle of third-party code or a shared stylesheet

const JS6_FILES = [
    './api.js',
];

/////////////////////////////////////////////////////////////////////////////////////////////////////////

const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: JS6_FILES.reduce((o, key) => { o[key.replace(/\.js6$/, '')] = key; return o; }, {}),
    output: {
        path: __dirname + '/api/',
        filename: 'api.js',
        publicPath: "/api/",
        // allow the export (which itself is a namespace object) into the global namespace
        libraryTarget: 'var',
        library: 'CNRA'
    },

    module: {
        loaders: [
            /*
             * Plain JS files
             * just kidding; Webpack already does those without any configuration  :)
             * but we do not want to lump them in with ES6 files: they would be third-party and then run through JSHint and we can't waste time linting third-party JS
             */

            /*
             * run .js6 files through Babel + ES2015 via loader; lint and transpile into X.js
             * that's our suffix for ECMAScript 2015 / ES6 files
             */
            {
                test: /\.js$/,
                use: [
                    { loader: 'babel-loader', options: { presets: ['env'], 'env': { 'production': { 'presets': ['minify'] } } } },
                    { loader: 'jshint-loader', options: { esversion: 6, emitErrors: true, failOnHint: true } }
                ],
                exclude: /node_modules/
            },

            /*
             * CSS files and also SASS-to-CSS all go into one bundled X.css
             */
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        { loader: 'css-loader', options: { minimize: true, sourceMap: true, url: false } }
                    ],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        { loader: 'css-loader', options: { minimize: true, sourceMap: true, url: false } },
                        { loader: 'sass-loader', options: { sourceMap:true } },
                    ],
                    fallback: 'style-loader'
                })
            },

            /*
             * HTML Files
             * we don't really do anything with them at all
             * but we do mention them in the entry point JS, so they can be require()d and thus trigger a page reload during development
             */
            {
                test: /\.html$/,
                use: [
                    { loader: 'ignore-loader' }
                ]
            },

            /*
             * Files to ignore
             * Notably from CSS, e.g. background-image SVG, PNGs, JPEGs, fonts, ...
             * we do not need them processed; our stylesheets etc. will point to them in their proper place
             * webpack scans the HTML files and will throw a fit if we don't account for every single file it finds
             */
            {
                test: /\.(svg|gif|jpg|jpeg|png)$/,
                loader: 'ignore-loader'
            },
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                loader: 'ignore-loader'
            }
        ]
    },


    /*
     * enable source maps, applicable to both JS and CSS
     */
    devtool: "nosources-source-map",

    /*
     * plugins for the above
     */
    plugins: [
        // CSS output from the CSS + LESS handlers above
        new ExtractTextPlugin({
            disable: false,
            filename: 'api.css'
        })
    ],

    /*
     * webpack-dev-server for development
     */
    devServer: {
      contentBase: '.',
      port: 8749
    }
};
