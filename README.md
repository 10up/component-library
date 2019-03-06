## What is this?

Mostly just a proof of concept right now. Currently, this is a JSDoc site. We pull in a few 10up components (Accordion and Tooltip) as node modules, parse their JSDoc blocks and use a custom JSDoc theme to generate a simple JSDoc site.

Since we're using JSDoc there are limitations to what we can do (i.e. JS doc block parsing, and not necessarily full demos and custom, dynamic site navigation, etc.). Ideally, we would use some sort of Liquid tags and Jekyll to generate the site and host on GH-Pages branch.

Typically we would not host the JSDoc theme within the repo. It would be more likely to package and host as another node module on npmjs.org, and pull it in as a `devDependency`. Again, this is just merely a proof of concept for using JSDoc. :smile:

### Generating this documentation site:

One liner: `npm install && npm run docs && open ./docs/index.html`

#### Intro text here...

At 10up, we strive to provide websites that yield a top-notch user experience. In order to improve both our efficiency and consistency, we need to standardize what we use and how we use it. Standardizing our approach to commonly-used front-end components allows us to understand better the inner workings of someone else’s project and produce better solutions ourselves and for our clients.

Each component in this library is built with simplicity and accessibility in mind, tailored to fit the often opinionated nature of WordPress core output. These components are intended to be easily adapted to any number of different projects and use cases.

While creating this library we took special care to ensure that each component meets the baseline accessibility standards of WCAG 2.1. This helps us build each component up from a strong base to create a positive end-to-end experience for all users.