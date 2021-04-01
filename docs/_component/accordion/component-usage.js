import Accordion from '@10up/component-accordion';

new Accordion( '.accordion', {
  onCreate: function() { /* callback content */ },
  onOpen: function( { link, content, heading } ) { /* callback content */ },
  onClose: function( { link, content, heading } ) { /* callback content */ },
  onToggle: function( { link, content, heading } ) { /* callback content */ }
} );
