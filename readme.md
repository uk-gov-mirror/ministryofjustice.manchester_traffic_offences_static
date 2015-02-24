# Manchester Traffic Offences - static pages builder

Static page builder using Handlebars templates.

## Installation

Install dependencies (requires [node.js](http://nodejs.org/)):

```
npm install
```

If you haven't already, you'll also need to install the Grunt Command-line Interface to run grunt from the terminal:

```
npm install -g grunt-cli
```

## Build

The assets and HTML files can be generated without running the server or the `watch` task. Simply call the `build` Grunt task:

```
grunt build
```

## Local development

Run the local server:

```
grunt server
```

The server Grunt task will also watch assets and templates folders for new/changed files. Open `http://localhost:9000/` in your browser to view generated files.



## Deployment

The `/public_html` directory contains all generated assets and HTML pages, ready to be uploaded to their relevant location. When uploading one page on its own, remember to include the assets directory if necessary.

---

## Usage

Create a new Handlebars template file in the pages directory, e.g. `/templates/pages/new-page.hbs`. Files are then generated into the build directory with the `.html` extension, e.g. `/public_html/new-page.html`.

### MoJ Template content block variables

The templates currently support all the variables available in the MoJ Template base markup. The available content blocks and their defaults are listed in `templates/data.yml`. These can be overridden on a page-by-page basis using YAML Front Matter:

```
---
pageTitle: A new page
footerTop: <p>some content for the top of the footer</p>
---
```

---

## Updating

A few steps are necessary to update to the latest version of the MoJ Template:

- [Build the latest Mustache version of the MoJ Template](https://github.com/ministryofjustice/moj_template#mustache-version)
- Copy the contents of the generated `views/layouts/moj_template.html` to `templates/layouts/default.hbs`
- Replace the `{{{ content }}}` block variable with `{{> body}}`
- Copy the Moj Template `assets` directory to `public_html/assets`
- Re-build local assets using `grunt build`


---

## More info

More info on the [Handlebars templating system](http://handlebarsjs.com/)

