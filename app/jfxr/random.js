export default function Random(seed) {
	if (!seed) seed = Date.now();
	this.x = seed & 0xffffffff;
	this.y = 362436069;
	this.z = 521288629;
	this.w = 88675123;
	// Mix it up, because some bits of the current Unix time are quite predictable.
	for (let i = 0; i < 32; i++)
		this.uint32();
}

Random.prototype.uint32 = function() {
	const t = this.x ^ ((this.x << 11) & 0xffffffff);
	this.x = this.y;
	this.y = this.z;
	this.z = this.w;
	this.w = this.w ^ (this.w >>> 19) ^ (t ^ (t >>> 8));
	return this.w + 0x80000000;
};

Random.prototype.uniform = function(min, max) {
	if (min === undefined && max === undefined) {
		min = 0;
		max = 1;
	} else if (max === undefined) {
		max = min;
		min = 0;
	}
	return min + (max - min) * this.uint32() / 0xffffffff;
};
