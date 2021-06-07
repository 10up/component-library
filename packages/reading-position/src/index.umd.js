import ReadingPosition from './reading-position';

export { ReadingPosition };

export default ReadingPosition;

if (typeof window.TenUp !== 'object') {
	window.TenUp = {};
}

window.TenUp.readingPosition = ReadingPosition;
