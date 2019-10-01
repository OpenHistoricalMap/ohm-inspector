export class OpenHistoricaMapInspector {
    constructor (options) {
        // step 1: load default options, merging their passed-in without these defaults
        this.options = Object.assign({
            apiBaseUrl: "https://openhistoricalmap.org/api/",                   // the API URL and version to use
            apiVersion: "0.6",
            classicDivQuerySelector: '#sidebar_content div.browse-section',     // querySelector path to the "classic" inspector output, so we can interact with it, e.g. show/hide
            featureTitleBar: '#sidebar_content > h2',                           // querySelector path to the title area of the inspector, which is not part of the inspector's readout panel
            featureFooter: '#sidebar_content div.secondary-actions',            // querySelector path to the secondary actions footer with the Download XML and View History
            onFeatureLoaded: function () {},                                    // give the caller more power, by passing them a copy of features that we load
            onFeatureFail: function () {},                                      // let the caller do something when selectFeature() fails, e.g. feature not found
            debug: false,                                                       // debugging output, mostly useful to developers of this utility
        }, options);
        if (this.options.debug) console.debug([ 'OpenHistoricaMapInspector loaded options', this.options ]);

        // step 2: sanity checks on those options, and/or defining other settings which derive frm those options
        // none at this time

        // step 3: create our own DIV in the sidebar, then hide the classic panel
        // we won't actually have anything to show until selectFeature() is called
        this.oldpanel = document.querySelector(this.options.classicDivQuerySelector);
        this.titlebar = document.querySelector(this.options.featureTitleBar);
        this.footer = document.querySelector(this.options.featureFooter);

        this.mypanel = document.createElement('DIV');
        this.mypanel.classList.add('openhistoricalmap-inspector-panel');

        this.oldpanel.parentNode.insertBefore(this.mypanel, this.oldpanel);

        this.hideClassicPanel();
    }

    selectFeature(type, id) {
        // construct API URL e.g. https://openhistoricalmap.org/api/0.6/way/198180481
        const url = `${this.options.apiBaseUrl}/${this.options.apiVersion}/${type}/${id}`;
        if (this.options.debug) console.debug(`OpenHistoricaMapInspector selectFeature(${type}, ${id}) => ${url}`);

        const success = (xmldoc) => {
            this.renderFeatureDetails(type, id, xmldoc);
            this.options.onFeatureLoaded.call(this, type, id, xmldoc);
        };
        const notfound = () => {
            this.renderNotFound(type, id);
            this.options.onFeatureFail.call(this, type, id);
        };
        const failure = () => {
            this.renderNetworkError();
            this.options.onFeatureFail.call(this, type, id);
        };
        this.fetchXmlData(url, success, notfound, failure);
    }

    renderNetworkError () {
        this.titlebar.innerHTML = 'Error';
        this.footer.innerHTML = '';
        this.mypanel.innerHTML = "<p>Unable to contact the OHM server at this time. Please try again later.</p>";
    }

    renderNotFound (type, id) {
        this.titlebar.innerHTML = 'Not Found';
        this.footer.innerHTML = '';
        this.mypanel.innerHTML = `<p>No such feature: ${type} ${id}</p>`;
    }

    fetchXmlData (url, success, notfound, failure) {
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.onload = () => {
            if (request.status == 404) return notfound();  // 404 Not Found is not an error; it is a valid response from the server

            const xmldoc = new DOMParser().parseFromString(request.response, "text/xml");
            success(xmldoc);
        };
        request.onerror = () => {  // does not cover 404s, but 500s and network errors
            failure();
        };
        request.send();
    }

    renderFeatureDetails(type, id, xmldoc) {
//GDA
console.debug([ type, id, xmldoc ]);
console.debug([ this.footer, this.titlebar, this.mypanel ]);
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
