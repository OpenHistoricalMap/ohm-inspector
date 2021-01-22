/*
 * JavaScript entry point for webpack to compile the API widget
 * Entry points for the stylesheet and the widget's JS code
 * and an export which the webpack.config.js will place into the OpenHistoricaMapInspector namespace
 */

// miscellaneous components and polyfills
require('./polyfills.js');  // eslint-disable-line

// the HTML file isn't processed at all, but we do "process" it so as to trigger a page reload when running under webpack-dev-server
require('./index.html');  // eslint-disable-line

// the API code itself
require('./openhistoricalmap-inspector.scss');  // eslint-disable-line
const OpenHistoricaMapInspector = require('./openhistoricalmap-inspector');  //eslint-disable-line
export default OpenHistoricaMapInspector;
