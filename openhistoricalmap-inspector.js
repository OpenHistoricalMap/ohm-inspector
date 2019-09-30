require('./etc/glyphicons/css/glyphicons.css');

export class OpenHistoricaMapInspector {
    constructor (options) {
        // step 1: load default options, merging their passed-in without these defaults
        this.options = Object.assign({
            apiBaseUrl: "https://openhistoricalmap.org/api/",                   // the API URL and version to use
            apiVersion: "0.6",
            classicDivQuerySelector: '#sidebar_content div.browse-section',     // querySelector path to the "classic" inspector output, so we can interact with it, e.g. show/hide
            featureTitleBar: '#sidebar_content > h2',                               // querySelector path to the title area of the inspector, which is not part of the inspector's readout panel
            onFeatureLoaded: function () {},                                    // give the caller more power, by passing them a copy of features that we load
            debug: false,                                                       // debugging output, mostly useful to developers of this utility
        }, options);
        if (this.options.debug) console.debug([ 'OpenHistoricaMapInspector loaded options', this.options ]);

        // step 2: sanity checks on those options, and/or defining other settings which derive frm those options
        // none at this time

        // step 3: create our own DIV in the sidebar, then hide the classic panel
        // we won't actually have anything to show until selectFeature() is called
        this.oldpanel = document.querySelector(this.options.classicDivQuerySelector);
        this.titlebar = document.querySelector(this.options.featureTitleBar);

        this.mypanel = document.createElement('DIV');
        this.mypanel.classList.add('openhistoricalmap-inspector-panel');

        this.oldpanel.parentNode.insertBefore(this.mypanel, this.oldpanel);

        this.hideClassicPanel();
    }

    selectFeature(type, id) {
        // construct API URL e.g.   https://openhistoricalmap.org/api/0.6/way/198180481
        const url = `${this.options.apiBaseUrl}/${this.options.apiVersion}/${type}/${id}`;
        if (this.options.debug) console.debug(`OpenHistoricaMapInspector selectFeature(${type}, ${id}) => ${url}`);

       const request = new XMLHttpRequest();
        request.open('GET', url);
        request.onload = () => {
            // clear existing content
            this.mypanel.innerHTML = "";

            // handle Not Found
            if (request.status == 404) {
                this.titlebar.innerHTML = 'Not Found';
                this.mypanel.innerHTML = `<p>No such feature: ${type} ${id}</p>`;
                return;
            }

            const xmldoc = new DOMParser().parseFromString(request.response, "text/xml");
            this.renderFeatureDetails(type, id, xmldoc);
        };
        request.onerror = function () {
            alert('Unable to contact the OHM server at this time. Please try again later.');
        };
        request.send();

        //GDA
        // don't forget to call onFeatureLoaded() so the caller can also get a copy of the parsed feature and maybe do something about it
        // note that the API output only includes propertes and not geometry info, so "simple" stuff like centering on the feature aren't readily feasible
    }

    renderFeatureDetails(type, id, xmldoc) {
//GDA
    }

    showClassicPanel () {
        // the pre-existinginspector output is in document.querySelector(classicDivQuerySelector)
        // goal here is to hide our own DIV and show that one
        this.oldpanel.style.display = 'block';
        this.mypanel.style.display = 'none';
    }

    hideClassicPanel () {
        // the pre-existinginspector output is in document.querySelector(classicDivQuerySelector)
        // goal here is to hide that DIV and show our own
        this.oldpanel.style.display = 'none';
        this.mypanel.style.display = 'block';
    }
}
