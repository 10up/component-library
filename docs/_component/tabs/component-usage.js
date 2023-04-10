import Tabs from '@10up/component-tabs';

new Tabs( '.tabs', {
  orientation: 'horizontal', // default is 'horizontal', can be 'vertical'
  onCreate: function() {
    console.log( 'onCreate callback' );
  },
  onTabChange: function() {
    console.log( 'onTabChange callback' );
  }
} );
