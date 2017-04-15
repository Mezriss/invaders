export function hexToRgba(hex, alpha) {
	return `rgba(${parseInt(hex.substr(1, 2), 16)}, ${parseInt(hex.substr(3, 2), 16)}, ${parseInt(hex.substr(5, 2), 16)}, ${alpha / 100})`;
}
