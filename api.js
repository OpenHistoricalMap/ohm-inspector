/*
 * JavaScript entry point for webpack to compile the API widget
 * Entry points for the stylesheet and the widget's JS code
 * and an export which the webpack.config.js will place into the CNRA namespace
 */

// components, polyfills, and stylesheets
require('./polyfills.js');
require('./openhistoricalmap-inspector.scss');

// the HTML file isn't processed at all, but we do "process" it so as to trigger a page reload when running under webpack-dev-server
require('./index.html');

// the API code itself
import { OpenHistoricaMapInspector } from './openhistoricalmap-inspector';

module.exports = {
    OpenHistoricaMapInspector,
};
