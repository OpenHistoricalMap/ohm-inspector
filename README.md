# ohm-inspector

An enhancement to the OpenHistoricalMap Inspector in the left sidebar.

Github: https://github.com/OpenHistoricalMap/ohm-inspector/

Demo and API Docs: https://open-historical-map-labs.github.io/ohm-inspector/

For development notes see *DEVELOPMENT.md*


## Usage and Documentation

First, include the JS and CSS files into your project:

```
<script type="text/javascript" src="https://open-historical-map-labs.github.io/ohm-inspector/api/api.js"></script>
<link rel="stylesheet" type="text/css" href="https://open-historical-map-labs.github.io/ohm-inspector/api/api.css" />
```

Then, instantiate the widget with any relevant settings. If you're using the standard OHM sidebar, this should detect the current inspector panels and work with them smoothly.

```
// nothing visible will happen at first, until you call selectFeature() to have it select a OHM feature
var inspector = new openhistoricalmap.OpenHistoricaMapInspector();
inspector.selectFeature('way', 123456);
```


### Constructor Options

`apiBaseUrl` -- The URL of the OpenStreetMap/OpenHistoricalMap Overpass API. This deaults to *https://openhistoricalmap.org/api/*

`apiVersion` -- The API version to use when querying the OpenStreetMap/OpenHistoricalMap Overpass API. This should be set to *0.6* and not changed.

`onFeatureLoaded(type, id, featurexml)` -- An optional callback function to handle a feature loaded by `selectFeature()`, beyond the panel's own behavior of showing the feature. Within the function, `this` refers to the OpenHistoricaMapInspector control. Params passed in will be the OSM feature type selected, the OSM feature ID selected, and the resulting XML DOM object https://www.w3schools.com/xml/xml_parser.asp.

`onFeatureFail(type, id)` -- An optional callback function to handle an error condition when trying to fetch data via `selectFeature()`. This includes server errors, network errors, and the feature not being found. Within the function, `this` refers to the OpenHistoricaMapInspector control. Params passed in will be the OSM feature type and feature ID selected.


### Methods

`selectFeature(type, id)` -- Fetch information from the OSM Overpass API and display it in the Inspector.

`selectFeatureFromUrl()` -- Read the address bar and figure out the OSM feature, e.g. _/way/123456789_ then call `selectFeature()` accordingly. This is a convenience method so you don't need to parse the URL yourself.

`showClassicPanel()` -- Hide the OpenHistoricaMapInspector panel and show the classsic inspector output. The stock/classic OSM inspector content is hidden by default. This behavior is also triggered by the "OHM Way Info" link, for people who prefer the stock OSM readout.

`hideClassicPanel()` -- Hide the classsic inspector output and show the OpenHistoricaMapInspector panel.


## Testing in the Debugger

You may test this functionality in an existing OSM/OHM browser window by pasting code into your browser's debugger. This example uses jQuery since that is used on OSM/OHM website so will be available.

* Open a browser window/tab to a OHM page showing a way, e.g. https://openhistoricalmap.org/way/198180481 or https://openhistoricalmap.org/way/198099635

* Open your browser's debugger console.

* Using the console, inject the CSS/JS tags into the document and open Inspector to whatever feature is showing:
  ```
  $('<script type="text/javascript" src="https://open-historical-map-labs.github.io/ohm-inspector/api/api.js"></script>').appendTo($(document.head));
  $('<link rel="stylesheet" type="text/css" href="https://open-historical-map-labs.github.io/ohm-inspector/api/api.css" />').appendTo($(document.head));
  setTimeout(function () {
    var inspector = new openhistoricalmap.OpenHistoricaMapInspector();
    inspector.selectFeatureFromUrl();
  }, 1000);
  ```

* You can manually load a feature other than the one indicated in the URL, by specifying its ID.
  ```
  inspector.selectFeature('way', 198180481);
  inspector.selectFeature('way', 198099635);
  ```

* If you are testing locally, you could use your own in-development copy by using these URLs instead _after_ you run `npm run build` to compile a copy. You may see some SSL errors about webpack, ignore them.
  ```
  $('<script type="text/javascript" src="http://localhost:8749/api/api.js"></script>').appendTo($(document.head));
  $('<link rel="stylesheet" type="text/css" href="http://localhost:8749/api/api.css" />').appendTo($(document.head));
  ```
