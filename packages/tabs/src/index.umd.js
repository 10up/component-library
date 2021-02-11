import Tabs from './tabs';

export { Tabs };

if (typeof window.TenUp !== 'object') {
	window.TenUp = {};
}

window.TenUp.tabs = Tabs;
