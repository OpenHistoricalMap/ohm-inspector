const SimpleLightbox = require('./etc/simpleLightbox-2.1.0/dist/simpleLightbox.js');  // eslint-disable-line
require('./etc/simpleLightbox-2.1.0/dist/simpleLightbox.css');  // eslint-disable-line


export class OpenHistoricaMapInspector {
    constructor (options) {
        // step 1: load default options, merging their passed-in without these defaults
        this.options = Object.assign({
            apiBaseUrl: "https://openhistoricalmap.org/api/",                   // the API URL and version to use
            apiVersion: "0.6",
            onFeatureLoaded: function () {},                                    // give the caller more power, by passing them a copy of features that we load
            onFeatureFail: function () {},                                      // let the caller do something when selectFeature() fails, e.g. feature not found
            debug: false,                                                       // debugging output, mostly useful to developers of this utility
        }, options);
        if (this.options.debug) console.debug([ 'OpenHistoricaMapInspector loaded options', this.options ]);

        // step 2: sanity checks on those options, and/or defining other settings which derive frm those options
        // none at this time

        // step 3: create our own DIV in the sidebar and insert it into the DOM next to the classic OSM inspector panel
        // we won't actually have anything to show until selectFeature() is called
        this.classictitlebar = document.querySelector('#sidebar_content > h2');                 // title H2 of the OSM inspector
        this.classicpanel = document.querySelector('#sidebar_content div.browse-section');      // classic OSM inspector output
        this.classicfooter = document.querySelector('#sidebar_content div.secondary-actions');  // secondary actions footer, Download XML and View History

        this.mainpanel = document.createElement('DIV');
        this.mainpanel.classList.add('openhistoricalmap-inspector-panel');

        this.classictitlebar.parentNode.insertBefore(this.mainpanel, this.classictitlebar.nextSibling);
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
            if (this.options.debug) {
                this.addTestDataFieldsForDemonstration(xmldoc);
            }

            this.renderFeatureDetails(type, id, xmldoc);
            this.options.onFeatureLoaded.call(this, type, id, xmldoc);
        };
        const notfound = () => {
            this.options.onFeatureFail.call(this, type, id);
        };
        const failure = () => {
            this.renderNetworkError();
            this.options.onFeatureFail.call(this, type, id);
        };
        this.fetchXmlData(url, success, notfound, failure);
    }

    renderNetworkError () {
        // this.classictitlebar.innerHTML = 'Error';
        this.mainpanel.innerHTML = "<p>Unable to contact the OHM server for additional inspector details. Please try again later.</p>";
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
        // console.debug([ 'renderFeatureDetails', type, id, xmldoc, this.mainpanel ]);

        // top: slideshow formed from any image:X tags
        // start by collecting any image:x tag sets we find
        const slideshowimages = [];
        for (var imagei=1; imagei<=99; imagei++) {
            const imageurl = this.getTagValue(xmldoc, `image:${imagei}`);
            const captiontext = this.getTagValue(xmldoc, `image:${imagei}:caption`);
            const imagedate = this.getTagValue(xmldoc, `image:${imagei}:date`);
            const sourcetext = this.getTagValue(xmldoc, `image:${imagei}:source`);
            const licensetext = this.getTagValue(xmldoc, `image:${imagei}:license`);
            if (!imageurl) break;

            slideshowimages.push({
                imageurl,
                captiontext,
                imagedate,
                sourcetext,
                licensetext,
            });
        }
        if (this.options.debug) console.debug([`renderFeatureDetails(type, id) images:` , slideshowimages]);

        if (slideshowimages.length) {
            const htmldiv = document.createElement('DIV');
            htmldiv.classList.add('openhistoricalmap-inspector-panel-slideshow');

            htmldiv.innerHTML = `
                <a class="openhistoricalmap-inspector-panel-slideshow-prevnext openhistoricalmap-inspector-panel-slideshow-prev" href="javascript:void(0);"><span></span></a>
                <a class="openhistoricalmap-inspector-panel-slideshow-prevnext openhistoricalmap-inspector-panel-slideshow-next" href="javascript:void(0);"><span></span></a>
            `;
            slideshowimages.forEach((imageinfo, imagei) => {
                // create the slide: a DIV containing a A and IMG
                const slide = document.createElement('DIV');
                slide.classList.add('openhistoricalmap-inspector-panel-slideshow-slide');
                slide.setAttribute('data-slide-number', imagei);
                slide.innerHTML = `<a href="${imageinfo.imageurl}" target="_blank"><img src="${imageinfo.imageurl}" title="${imageinfo.captiontext}" /></a>`;

                // append a caption; a mix of caption text, attribution, etc. including an explicit link to the photo in case they don't think to click
                if (imageinfo.captiontext || imageinfo.imagedate || imageinfo.sourcetext || imageinfo.licensetext) {
                    const captionbox = document.createElement('SPAN');
                    captionbox.classList.add('openhistoricalmap-inspector-panel-slideshow-caption');

                    if (imageinfo.captiontext) {
                        const cs = document.createElement('SPAN');
                        cs.innerText = imageinfo.captiontext;
                        captionbox.appendChild(cs);
                    }

                    if (imageinfo.imagedate || imageinfo.sourcetext || imageinfo.licensetext || imageinfo.imageurl) {
                        const inparens = document.createElement('SPAN');
                        inparens.appendChild(document.createTextNode('('));

                        const phrases = [];
                        if (imageinfo.imagedate) {
                            const c = document.createElement('SPAN');
                            c.innerText = imageinfo.imagedate.substr(0, 4);
                            phrases.push(c);
                        }
                        if (imageinfo.sourcetext) {
                            const c = document.createElement('SPAN');
                            c.innerText = imageinfo.sourcetext;
                            phrases.push(c);
                        }
                        if (imageinfo.licensetext) {
                            const c = document.createElement('SPAN');
                            c.innerText = imageinfo.licensetext;
                            phrases.push(c);
                        }
                        if (imageinfo.imageurl) {
                            const c = document.createElement('A');
                            c.textContent = 'link';
                            c.target = '_blank';
                            c.rel = 'nofollow';
                            c.href = imageinfo.imageurl;
                            phrases.push(c);
                        }
                        for (var i=0, l=phrases.length; i<l; i++) {
                            inparens.appendChild(phrases[i]);
                            if (i < l - 1) inparens.appendChild(document.createTextNode(', '));
                        }

                        inparens.appendChild(document.createTextNode(')'));
                        captionbox.appendChild(inparens);
                    }

                    slide.appendChild(captionbox);
                }

                htmldiv.appendChild(slide);
            });

            const slideshow_slides = htmldiv.querySelectorAll('.openhistoricalmap-inspector-panel-slideshow div.openhistoricalmap-inspector-panel-slideshow-slide');

            const selectSlide = (picki) => {
                slideshow_slides.forEach(($img, i) => {
                    if (i == picki) {
                        $img.classList.remove('openhistoricalmap-inspector-panel-slideshow-hidden');
                    }
                    else {
                        $img.classList.add('openhistoricalmap-inspector-panel-slideshow-hidden');
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

            // done with setup; stick it into the DOM
            this.mainpanel.appendChild(htmldiv);

            // add the SimpleLightbox behavior to the slideshow images
            // have to attach captions ourselves first, since it looks for title= or data-caption= on the A not a IMG under it
            const slideshowimagelinks = htmldiv.querySelectorAll('div.openhistoricalmap-inspector-panel-slideshow-slide > a');
            slideshowimagelinks.forEach(function (a) {
                const img = a.querySelector('img');
                const caption = img.title || '';
                a.setAttribute('title', caption);
            });
            new SimpleLightbox({
                elements: slideshowimagelinks,
            });

            // select the first image
            let selectedslide = 0;
            selectSlide(selectedslide);
        }

        // main body: a few hand-curated fields forming a table
        // start by collecting & standardizing fields & formats

        const name = this.getTagValue(xmldoc, 'name');

        const link_wikipedia = this.findWikipediaLink(xmldoc);
        const link_libcongress = this.getTagValue(xmldoc, 'ref:LoC');

        const followedby_text = this.getTagValue(xmldoc, 'followed_by:name');
        const followedby_link = this.getTagValue(xmldoc, 'followed_by');
        const followedby_source_text = this.getTagValue(xmldoc, 'followed_by:source:name');
        const followedby_source_link = this.getTagValue(xmldoc, 'followed_by:source');

        let startdate_year = this.getTagValue(xmldoc, 'start_date');  // extract just a year, but -1000000 is "infinite"
        if (startdate_year && startdate_year.indexOf('-1000000') === 0) startdate_year = undefined;
        if (startdate_year) {  // split to just the year, but heed - at the start for BCE dates
            startdate_year = startdate_year.substr(0, 1) === '-' ? startdate_year.split('-')[1] : startdate_year.split('-')[0];
        }
        const startdate_source_link = this.getTagValue(xmldoc, 'start_date:source');
        const startdate_source_text = this.getTagValue(xmldoc, 'start_date:source:name');

        let enddate_year = this.getTagValue(xmldoc, 'end_date');  // extract just a year, but 1000000 is "infinite"
        if (enddate_year && enddate_year.indexOf('1000000') === 0) enddate_year = undefined;
        if (enddate_year) {  // split to just the year, but heed - at the start for BCE dates
            enddate_year = enddate_year.substr(0, 1) === '-' ? enddate_year.split('-')[1] : enddate_year.split('-')[0];
        }
        const enddate_source_link = this.getTagValue(xmldoc, 'end_date:source');
        const enddate_source_text = this.getTagValue(xmldoc, 'end_date:source:name');

        // title: the name tag
        if (name) {
            const htmldiv = document.createElement('DIV');
            htmldiv.classList.add('openhistoricalmap-inspector-panel-paragraph');
            htmldiv.classList.add('openhistoricalmap-inspector-panel-strong');
            htmldiv.textContent = name;
            this.mainpanel.appendChild(htmldiv);
        }

        // start and end dates, potentially with source links
        // either/both may/mayn't be present, so compose the two and display whatever ones we came up with
        if (startdate_year || enddate_year) {
            const htmldiv = document.createElement('DIV');
            htmldiv.classList.add('openhistoricalmap-inspector-panel-paragraph');

            let startspan;
            if (startdate_year) {
                startspan = document.createElement('SPAN');
                startspan.appendChild(document.createTextNode(startdate_year));

                if (startdate_source_text) {
                    const f = document.createElement('SPAN');
                    f.classList.add('openhistoricalmap-inspector-panel-small');
                    const thetext = ` [Source: ${startdate_source_text}]`;

                    if (startdate_source_link) {
                        const fl = document.createElement('A');
                        fl.textContent = thetext;
                        fl.target = '_blank';
                        fl.rel = 'nofollow';
                        fl.href = startdate_source_link;
                        f.appendChild(fl);
                    }
                    else {
                        f.innerText = thetext;
                    }

                    startspan.appendChild(f);
                }
            }

            let endspan;
            if (enddate_year) {
                endspan = document.createElement('SPAN');
                endspan.appendChild(document.createTextNode(enddate_year));

                if (enddate_source_text) {
                    const f = document.createElement('SPAN');
                    f.classList.add('openhistoricalmap-inspector-panel-small');
                    const thetext = ` [Source: ${enddate_source_text}]`;

                    if (enddate_source_link) {
                        const fl = document.createElement('A');
                        fl.textContent = thetext;
                        fl.target = '_blank';
                        fl.rel = 'nofollow';
                        fl.href = enddate_source_link;
                        f.appendChild(fl);
                    }
                    else {
                        f.innerText = thetext;
                    }

                    endspan.appendChild(f);
                }
            }

            if (startspan && endspan) {
                htmldiv.appendChild(startspan);
                htmldiv.appendChild(document.createTextNode(' - '));
                htmldiv.appendChild(endspan);
            }
            else if (startspan) {
                htmldiv.appendChild(document.createTextNode('Starting '));
                htmldiv.appendChild(startspan);
            }
            else if (endspan) {
                htmldiv.appendChild(document.createTextNode('Until '));
                htmldiv.appendChild(endspan);
            }

            this.mainpanel.appendChild(htmldiv);
        }

        // description: an excerpt from Wikipedia, if possible
        // create the SPAN then async-load from Wikipedia... or not
        if (link_wikipedia) {
            const htmldiv = document.createElement('DIV');
            htmldiv.classList.add('openhistoricalmap-inspector-panel-paragraph');

            const wtext = document.createElement('SPAN');
            htmldiv.appendChild(wtext);
            this.getWikipediaExcerpt(link_wikipedia, (excerpt) => {
                wtext.textContent = excerpt;
            });

            this.mainpanel.appendChild(htmldiv);
        }

        // followed by: what came after this feature at the same place?
        if (followedby_text) {
            const htmldiv = document.createElement('DIV');
            htmldiv.classList.add('openhistoricalmap-inspector-panel-paragraph');

            const b = document.createElement('SPAN');
            b.textContent = 'Followed By: ';
            htmldiv.appendChild(b);

            // followedby may be a link or just plain text, depending on whether URL was given too
            const f = document.createElement('SPAN');
            const thetext = followedby_text;

            if (followedby_link) {
                const fl = document.createElement('A');
                fl.textContent = thetext;
                fl.target = '_blank';
                fl.rel = 'nofollow';
                fl.href = followedby_link;
                f.appendChild(fl);
            }
            else {
                f.textContent = thetext;
            }

            htmldiv.appendChild(f);

            // source may be a link or just plain text, depending on whether URL was given too
            if (followedby_source_text) {
                const f = document.createElement('SPAN');
                f.classList.add('openhistoricalmap-inspector-panel-small');
                const thetext = ` [Source: ${followedby_source_text}]`;

                if (followedby_source_link) {
                    const fl = document.createElement('A');
                    fl.textContent = thetext;
                    fl.target = '_blank';
                    fl.rel = 'nofollow';
                    fl.href = followedby_source_link;
                    f.appendChild(fl);
                }
                else {
                    f.textContent = thetext;
                }

                htmldiv.appendChild(f);
            }
            else if (followedby_source_text) {
                const f = document.createElement('SPAN');
                f.classList.add('openhistoricalmap-inspector-panel-small');
                f.textContent = ` [Source: ${followedby_source_text}]`;
                htmldiv.appendChild(f);
            }

            this.mainpanel.appendChild(htmldiv);
        }

        // more info: zero-or-more more_info:x sets
        // start by collecting any more_info:x tag sets we find
        const moreinfolinks = [];
        for (var moreinfoi=1; moreinfoi<=99; moreinfoi++) {
            const linkurl = this.getTagValue(xmldoc, `more_info:${moreinfoi}`);
            const linktext = this.getTagValue(xmldoc, `more_info:${moreinfoi}:name`) || '(link)';
            if (!linkurl) break;

            moreinfolinks.push({
                linkurl,
                linktext,
            });
        }
        if (this.options.debug) console.debug([`renderFeatureDetails(type, id) moreinfo:` , moreinfolinks]);

        if (moreinfolinks.length) {
            const htmldiv = document.createElement('DIV');
            htmldiv.classList.add('openhistoricalmap-inspector-panel-paragraph');
            htmldiv.classList.add('openhistoricalmap-inspector-panel-moreinfo');

            const b = document.createElement('SPAN');
            b.textContent = 'More info: ';
            htmldiv.appendChild(b);

            const listing = document.createElement('UL');
            moreinfolinks.forEach(function (milink) {
                const li = document.createElement('LI');
                const a = document.createElement('A');
                a.textContent = milink.linktext;
                a.href = milink.linkurl;
                a.target = '_blank';
                a.rel = 'nofollow';
                li.appendChild(a);
                listing.appendChild(li);
            });
            htmldiv.appendChild(listing);

            this.mainpanel.appendChild(htmldiv);
        }

        // bottom links, single-word links, one line, with spacers
        if (link_wikipedia) {
            const htmldiv = document.createElement('DIV');
            htmldiv.classList.add('openhistoricalmap-inspector-panel-paragraph');

            const links = [];

            if (link_wikipedia) {
                const link = document.createElement('A');
                link.textContent = 'Wikipedia';
                link.target = '_blank';
                link.rel = 'nofollow';
                link.href = link_wikipedia;
                links.push(link);
            }
            if (link_libcongress) {
                const link = document.createElement('A');
                link.textContent = 'US LoC';
                link.target = '_blank';
                link.rel = 'nofollow';
                link.href = link_libcongress;
                links.push(link);
            }

            for (var i=0, l=links.length; i<l; i++) {
                htmldiv.appendChild(links[i]);
                if (i < l - 1) htmldiv.appendChild(document.createTextNode(' | '));  // separator, unless last one
            }

            this.mainpanel.appendChild(htmldiv);
        }

        // bottom: finish with a HR to visually separate the two inspectors' content
        const endhr = document.createElement('HR');
        this.mainpanel.appendChild(endhr);
    }

    getTagValue (xmldoc, tagname) {
        // fetch a <tag> element with the given k, returns its v
        const tags = xmldoc.getElementsByTagName('tag');
        for (var i = 0; i < tags.length; i++) {
            const keyword = tags[i].getAttribute('k');
            const value = tags[i].getAttribute('v');
            if (keyword == tagname) return value;
        }
        return undefined;
    }

    setTagValue (xmldoc, tagname, tagvalue) {
        // this sets a <tag> element so we can set fields that are missing/blank
        // for experimental debugging with new tags that aren't in fact in the OHM/OSM data
        // see also addTestDataFieldsForDemonstration()

        // find & delete any pre-existing tag with this k
        const tags = xmldoc.getElementsByTagName('tag');
        for (var i = tags.length - 1; i >= 0; i--) {
            const tag = tags[i];
            const keyword = tag.getAttribute('k');
            if (keyword == tagname) tag.parentNode.removeChild(tag);
        }

        // add the new one
        const xmlroot = xmldoc.getElementsByTagName('osm')[0];
        const newtag = xmldoc.createElement('tag');
        newtag.setAttribute('k', tagname);
        newtag.setAttribute('v', tagvalue);
        xmlroot.appendChild(newtag);
    }

    findWikipediaLink (xmldoc) {
        // try to find a Wikipedia link, hand back XXX
        // folks should use "wikipedia" as the key name, and supply either a complete URL or else a Wikipedia tag with language e.g. "en:Seattle Washington"
        // but in the wild we're seeing "wikipedia:en" et al where a language is implied by the tag, not the value
        // find whatever we can and return it, prefixing it with the implied language if any
        let link, lang;
        const tags = xmldoc.getElementsByTagName('tag');
        for (var i = 0; i < tags.length; i++) {
            const keyword = tags[i].getAttribute('k');
            if (keyword == 'wikipedia') {
                lang = 'en';
                link = tags[i].getAttribute('v');
                break;
            }
            else if (keyword.match(/^wikipedia:[a-zA-Z][a-zA-Z]$/)) {
                lang = keyword.substr(-2).toLowerCase();
                link = tags[i].getAttribute('v');
                break;
            }
        }

        if (link.toLowerCase().indexOf('http') === 0) {
            return link;  // aready a fully-qualified URL, presumably to Wikipedia
        }
        else if (link && lang) {
            return `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(link)}`;  // compose a fully-qualified URL to Wikipedia
        }

        return undefined;
    }

    parseWikipediaLink (url) {
        // parse out both plain hyperlinks to a Wikipedia site, and Wikipedia OSM references
        // hand back a standardized structure for use with Wikipedia: links, excerpt queries, other language-websites, ...
        const decurl = decodeURIComponent(url);
        const isplainlink = decurl.match(/^https?:\/\/(\w\w)\.wikipedia\.org\/wiki\/([^#]+)#?(.*)$/i);
        const iswikikey = decurl.match(/(\w\w):(\w+)#?(.*)$/);

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

    addTestDataFieldsForDemonstration (xmldoc) {  // eslint-disable-line no-unused-vars
        // a hack to add missing data fields into the XML document,
        // so we can test the panel with new tags, without needing features to have these new tags
        // outside of active development, this should be commented out but test for localhost as a failsafe
        if (document.location.hostname !== 'localhost') return;
        /*
        console.error('Warning: XML feature info will be passed through addTestDataFieldsForDemonstration() to falsify some data for display into the panel.');

        this.setTagValue(xmldoc, 'image:1:source', "Seattle Library");

        this.setTagValue(xmldoc, 'wikipedia:en', "Hotel_Seattle");

        this.setTagValue(xmldoc, 'followed_by:name', "Eternal Void");
        this.setTagValue(xmldoc, 'followed_by', "https://www.google.com/");
        this.setTagValue(xmldoc, 'followed_by:source:name', "Wackypedio");
        this.setTagValue(xmldoc, 'followed_by:source', "https://www.example.com/");

        this.setTagValue(xmldoc, 'start_date:source', "https://www.google.com/");
        this.setTagValue(xmldoc, 'start_date:source:name', "Bob Smith, Historian");

        this.setTagValue(xmldoc, 'end_date:source', "https://wikipedia.com/");
        this.setTagValue(xmldoc, 'end_date:source:name', "Wikipedia");

        this.setTagValue(xmldoc, 'more_info:1', "https://www.google.com/search?q=occidental+hotel+seattle");
        this.setTagValue(xmldoc, 'more_info:1:name', "Search Google");
        this.setTagValue(xmldoc, 'more_info:2', "https://www.bing.com/search?q=occidental+hotel+seattle");
        this.setTagValue(xmldoc, 'more_info:2:name', "Search Bing");
        */
    }
}
