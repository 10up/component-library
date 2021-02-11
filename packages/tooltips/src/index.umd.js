import Tooltip from './tooltip';

export { Tooltip };

if (typeof window.TenUp !== 'object') {
	window.TenUp = {};
}

window.TenUp.tooltip = Tooltip;
