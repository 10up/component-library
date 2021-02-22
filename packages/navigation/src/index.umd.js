import Navigation from './navigation';

export { Navigation };

export default Navigation;

if (typeof window.TenUp !== 'object') {
	window.TenUp = {};
}

window.TenUp.navigation = Navigation;
