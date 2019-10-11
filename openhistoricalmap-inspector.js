export class OpenHistoricaMapInspector {
    constructor (options) {
        // try to detect local-dev, or else assume we're being served from Github Pages
        this.code_base_url = document.location.host.indexOf('localhost') == 0 ? document.location.href : 'https://openhistoricalmap.github.io/ohm-inspector';

        // step 1: load default options, merging their passed-in without these defaults
        this.options = Object.assign({
            apiBaseUrl: "https://openhistoricalmap.org/api/",                   // the API URL and version to use
            apiVersion: "0.6",
            classicDivSelector: '#sidebar_content div.browse-section',          // querySelector path to the "classic" inspector output, so we can interact with it, e.g. show/hide
            classicFooterSelector: '#sidebar_content div.secondary-actions',    // querySelector path to the secondary actions footer with the Download XML and View History
            featureTitleBar: '#sidebar_content > h2',                           // querySelector path to the title area of the inspector, which is not part of the inspector's readout panel
            slideshowPrevIcon: `${this.code_base_url}/etc/Octicons-chevron-left.svg`,      // IMG SRC to the image slideshow buttons
            slideshowNextIcon: `${this.code_base_url}/etc/Octicons-chevron-right.svg`,     // IMG SRC to the image slideshow buttons
            onFeatureLoaded: function () {},                                    // give the caller more power, by passing them a copy of features that we load
            onFeatureFail: function () {},                                      // let the caller do something when selectFeature() fails, e.g. feature not found
            debug: false,                                                       // debugging output, mostly useful to developers of this utility
        }, options);
        if (this.options.debug) console.debug([ 'OpenHistoricaMapInspector loaded options', this.options ]);

        // step 2: sanity checks on those options, and/or defining other settings which derive frm those options
        // none at this time

        // step 3: create our own DIV in the sidebar, then hide the classic panel
        // we won't actually have anything to show until selectFeature() is called
        this.oldpanel = document.querySelector(this.options.classicDivSelector);
        this.oldfooter = document.querySelector(this.options.classicFooterSelector);
        this.titlebar = document.querySelector(this.options.featureTitleBar);

        this.initTitlebar();
        this.initFooter();
        this.initPanel();
        this.initSlideshowModal();
        this.hideClassicPanel();
    }

    initPanel () {
        this.mainpanel = document.createElement('DIV');
        this.mainpanel.classList.add('openhistoricalmap-inspector-panel');

        this.oldpanel.parentNode.insertBefore(this.mainpanel, this.oldpanel.nextSibling);
    }

    initTitlebar () {
        this.titlebar.innerHTML = '';
    }

    initFooter () {
        this.footer = document.createElement('DIV');
        this.footer.classList.add('openhistoricalmap-inspector-footer');
        this.oldpanel.parentNode.insertBefore(this.footer, this.oldfooter.nextSibling);

        this.footer.innerHTML = `
            <a href="javascript:void(0);" data-link="openhistoricalmap-inspector-classicview">Switch to Classic Inspector</a>
            <br/>
            <a href="javascript:void(0);" data-link="openhistoricalmap-inspector-newinspector">Switch to OHM Inspector</a>
            <br/>
        `;
        this.footer_classicviewbutton = this.footer.querySelector('a[data-link="openhistoricalmap-inspector-classicview"]');
        this.footer_inspectorviewbutton = this.footer.querySelector('a[data-link="openhistoricalmap-inspector-newinspector"]');

        this.footer_classicviewbutton.addEventListener('click', () => {
            this.showClassicPanel();
        });
        this.footer_inspectorviewbutton.addEventListener('click', () => {
            this.hideClassicPanel();
        });
    }

    initSlideshowModal () {
        this.slideshowmodal = document.createElement('DIV');
        this.slideshowmodal.classList.add('openhistoricalmap-inspector-slideshowmodal');

        this.slideshowmodal.innerHTML = `
            <div class="openhistoricalmap-inspector-slideshowmodal-closebutton">&times;</div>
            <div class="openhistoricalmap-inspector-slideshowmodal-content">
                <img class="openhistoricalmap-inspector-slideshowmodal-image" src="#" />
                <div class="openhistoricalmap-inspector-slideshowmodal-caption"></div>
                <div class="openhistoricalmap-inspector-slideshowmodal-credits"></div>
            </div>
        `;

        this.slideshowmodal_image = this.slideshowmodal.querySelector('img');
        this.slideshowmodal_captionbox = this.slideshowmodal.querySelector('.openhistoricalmap-inspector-slideshowmodal-caption');
        this.slideshowmodal_creditsbox = this.slideshowmodal.querySelector('.openhistoricalmap-inspector-slideshowmodal-credits');

        this.slideshowmodal_closebutton = this.slideshowmodal.querySelector('div.openhistoricalmap-inspector-slideshowmodal-closebutton');
        this.slideshowmodal_closebutton.addEventListener('click', () => {
            this.slideshowmodal.classList.remove('openhistoricalmap-inspector-slideshowmodal-open');
        });

        document.body.appendChild(this.slideshowmodal);
    }

    selectFeatureFromUrl () {
        // read the document address URL and tease out a /way/12345678 portion, so we can load that feature from the address bar
        // this is a convenience so the caller doesn't need to do this same parsing and call selectFeature()
        const url = document.location.href;
        const urlbits = url.match(/\/(way|node|relation)\/(\d+)/);
        if (! urlbits) return console.debug(`selectFeatureFromUrl() page address does not look like a OSM /type/id URL`);

        const type = urlbits[1];
        const id = urlbits[2];
        if (this.options.debug) console.debug(`selectFeatureFromUrl found ${type} ${id}`);
        this.selectFeature(type, id);
    }

    selectFeature (type, id) {
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
        this.footer.style.display = 'none';
        this.mainpanel.innerHTML = "<p>Unable to contact the OHM server at this time. Please try again later.</p>";
    }

    renderNotFound (type, id) {
        this.titlebar.innerHTML = 'Not Found';
        this.footer.style.display = 'none';
        this.mainpanel.innerHTML = `<p>No such feature: ${type} ${id}</p>`;
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

    renderFeatureDetails (type, id, xmldoc) {
        // console.debug([ 'renderFeatureDetails', type, id, xmldoc, this.footer, this.titlebar, this.mainpanel ]);

        // titlebar: use the name tag and the <whatever>'s id attribute
        const name = this.getTagValue(xmldoc, 'name');
        this.titlebar.textContent = `${name} (${type} ${id})`;

        // main body: first, any image:X tags forming a slideshow
        const slideshowimages = [];
        for (var imagei=1; imagei<=99; imagei++) {
            const imageurl = this.getTagValue(xmldoc, `image:${imagei}`);
            const captiontext = this.getTagValue(xmldoc, `image:${imagei}:caption`) || ' ';
            const attribtext = this.getTagValue(xmldoc, `image:${imagei}:src_text`) || ' ';

            if (!imageurl) break;

            slideshowimages.push({
                imageurl,
                captiontext,
                attribtext,
            });
        }
        if (this.options.debug) console.debug([`renderFeatureDetails(type, id) images:` , slideshowimages]);

        if (slideshowimages.length) {
            const htmldiv = document.createElement('DIV');
            htmldiv.classList.add('openhistoricalmap-inspector-panel-slideshow');

            htmldiv.innerHTML = `
                <a class="openhistoricalmap-inspector-panel-slideshow-prevnext openhistoricalmap-inspector-panel-slideshow-prev" href="javascript:void(0);"><img src="${this.options.slideshowPrevIcon}" /></a>
                <a class="openhistoricalmap-inspector-panel-slideshow-prevnext openhistoricalmap-inspector-panel-slideshow-next" href="javascript:void(0);"><img src="${this.options.slideshowNextIcon}" /></a>
            `;
            slideshowimages.forEach((imageinfo, imagei) => {
                const slide = document.createElement('DIV');
                slide.classList.add('openhistoricalmap-inspector-panel-slideshow-slide');
                slide.setAttribute('data-slide-number', imagei);
                slide.innerHTML = `<img src="${imageinfo.imageurl}" title="${imageinfo.captiontext}" />`;

                if (imageinfo.captiontext) {
                    const textbox = document.createElement('SPAN');
                    textbox.classList.add('openhistoricalmap-inspector-panel-slideshow-caption');
                    textbox.textContent = imageinfo.captiontext;
                    slide.appendChild(textbox);
                }
                if (imageinfo.attribtext) {
                    const textbox = document.createElement('SPAN');
                    textbox.classList.add('openhistoricalmap-inspector-panel-slideshow-credits');
                    textbox.textContent = imageinfo.attribtext;
                    slide.appendChild(textbox);
                }

                htmldiv.appendChild(slide);

                slide.querySelector('img').addEventListener('click', () => {
                    this.showSlideshowLightbox(slide);
                });
            });

            const slideshow_slides = htmldiv.querySelectorAll('.openhistoricalmap-inspector-panel-slideshow div.openhistoricalmap-inspector-panel-slideshow-slide');

            const selectSlide = (picki) => {
                slideshow_slides.forEach(($img, i) => {
                    if (i == picki) {
                        $img.classList.add('openhistoricalmap-inspector-panel-slideshow-selected');
                    }
                    else {
                        $img.classList.remove('openhistoricalmap-inspector-panel-slideshow-selected');
                    }

                    selectedslide = picki;
                });

                if (picki == 0) slideshow_prevbutton.classList.add('openhistoricalmap-inspector-panel-slideshow-hidden');
                else slideshow_prevbutton.classList.remove('openhistoricalmap-inspector-panel-slideshow-hidden');

                if (picki + 1 >= slideshow_slides.length) slideshow_nextbutton.classList.add('openhistoricalmap-inspector-panel-slideshow-hidden');
                else slideshow_nextbutton.classList.remove('openhistoricalmap-inspector-panel-slideshow-hidden');
            };

            const slideshow_prevbutton = htmldiv.querySelector('.openhistoricalmap-inspector-panel-slideshow .openhistoricalmap-inspector-panel-slideshow-prev');
            const slideshow_nextbutton = htmldiv.querySelector('.openhistoricalmap-inspector-panel-slideshow .openhistoricalmap-inspector-panel-slideshow-next');
            slideshow_prevbutton.addEventListener('click', () => {
                selectSlide(selectedslide - 1);
            });
            slideshow_nextbutton.addEventListener('click', () => {
                selectSlide(selectedslide + 1);
            });

            // select the first image
            let selectedslide = 0;
            selectSlide(selectedslide);

            this.mainpanel.appendChild(htmldiv);
        }

        // main body: then, a few hand-curated fields forming a table
        // mostly a repeated pattern: a DIV containing a strong for the field name and a span for the text value
        // but a few wrinkles such as resolving URL-shaped data (and a few not-so-URL-shaped) into hyperlinks
        const startdate = this.getTagValue(xmldoc, 'start_date');
        const enddate = this.getTagValue(xmldoc, 'end_date');
        const wikipedialink = this.getTagValue(xmldoc, 'wikipedia');
        const followedby = this.getTagValue(xmldoc, 'followed_by');
        if (this.options.debug) console.debug([`renderFeatureDetails(type, id) start/end date:`, startdate, enddate ]);

        if (startdate && startdate != '-1000000-01-01') {
            const htmldiv = document.createElement('DIV');
            htmldiv.classList.add('openhistoricalmap-inspector-panel-paragraph');

            const b = document.createElement('STRONG');
            b.textContent = 'Start Date: ';
            htmldiv.appendChild(b);

            const t = document.createElement('SPAN');
            t.textContent = startdate;
            htmldiv.appendChild(t);

            this.mainpanel.appendChild(htmldiv);
        }
        if (enddate && enddate != '1000000-01-01') {
            const htmldiv = document.createElement('DIV');
            htmldiv.classList.add('openhistoricalmap-inspector-panel-paragraph');

            const b = document.createElement('STRONG');
            b.textContent = 'End Date: ';
            htmldiv.appendChild(b);

            const t = document.createElement('SPAN');
            t.textContent = startdate;
            htmldiv.appendChild(t);

            this.mainpanel.appendChild(htmldiv);
        }
        if (wikipedialink) {
            const htmldiv = document.createElement('DIV');
            htmldiv.classList.add('openhistoricalmap-inspector-panel-paragraph');

            const b = document.createElement('STRONG');
            b.textContent = 'Wikipedia: ';
            htmldiv.appendChild(b);

            // pay attention, this gets weird: we need to use XHR to pull an excerpt from Wikipedia, which we will place into this line item
            // but of course we don't want to "lose our place" by waiting a second or three to resume writing out these line items...
            // place the line item now, with a target SPAN for the excerpt once we have it, and continue with the hyperlink and on to the next line item
            const wtext = document.createElement('SPAN');
            htmldiv.appendChild(wtext);
            this.getWikipediaExcerpt(wikipedialink, (excerpt) => {
                wtext.textContent = excerpt;
            });

            htmldiv.appendChild(document.createTextNode( '\u00A0'));  // space

            // the hyperlink provided may be a URL and thus a simple hyperlink, or a xx:Something Wikipedia key
            // https://wiki.openstreetmap.org/wiki/Key:wikipedia
            const wlink = document.createElement('A');
            wlink.textContent = '(link)';
            wlink.target = '_blank';
            wlink.rel = 'nofollow';
            wlink.href = this.convertWikipediaLink(wikipedialink);
            htmldiv.appendChild(wlink);

            this.mainpanel.appendChild(htmldiv);
        }
        if (followedby) {
            const source = this.getTagValue(xmldoc, 'followed_by:source');

            if (source && source.match(/^http/i)) {  // if source is a link, then this whole source readout is a hyperlink to that source
                const htmldiv = document.createElement('DIV');
                htmldiv.classList.add('openhistoricalmap-inspector-panel-paragraph');

                const b = document.createElement('STRONG');
                b.textContent = 'Followed By: ';
                htmldiv.appendChild(b);

                const a = document.createElement('A');
                a.href = source;
                a.target = '_blank';
                a.rel = 'nofollow';
                a.textContent = followedby;
                htmldiv.appendChild(a);

                this.mainpanel.appendChild(htmldiv);
            }
            else {  // not a single-term hyperlink, so show the followed-by text and the source text
                const htmldiv = document.createElement('DIV');
                htmldiv.classList.add('openhistoricalmap-inspector-panel-paragraph');

                const b = document.createElement('STRONG');
                b.textContent = 'Followed By: ';
                htmldiv.appendChild(b);

                const t = document.createElement('SPAN');
                t.textContent = followedby;
                htmldiv.appendChild(t);

                this.mainpanel.appendChild(htmldiv);

                if (source) {
                    const s = document.createElement('SPAN');
                    s.textContent = `. Source: ${source}`;
                    htmldiv.appendChild(s);
                }
            }
        }
    }

    getTagValue (xmldoc, tagname) {
        const tags = xmldoc.getElementsByTagName('tag');
        for (var i = 0; i < tags.length; i++) {
            const keyword = tags[i].getAttribute('k');
            const value = tags[i].getAttribute('v');
            if (keyword == tagname) return value;
        }
        return undefined;
    }

    showClassicPanel () {
        // the pre-existinginspector output is in document.querySelector(classicDivSelector)
        // goal here is to hide our own DIV and show that one
        this.oldpanel.style.display = 'block';
        this.oldfooter.style.display = 'block';
        this.mainpanel.style.display = 'none';

        this.footer_classicviewbutton.style.display = 'none';
        this.footer_inspectorviewbutton.style.display = 'inline';
    }

    hideClassicPanel () {
        // the pre-existinginspector output is in document.querySelector(classicDivSelector)
        // goal here is to hide that DIV and show our own
        this.oldpanel.style.display = 'none';
        this.oldfooter.style.display = 'none';
        this.mainpanel.style.display = 'block';

        this.footer_classicviewbutton.style.display = 'inline';
        this.footer_inspectorviewbutton.style.display = 'none';
    }

    showSlideshowLightbox (slide) {
        const imgsrc = slide.querySelector('img').src;
        const captiontext = slide.querySelector('.openhistoricalmap-inspector-panel-slideshow-caption').textContent;
        const attribtext = slide.querySelector('.openhistoricalmap-inspector-panel-slideshow-credits').textContent;

        this.slideshowmodal_image.src = imgsrc;
        this.slideshowmodal_captionbox.textContent = captiontext;
        this.slideshowmodal_creditsbox.textContent = attribtext;

        this.slideshowmodal.classList.add('openhistoricalmap-inspector-slideshowmodal-open');
    }

    parseWikipediaLink (url) {
        // parse out both plain hyperlinks to a Wikipedia site, and Wikipedia OSM references
        // hand back a standardized structure for use with Wikipedia: links, excerpt queries, other language-websites, ...
        const isplainlink = url.match(/^https?:\/\/(\w\w)\.wikipedia\.org\/wiki\/(\w+)#?(.*)$/i);
        const iswikikey = url.match(/(\w\w):(\w+)#?(.*)$/);

        let lang, name, hash;
        if (isplainlink) {
            lang = isplainlink[1];
            name = isplainlink[2];
            hash = isplainlink[3];
        }
        else if (iswikikey) {
            lang = iswikikey[1];
            name = iswikikey[2];
            hash = iswikikey[3];
        }
        else return undefined;

        return {
            lang,
            name,
            hash,
        };
    }

    getWikipediaExcerpt (url, callbackfunction) {
        const wurlbits = this.parseWikipediaLink(url);
        const wikiurl = `https://${wurlbits.lang}.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=2&exlimit=1&format=xml&explaintext=true&exintro=true&origin=*&titles=${encodeURIComponent(wurlbits.name)}`;

        const request = new XMLHttpRequest();
        request.open('GET', wikiurl);
        request.onload = () => {
            const xmldoc = new DOMParser().parseFromString(request.response, "text/xml");
            let excerpt = xmldoc.getElementsByTagName('extract')[0].textContent;
            excerpt = excerpt.replace(/\(\s*\(\s*listen\s*\)\s*\)/, '');

            callbackfunction(excerpt);
        };
        request.send();
    }

    convertWikipediaLink (url) {
        const wurlbits = this.parseWikipediaLink(url);

        let wurl = `https://${wurlbits.lang}.wikipedia.org/wiki/${wurlbits.name}`;
        if (wurlbits.hash) wurl += `#${wurlbits.hash}`;

        return wurl;
    }
}
