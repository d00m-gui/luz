export function getLightnesFromHex(hex: string): number {
	hex = hex.replace(/^#/, "");
	let r, g, b;
	r = parseInt(hex.slice(0, 2), 16);
	g = parseInt(hex.slice(2, 4), 16);
	b = parseInt(hex.slice(4, 6), 16);

	// Luminance formula (percieved brightness)
	const brightness = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
	const lightness = +(brightness * 100).toFixed(2);
	console.log("return lightness", { r, g, b }, lightness, brightness);
	return lightness;
}

export function isEmpty(obj: object): boolean {
	if (obj === null || typeof obj === "undefined") {
		return false;
	}
	return Object.keys(obj).length === 0;
}
