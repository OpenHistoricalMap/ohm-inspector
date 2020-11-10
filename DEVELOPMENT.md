# Developer Docs


### Gazetteer Widget Development

Babel, SASS/SCSS, Webpack.

Upon initial setup on your system, run `nvm use` and `yarn install` to set up build tools.

Then, your edits would be made to **api.js** and **api.scss**

Running `npm run build` will compile the browser-ready versions **api/api.js** and **api/api.css** for production. This means minifying, stripping comments, etc.

For development, `npm start` is recommended. This will run a HTTP server which watches for changes and reloads the page as you modify the code. *Note that this is not a replacement for `npm run build` for deployment.*

The command `npm run deploy` will do a `npm run build` followed by a  git add, commit, and push. This single command will effectively deploy the current state of the code to Github pages.


### Deployment, Docs, and Demos

https://openhistoricalmap.github.io/ohm-inspector/ The API endpoint, documentation, and demonstration application are all served directly from *master* branch via Github Pages. The *index.html* file forms the home page, including the demo.

https://github.com/OpenHistoricalMap/ohm-inspector/ The *README.md* includes API documentation.
