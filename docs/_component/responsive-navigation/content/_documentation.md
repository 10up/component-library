<h3>Installation</h3>

<p>This component accepts two arguments, the selector for the navigation container and an object containing configuration settings and optional callbacks.</p>

<div class="u-spacing__bottom--medium">
<code>npm install @10up/component-navigation --save</code>
</div>

<h3>Options</h3>

<table class="table--code u-spacing__bottom--large">
	<caption>List of Options for this component</caption>
	<tr>
		<th class="th">action</th>
		<td class="td">The action to use to open menu items <em>(default) hover</em></td>
	</tr>
	<tr>
		<th class="th">toggleWithArrows</th>
		<td class="td">Open dropdown when clicking on arrow instead of the anchor tag.</em></td>
	</tr>
	<tr>
 		<th>onCreate</th>
 		<td>Called after the component is initialized on page load</td>
 	</tr>
	<tr>
 		<th>onOpen</th>
 		<td>Called when a menu item is opened</td>
 	</tr>
 	<tr>
 		<th>onClose</th>
 		<td>Called when a menu item is closed</td>
 	</tr>
	<tr>
 		<th>onSubmenuOpen</th>
 		<td>Called when a submenu item is opened</td>
 	</tr>
	<tr>
 		<th>onSubmenuClose</th>
 		<td>Called when a submenu item is closed</td>
 	</tr>
</table>

<h3>Methods</h3>

<table class="table--code u-spacing__bottom--large">
	<caption>List of avaliable methods</caption>
	<tr>
		<th class="th">destroy()</th>
		<td class="td">Destroys the component, removing event listeners and any extra markup and attributes.</td>
	</tr>
</table>

<h3>Classes</h3>

  <table class="table--code u-spacing__bottom--large">
	<caption>List of Classes used for this component</caption>
  	<tr>
  		<th class="th">.site-navigation</th>
  		<td class="td">Wrapping class for the component.</td>
  	</tr>
  	<tr>
  		<th>.primary-menu</th>
  		<td>The navigation menu itself, also the target for the method call.</td>
  	</tr>
  	<tr>
  		<th>.menu-item</th>
  		<td>An individual menu item.</td>
  	</tr>
 	<tr>
  		<th>.sub-menu</th>
  		<td>A nested menu.</td>
  	</tr>
  </table>
