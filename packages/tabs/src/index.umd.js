import Tabs from './tabs';

export { Tabs };

if (typeof window.TenUp !== 'object') {
	window.TenUp = {};
}

window.TenUp.Tabs = Tabs;
// for backwards compat
window.TenUp.tabs = Tabs;
