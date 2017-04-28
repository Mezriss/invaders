export function hexToRgba(hex, alpha) {
	return `rgba(${Math.floor(hex / 0x10000).toString()}, ${Math.floor(hex % 0x10000 / 0x100).toString()}, ${(hex % 0x100).toString()}, ${alpha / 100})`;
}
