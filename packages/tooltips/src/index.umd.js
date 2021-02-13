import Tooltip from './tooltip';

export { Tooltip };

if (typeof window.TenUp !== 'object') {
	window.TenUp = {};
}

window.TenUp.Tooltip = Tooltip;

// for backwards compat
window.TenUp.tooltip = Tooltip;
