export function frac(x) {
	return x - Math.floor(x);
}

export function clamp(min, max, x) {
	if (x < min) return min;
	if (x > max) return max;
	return x;
}

export function lerp(a, b, f) {
	return (1 - f) * a + f * b;
}
