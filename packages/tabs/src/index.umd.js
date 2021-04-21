import Tabs from './tabs';

export { Tabs };

export default Tabs;

if (typeof window.TenUp !== 'object') {
	window.TenUp = {};
}

window.TenUp.Tabs = Tabs;
// for backwards compat
window.TenUp.tabs = Tabs;
