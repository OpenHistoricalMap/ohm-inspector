# ohm-inspector

An enhancement to the OpenHistoricalMap Inspector in the left sidebar.

Github: https://github.com/OpenHistoricalMap/ohm-inspector/

Demo and API Docs: https://openhistoricalmap.github.io/ohm-inspector/

For development notes see *DEVELOPMENT.md*


## Usage and Documentation

First, include the JS and CSS files into your project:

```
<script type="text/javascript" src="https://OpenHistoricalMap.github.io/openhistoricalmap-inspector/api/api.js"></script>
<link rel="stylesheet" type="text/css" href="https://OpenHistoricalMap.github.io/openhistoricalmap-inspector/api/api.css" />
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

`showClassicPanel()` -- Hide the OpenHistoricaMapInspector panel and show the classsic inspector output. The stock/classic OSM inspector content is hidden by default. This behavior is also triggered by the "OHM Way Info" link, for people who prefer the stock OSM readout.

`hideClassicPanel()` -- Hide the classsic inspector output and show the OpenHistoricaMapInspector panel.

