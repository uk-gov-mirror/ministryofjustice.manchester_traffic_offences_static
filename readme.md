# Manchester Traffic Offences - static pages builder

Static page builder using Handlebars templates.

## Installation

Install dependencies (requires [node.js](http://nodejs.org/)):

```
npm install
```

Run local server:

```
grunt server
```

The server Grunt task will also watch assets and templates folders for new/changed files. Open `http://localhost:9000/` in your browser to view generated files.

---

## Usage

Create a new Handlebars template file in the pages directory, e.g. `/templates/pages/new-page.hbs`. Files are then generated into the build directory with the `.html` extension, e.g. `/public_html/new-page.html`.

### YAML front matter

The templates currently support some YAML variables as front matter. Simply add the YAML front matter before the content.

##### title (optional)

Contents of the `<title>` tag before the default (currently "GOV.UK - The best place to find government services and information"). A dash is added automatically at the end to separate from the default.


##### propositionName

The name of the service.


##### propositionLink

The link to the service's home page.


#### Example YAML Front Matter

```
---
title: New Page
propositionName: "Make your plea: Traffic offences"
propositionLink: "http://www.makeaplea.service.gov.uk"
---
```


---

## More info

More info on the [Handlebars templating system](http://handlebarsjs.com/)

