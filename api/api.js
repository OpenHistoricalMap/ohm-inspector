var openhistoricalmap=function(e){var t={};function n(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(i,o,function(t){return e[t]}.bind(null,o));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/api/",n(n.s=0)}([function(e,t,n){"use strict";n.r(t),n(1),n(2),n(3);var i=n(4);t.default=i},function(e,t){var n,i,o,a;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest||(Element.prototype.closest=function(e){var t=this;if(!document.documentElement.contains(t))return null;do{if(t.matches(e))return t;t=t.parentElement||t.parentNode}while(null!==t&&1===t.nodeType);return null}),"function"!=typeof Object.assign&&Object.defineProperty(Object,"assign",{value:function(e){"use strict";if(null==e)throw new TypeError("Cannot convert undefined or null to object");for(var t=Object(e),n=1;n<arguments.length;n++){var i=arguments[n];if(null!=i)for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(t[o]=i[o])}return t},writable:!0,configurable:!0}),Array.prototype.forEach||(Array.prototype.forEach=function(e){var t,n;if(null==this)throw new TypeError("this is null or not defined");var i=Object(this),o=i.length>>>0;if("function"!=typeof e)throw new TypeError(e+" is not a function");for(arguments.length>1&&(t=arguments[1]),n=0;n<o;){var a;n in i&&(a=i[n],e.call(t,a,n,i)),n++}}),window.NodeList&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=Array.prototype.forEach),Array.from||(Array.from=(n=Object.prototype.toString,i=function(e){return"function"==typeof e||"[object Function]"===n.call(e)},o=Math.pow(2,53)-1,a=function(e){var t=function(e){var t=Number(e);return isNaN(t)?0:0!==t&&isFinite(t)?(t>0?1:-1)*Math.floor(Math.abs(t)):t}(e);return Math.min(Math.max(t,0),o)},function(e){var t=this,n=Object(e);if(null==e)throw new TypeError("Array.from requires an array-like object - not null or undefined");var o,r=arguments.length>1?arguments[1]:void 0;if(void 0!==r){if(!i(r))throw new TypeError("Array.from: when provided, the second argument must be a function");arguments.length>2&&(o=arguments[2])}for(var s,l=a(n.length),c=i(t)?Object(new t(l)):new Array(l),p=0;p<l;)s=n[p],c[p]=r?void 0===o?r(s,p):r.call(o,s,p):s,p+=1;return c.length=l,c}))},function(e,t){},function(e,t,n){},function(e,t,n){"use strict";function i(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}n.r(t),n.d(t,"OpenHistoricaMapInspector",(function(){return a}));var o=n(5);n(6);var a=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.options=Object.assign({apiBaseUrl:"https://openhistoricalmap.org/api/",apiVersion:"0.6",onFeatureLoaded:function(){},onFeatureFail:function(){},debug:!1},t),this.options.debug&&console.debug(["OpenHistoricaMapInspector loaded options",this.options]),this.classictitlebar=document.querySelector("#sidebar_content > h2"),this.classicpanel=document.querySelector("#sidebar_content div.browse-section"),this.classicfooter=document.querySelector("#sidebar_content div.secondary-actions"),this.mainpanel=document.createElement("DIV"),this.mainpanel.classList.add("openhistoricalmap-inspector-panel"),this.classictitlebar.parentNode.insertBefore(this.mainpanel,this.classictitlebar.nextSibling)}var t,n,a;return t=e,(n=[{key:"selectFeatureFromUrl",value:function(){var e=document.location.href.match(/\/(way|node|relation)\/(\d+)/);if(!e)return console.debug("selectFeatureFromUrl() page address does not look like a OSM /type/id URL");var t=e[1],n=e[2];this.options.debug&&console.debug("selectFeatureFromUrl found ".concat(t," ").concat(n)),this.selectFeature(t,n)}},{key:"selectFeature",value:function(e,t){var n=this,i="".concat(this.options.apiBaseUrl,"/").concat(this.options.apiVersion,"/").concat(e,"/").concat(t);this.options.debug&&console.debug("OpenHistoricaMapInspector selectFeature(".concat(e,", ").concat(t,") => ").concat(i)),this.fetchXmlData(i,(function(i){n.options.debug&&n.addTestDataFieldsForDemonstration(i),n.renderFeatureDetails(e,t,i),n.options.onFeatureLoaded.call(n,e,t,i)}),(function(){n.options.onFeatureFail.call(n,e,t)}),(function(){n.renderNetworkError(),n.options.onFeatureFail.call(n,e,t)}))}},{key:"renderNetworkError",value:function(){this.mainpanel.innerHTML="<p>Unable to contact the OHM server for additional inspector details. Please try again later.</p>"}},{key:"fetchXmlData",value:function(e,t,n,i){var o=new XMLHttpRequest;o.open("GET",e),o.onload=function(){if(404==o.status)return n();var e=(new DOMParser).parseFromString(o.response,"text/xml");t(e)},o.onerror=function(){i()},o.send()}},{key:"renderFeatureDetails",value:function(e,t,n){for(var i=[],a=1;a<=99;a++){var r=this.getTagValue(n,"image:".concat(a),"url"),s=this.getTagValue(n,"image:".concat(a,":caption")),l=this.getTagValue(n,"image:".concat(a,":date")),c=this.getTagValue(n,"image:".concat(a,":source")),p=this.getTagValue(n,"image:".concat(a,":license"));if(!r)break;i.push({imageurl:r,captiontext:s,imagedate:l,sourcetext:c,licensetext:p})}if(this.options.debug&&console.debug(["renderFeatureDetails(type, id) images:",i]),i.length){var d=document.createElement("DIV");d.classList.add("openhistoricalmap-inspector-panel-slideshow"),d.innerHTML='\n                <a class="openhistoricalmap-inspector-panel-slideshow-prevnext openhistoricalmap-inspector-panel-slideshow-prev" href="javascript:void(0);"><span></span></a>\n                <a class="openhistoricalmap-inspector-panel-slideshow-prevnext openhistoricalmap-inspector-panel-slideshow-next" href="javascript:void(0);"><span></span></a>\n            ',i.forEach((function(e,t){var n=document.createElement("DIV");if(n.classList.add("openhistoricalmap-inspector-panel-slideshow-slide"),n.setAttribute("data-slide-number",t),n.innerHTML='<a href="'.concat(e.imageurl,'" target="_blank"><img src="').concat(e.imageurl,'" title="').concat(e.captiontext,'" /></a>'),e.captiontext||e.imagedate||e.sourcetext||e.licensetext){var i=document.createElement("SPAN");if(i.classList.add("openhistoricalmap-inspector-panel-slideshow-caption"),e.captiontext){var o=document.createElement("SPAN");o.innerText=e.captiontext,i.appendChild(o)}if(e.imagedate||e.sourcetext||e.licensetext||e.imageurl){var a=document.createElement("SPAN");a.appendChild(document.createTextNode("("));var r=[];if(e.imagedate){var s=document.createElement("SPAN");s.innerText=e.imagedate.substr(0,4),r.push(s)}if(e.sourcetext){var l=document.createElement("SPAN");l.innerText=e.sourcetext,r.push(l)}if(e.licensetext){var c=document.createElement("SPAN");c.innerText=e.licensetext,r.push(c)}if(e.imageurl){var p=document.createElement("A");p.textContent="link",p.target="_blank",p.rel="nofollow",p.href=e.imageurl,r.push(p)}for(var u=0,h=r.length;u<h;u++)a.appendChild(r[u]),u<h-1&&a.appendChild(document.createTextNode(", "));a.appendChild(document.createTextNode(")")),i.appendChild(a)}n.appendChild(i)}d.appendChild(n)}));var u=d.querySelectorAll(".openhistoricalmap-inspector-panel-slideshow div.openhistoricalmap-inspector-panel-slideshow-slide"),h=function(e){u.forEach((function(t,n){n==e?t.classList.remove("openhistoricalmap-inspector-panel-slideshow-hidden"):t.classList.add("openhistoricalmap-inspector-panel-slideshow-hidden"),v=e})),0==e?m.classList.add("openhistoricalmap-inspector-panel-slideshow-hidden"):m.classList.remove("openhistoricalmap-inspector-panel-slideshow-hidden"),e+1>=u.length?f.classList.add("openhistoricalmap-inspector-panel-slideshow-hidden"):f.classList.remove("openhistoricalmap-inspector-panel-slideshow-hidden")},m=d.querySelector(".openhistoricalmap-inspector-panel-slideshow .openhistoricalmap-inspector-panel-slideshow-prev"),f=d.querySelector(".openhistoricalmap-inspector-panel-slideshow .openhistoricalmap-inspector-panel-slideshow-next");m.addEventListener("click",(function(){h(v-1)})),f.addEventListener("click",(function(){h(v+1)})),this.mainpanel.appendChild(d);var g=d.querySelectorAll("div.openhistoricalmap-inspector-panel-slideshow-slide > a");g.forEach((function(e){var t=e.querySelector("img").title||"";e.setAttribute("title",t)})),new o({elements:g});var v=0;h(v)}var b=this.getTagValue(n,"name"),C=this.findWikipediaLink(n),y=this.findWikidataLink(n),w=this.getTagValue(n,"ref:LoC","url"),x=this.getTagValue(n,"followed_by:name"),E=this.getTagValue(n,"followed_by","url"),k=this.getTagValue(n,"followed_by:source:name"),T=this.getTagValue(n,"followed_by:source","url"),L=this.getTagValue(n,"start_date");L&&0===L.indexOf("-1000000")&&(L=void 0),L&&(L="-"===L.substr(0,1)?L.split("-")[1]:L.split("-")[0]);var A=this.getTagValue(n,"start_date:source","url"),S=this.getTagValue(n,"start_date:source:name"),N=this.getTagValue(n,"end_date");N&&0===N.indexOf("1000000")&&(N=void 0),N&&(N="-"===N.substr(0,1)?N.split("-")[1]:N.split("-")[0]);var P=this.getTagValue(n,"end_date:source","url"),I=this.getTagValue(n,"end_date:source:name");if(b){var O=document.createElement("DIV");O.classList.add("openhistoricalmap-inspector-panel-paragraph"),O.classList.add("openhistoricalmap-inspector-panel-strong"),O.textContent=b,this.mainpanel.appendChild(O)}if(L||N){var D,V,_=document.createElement("DIV");if(_.classList.add("openhistoricalmap-inspector-panel-paragraph"),L&&((D=document.createElement("SPAN")).appendChild(document.createTextNode(L)),S)){var F=document.createElement("SPAN");F.classList.add("openhistoricalmap-inspector-panel-small");var M=" [Source: ".concat(S,"]");if(A){var $=document.createElement("A");$.textContent=M,$.target="_blank",$.rel="nofollow",$.href=A,F.appendChild($)}else F.innerText=M;D.appendChild(F)}if(N&&((V=document.createElement("SPAN")).appendChild(document.createTextNode(N)),I)){var j=document.createElement("SPAN");j.classList.add("openhistoricalmap-inspector-panel-small");var B=" [Source: ".concat(I,"]");if(P){var H=document.createElement("A");H.textContent=B,H.target="_blank",H.rel="nofollow",H.href=P,j.appendChild(H)}else j.innerText=B;V.appendChild(j)}D&&V?(_.appendChild(D),_.appendChild(document.createTextNode(" - ")),_.appendChild(V)):D?(_.appendChild(document.createTextNode("Starting ")),_.appendChild(D)):V&&(_.appendChild(document.createTextNode("Until ")),_.appendChild(V)),this.mainpanel.appendChild(_)}if(C){var q=document.createElement("DIV");q.classList.add("openhistoricalmap-inspector-panel-paragraph");var R=document.createElement("SPAN");q.appendChild(R),this.getWikipediaExcerpt(C,(function(e){R.textContent=e})),this.mainpanel.appendChild(q)}if(x){var W=document.createElement("DIV");W.classList.add("openhistoricalmap-inspector-panel-paragraph");var U=document.createElement("SPAN");U.textContent="Followed By: ",W.appendChild(U);var z=document.createElement("SPAN"),X=x;if(E){var G=document.createElement("A");G.textContent=X,G.target="_blank",G.rel="nofollow",G.href=E,z.appendChild(G)}else z.textContent=X;if(W.appendChild(z),k){var J=document.createElement("SPAN");J.classList.add("openhistoricalmap-inspector-panel-small");var K=" [Source: ".concat(k,"]");if(T){var Q=document.createElement("A");Q.textContent=K,Q.target="_blank",Q.rel="nofollow",Q.href=T,J.appendChild(Q)}else J.textContent=K;W.appendChild(J)}else if(k){var Z=document.createElement("SPAN");Z.classList.add("openhistoricalmap-inspector-panel-small"),Z.textContent=" [Source: ".concat(k,"]"),W.appendChild(Z)}this.mainpanel.appendChild(W)}for(var Y=[],ee=1;ee<=99;ee++){var te=this.getTagValue(n,"more_info:".concat(ee),"url"),ne=this.getTagValue(n,"more_info:".concat(ee,":name"))||"(link)";if(!te)break;Y.push({linkurl:te,linktext:ne})}if(this.options.debug&&console.debug(["renderFeatureDetails(type, id) moreinfo:",Y]),Y.length){var ie=document.createElement("DIV");ie.classList.add("openhistoricalmap-inspector-panel-paragraph"),ie.classList.add("openhistoricalmap-inspector-panel-moreinfo");var oe=document.createElement("SPAN");oe.textContent="More info: ",ie.appendChild(oe);var ae=document.createElement("UL");Y.forEach((function(e){var t=document.createElement("LI"),n=document.createElement("A");n.textContent=e.linktext,n.href=e.linkurl,n.target="_blank",n.rel="nofollow",t.appendChild(n),ae.appendChild(t)})),ie.appendChild(ae),this.mainpanel.appendChild(ie)}if(C){var re=document.createElement("DIV");re.classList.add("openhistoricalmap-inspector-panel-paragraph");var se=[];if(C){var le=document.createElement("A");le.textContent="Wikipedia",le.target="_blank",le.rel="nofollow",le.href=C,se.push(le)}if(y){var ce=document.createElement("A");ce.textContent="Wikidata",ce.target="_blank",ce.rel="nofollow",ce.href=y,se.push(ce)}if(w){var pe=document.createElement("A");pe.textContent="US LoC",pe.target="_blank",pe.rel="nofollow",pe.href=w,se.push(pe)}for(var de=0,ue=se.length;de<ue;de++)re.appendChild(se[de]),de<ue-1&&re.appendChild(document.createTextNode(" | "));this.mainpanel.appendChild(re)}var he=document.createElement("HR");this.mainpanel.appendChild(he)}},{key:"getTagValue",value:function(e,t){for(var n,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0,o=e.getElementsByTagName("tag"),a=0;a<o.length;a++){var r=o[a].getAttribute("k"),s=o[a].getAttribute("v");if(r==t){n=s;break}}if(n&&"url"===i){var l=n.toLowerCase();l.match(/^http:/)||l.match(/^https:/)||l.match(/^ftp:/)||(n=void 0)}return n}},{key:"setTagValue",value:function(e,t,n){for(var i=e.getElementsByTagName("tag"),o=i.length-1;o>=0;o--){var a=i[o];a.getAttribute("k")==t&&a.parentNode.removeChild(a)}var r=e.getElementsByTagName("osm")[0],s=e.createElement("tag");s.setAttribute("k",t),s.setAttribute("v",n),r.appendChild(s)}},{key:"findWikipediaLink",value:function(e){for(var t,n,i=e.getElementsByTagName("tag"),o=0;o<i.length;o++){var a=i[o].getAttribute("k");if("wikipedia"==a){n="en",t=i[o].getAttribute("v");break}if(a.match(/^wikipedia:[a-zA-Z][a-zA-Z]$/)){n=a.substr(-2).toLowerCase(),t=i[o].getAttribute("v");break}}return t&&0===t.toLowerCase().indexOf("http")?t:t&&n?"https://".concat(n,".wikipedia.org/wiki/").concat(encodeURIComponent(t)):void 0}},{key:"parseWikipediaLink",value:function(e){var t,n,i,o=decodeURIComponent(e),a=o.match(/^https?:\/\/(\w\w)\.wikipedia\.org\/wiki\/([^#]+)#?(.*)$/i),r=o.match(/(\w\w):(\w+)#?(.*)$/);if(a)t=a[1],n=a[2],i=a[3];else{if(!r)return;t=r[1],n=r[2],i=r[3]}return{lang:t,name:n,hash:i}}},{key:"getWikipediaExcerpt",value:function(e,t){var n=this.parseWikipediaLink(e),i="https://".concat(n.lang,".wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=2&exlimit=1&format=xml&explaintext=true&exintro=true&origin=*&titles=").concat(encodeURIComponent(n.name)),o=new XMLHttpRequest;o.open("GET",i),o.onload=function(){var e=(new DOMParser).parseFromString(o.response,"text/xml").getElementsByTagName("extract")[0].textContent;e=e.replace(/\(\s*\(\s*listen\s*\)\s*\)/,""),t(e)},o.send()}},{key:"findWikidataLink",value:function(e){var t=this.getTagValue(e,"wikidata");if(t)return"https://www.wikidata.org/wiki/".concat(t)}},{key:"addTestDataFieldsForDemonstration",value:function(e){document.location.hostname}}])&&i(t.prototype,n),a&&i(t,a),e}()},function(e,t,n){var i,o,a;o=[],void 0===(a="function"==typeof(i=function(){function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];if(n)for(var i in n)n.hasOwnProperty(i)&&(e[i]=n[i])}return e}function t(e,t){e&&t&&(e.className+=" "+t)}function n(e,t){e&&t&&(e.className=e.className.replace(new RegExp("(\\s|^)"+t+"(\\s|$)")," ").trim())}function i(e){var t=document.createElement("div");return t.innerHTML=e.trim(),t.childNodes[0]}function o(e,t){return(e.matches||e.matchesSelector||e.msMatchesSelector).call(e,t)}function a(e){this.init.apply(this,arguments)}return a.defaults={elementClass:"",elementLoadingClass:"slbLoading",htmlClass:"slbActive",closeBtnClass:"",nextBtnClass:"",prevBtnClass:"",loadingTextClass:"",closeBtnCaption:"Close",nextBtnCaption:"Next",prevBtnCaption:"Previous",loadingCaption:"Loading...",bindToItems:!0,closeOnOverlayClick:!0,closeOnEscapeKey:!0,nextOnImageClick:!0,showCaptions:!0,captionAttribute:"title",urlAttribute:"href",startAt:0,loadingTimeout:100,appendTarget:"body",beforeSetContent:null,beforeClose:null,afterClose:null,beforeDestroy:null,afterDestroy:null,videoRegex:new RegExp(/youtube.com|vimeo.com/)},e(a.prototype,{init:function(t){t=this.options=e({},a.defaults,t);var n,i=this;t.$items&&(n=t.$items.get()),t.elements&&(n=[].slice.call("string"==typeof t.elements?document.querySelectorAll(t.elements):t.elements)),this.eventRegistry={lightbox:[],thumbnails:[]},this.items=[],this.captions=[],n&&n.forEach((function(e,n){i.items.push(e.getAttribute(t.urlAttribute)),i.captions.push(e.getAttribute(t.captionAttribute)),t.bindToItems&&i.addEvent(e,"click",(function(e){e.preventDefault(),i.showPosition(n)}),"thumbnails")})),t.items&&(this.items=t.items),t.captions&&(this.captions=t.captions)},addEvent:function(e,t,n,i){return this.eventRegistry[i||"lightbox"].push({element:e,eventName:t,callback:n}),e.addEventListener(t,n),this},removeEvents:function(e){return this.eventRegistry[e].forEach((function(e){e.element.removeEventListener(e.eventName,e.callback)})),this.eventRegistry[e]=[],this},next:function(){return this.showPosition(this.currentPosition+1)},prev:function(){return this.showPosition(this.currentPosition-1)},normalizePosition:function(e){return e>=this.items.length?e=0:e<0&&(e=this.items.length-1),e},showPosition:function(e){var t=this.normalizePosition(e);return void 0!==this.currentPosition&&(this.direction=t>this.currentPosition?"next":"prev"),this.currentPosition=t,this.setupLightboxHtml().prepareItem(this.currentPosition,this.setContent).show()},loading:function(e){var i=this,o=this.options;e?this.loadingTimeout=setTimeout((function(){t(i.$el,o.elementLoadingClass),i.$content.innerHTML='<p class="slbLoadingText '+o.loadingTextClass+'">'+o.loadingCaption+"</p>",i.show()}),o.loadingTimeout):(n(this.$el,o.elementLoadingClass),clearTimeout(this.loadingTimeout))},prepareItem:function(e,t){var n=this,o=this.items[e];if(this.loading(!0),this.options.videoRegex.test(o))t.call(n,i('<div class="slbIframeCont"><iframe class="slbIframe" frameborder="0" allowfullscreen src="'+o+'"></iframe></div>'));else{var a=i('<div class="slbImageWrap"><img class="slbImage" src="'+o+'" /></div>');this.$currentImage=a.querySelector(".slbImage"),this.options.showCaptions&&this.captions[e]&&a.appendChild(i('<div class="slbCaption">'+this.captions[e]+"</div>")),this.loadImage(o,(function(){n.setImageDimensions(),t.call(n,a),n.loadImage(n.items[n.normalizePosition(n.currentPosition+1)])}))}return this},loadImage:function(e,t){if(!this.options.videoRegex.test(e)){var n=new Image;t&&(n.onload=t),n.src=e}},setupLightboxHtml:function(){var e=this.options;return this.$el||(this.$el=i('<div class="slbElement '+e.elementClass+'"><div class="slbOverlay"></div><div class="slbWrapOuter"><div class="slbWrap"><div class="slbContentOuter"><div class="slbContent"></div><button type="button" title="'+e.closeBtnCaption+'" class="slbCloseBtn '+e.closeBtnClass+'">×</button>'+(this.items.length>1?'<div class="slbArrows"><button type="button" title="'+e.prevBtnCaption+'" class="prev slbArrow'+e.prevBtnClass+'">'+e.prevBtnCaption+'</button><button type="button" title="'+e.nextBtnCaption+'" class="next slbArrow'+e.nextBtnClass+'">'+e.nextBtnCaption+"</button></div>":"")+"</div></div></div></div>"),this.$content=this.$el.querySelector(".slbContent")),this.$content.innerHTML="",this},show:function(){return this.modalInDom||(document.querySelector(this.options.appendTarget).appendChild(this.$el),t(document.documentElement,this.options.htmlClass),this.setupLightboxEvents(),this.modalInDom=!0),this},setContent:function(e){var o="string"==typeof e?i(e):e;return this.loading(!1),this.setupLightboxHtml(),n(this.$content,"slbDirectionNext"),n(this.$content,"slbDirectionPrev"),this.direction&&t(this.$content,"next"===this.direction?"slbDirectionNext":"slbDirectionPrev"),this.options.beforeSetContent&&this.options.beforeSetContent(o,this),this.$content.appendChild(o),this},setImageDimensions:function(){this.$currentImage&&(this.$currentImage.style.maxHeight=("innerHeight"in window?window.innerHeight:document.documentElement.offsetHeight)+"px")},setupLightboxEvents:function(){var e=this;return this.eventRegistry.lightbox.length?this:(this.addEvent(this.$el,"click",(function(t){var n=t.target;o(n,".slbCloseBtn")||e.options.closeOnOverlayClick&&o(n,".slbWrap")?e.close():o(n,".slbArrow")?o(n,".next")?e.next():e.prev():e.options.nextOnImageClick&&e.items.length>1&&o(n,".slbImage")&&e.next()})).addEvent(document,"keyup",(function(t){e.options.closeOnEscapeKey&&27===t.keyCode&&e.close(),e.items.length>1&&((39===t.keyCode||68===t.keyCode)&&e.next(),(37===t.keyCode||65===t.keyCode)&&e.prev())})).addEvent(window,"resize",(function(){e.setImageDimensions()})),this)},close:function(){this.modalInDom&&(this.runHook("beforeClose"),this.removeEvents("lightbox"),this.$el&&this.$el.parentNode.removeChild(this.$el),n(document.documentElement,this.options.htmlClass),this.modalInDom=!1,this.runHook("afterClose")),this.direction=void 0,this.currentPosition=this.options.startAt},destroy:function(){this.close(),this.runHook("beforeDestroy"),this.removeEvents("thumbnails"),this.runHook("afterDestroy")},runHook:function(e){this.options[e]&&this.options[e](this)}}),a.open=function(e){var t=new a(e);return e.content?t.setContent(e.content).show():t.showPosition(t.options.startAt)},a.registerAsJqueryPlugin=function(e){e.fn.simpleLightbox=function(t){var n,i=this;return this.each((function(){e.data(this,"simpleLightbox")||(n=n||new a(e.extend({},t,{$items:i})),e.data(this,"simpleLightbox",n))}))},e.SimpleLightbox=a},"undefined"!=typeof window&&window.jQuery&&a.registerAsJqueryPlugin(window.jQuery),a})?i.apply(t,o):i)||(e.exports=a)},function(e,t,n){}]).default;
//# sourceMappingURL=api.js.map