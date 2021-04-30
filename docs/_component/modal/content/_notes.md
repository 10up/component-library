The modal / dialog component is one that is frequently used in UI design and
popular enough to where we don't feel like we need to reinvent the wheel. After
an exhaustive search for a third party plugin that met all of our accessibility
and implementation requirements, we were able to settle on using
<a href="https://github.com/KittyGiraudel/a11y-dialog">A11yDialog</a> by Kitty Giraudel. This
plugin is fully WCAG 2.1 compliant, lightweight, has a robust API, no
dependencies, and properly manages focus.

<strong>NOTE:</strong>

In early 2021, A11yDialog 7.0 was released and introduced breaking changes.
A summary of those changes include:
- No more support for the `<dialog>` HTML element
- No more usage of the open HTML attribute
- Different expected markup
- More flexible position in the DOM

Documentation for <a href="https://a11y-dialog.netlify.app/migrating-to-v7/">Migraging to v7</a>.

A11yDialog also has <a href="https://github.com/KittyGiraudel/react-a11y-dialog">React</a>
and <a href="https://github.com/morkro/vue-a11y-dialog">Vue</a> versions we can
leverage for projects in those environments.
