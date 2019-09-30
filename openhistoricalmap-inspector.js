require('./etc/glyphicons/css/glyphicons.css');

export class OpenHistoricaMapInspector {
    constructor (options) {
        // step 1: load default options, merging their passed-in without these defaults
        this.options = Object.assign({
            apiBaseUrl: "https://openhistoricalmap.org/api/",                   // the API URL and version to use
            apiVersion: "0.6",
            classicDivQuerySelector: '#sidebar_content div.browse-section',     // querySelector path to the "classic" inspector output, so we can interact with it, e.g. show/hide
            onFeatureLoaded: function () {},                                    // give the caller more power, by passing them a copy of features that we load
            debug: false,                                                       // debugging output, mostly useful to developers of this utility
        }, options);
        if (this.options.debug) console.debug([ 'OpenHistoricaMapInspector loaded options', this.options ]);

        // step 2: sanity checks on those options, and/or defining other settings which derive frm those options
        // none at this time

        // step 3: create our own DIV in the sidebar, then hide the classic panel
        // we won't actually have anything to show until selectFeature() is called
        this.mypanel = document.createElement('DIV');
        this.mypanel.classList.add('openhistoricalmap-inspector-panel');
        this.hideClassicPanel();
    }

    selectFeature(type, id) {
        //GDA
        // url = baseurl/version/type/id  e.g.   https://openhistoricalmap.org/api/0.6/way/198180481

        //GDA
        // fetch XML via XHR

        //GDA
        // display the output; not really well defined as to needs here, just a few made-up examples of 3-4 fields such as Wikipedia and photos
        // maybe a few known ones to hardcode here at the top?

        //GDA
        // don't forget to call onFeatureLoaded() so the caller can also get a copy of the parsed feature and maybe do something about it
        // note that the API output only includes propertes and not geometry info, so "simple" stuff like centering on the feature aren't readily feasible
    }

    showClassicPanel () {
        //GDA
        // the pre-existinginspector output is in document.querySelector(classicDivQuerySelector)
        // goal here is to hide our own DIV and show that one
    }

    hideClassicPanel () {
        //GDA
        // the pre-existinginspector output is in document.querySelector(classicDivQuerySelector)
        // goal here is to hide that DIV and show our own
    }
}
