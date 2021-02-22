import CountdownTimer from './countdown-timer';

export { CountdownTimer };

export default CountdownTimer;

if (typeof window.TenUp !== 'object') {
	window.TenUp = {};
}

window.TenUp.CountdownTimer = CountdownTimer;
