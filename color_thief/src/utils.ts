// Converts RGB (0-255) to HSL ([0-1, 0-1, 0-1])
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
	r /= 255;
	g /= 255;
	b /= 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0,
		s = 0,
		l = (max + min) / 2;

	if (max === min) {
		h = s = 0; // achromatic
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	return [h, s, l];
}

export function hexToRgb(hex: string): [number, number, number] | null {
	const cleaned = hex.replace(/^#/, "");
	if (![3, 6].includes(cleaned.length)) return null;
	let r, g, b;
	if (cleaned.length === 3) {
		r = parseInt(cleaned[0] + cleaned[0], 16);
		g = parseInt(cleaned[1] + cleaned[1], 16);
		b = parseInt(cleaned[2] + cleaned[2], 16);
	} else {
		r = parseInt(cleaned.slice(0, 2), 16);
		g = parseInt(cleaned.slice(2, 4), 16);
		b = parseInt(cleaned.slice(4, 6), 16);
	}
	return [r, g, b];
}

// HSL to RGB (0-255)
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
	let r: number, g: number, b: number;

	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Convert RGB to hex string
export function rgbToHex(r: number, g: number, b: number): string {
	const toHex = (n: number) => n.toString(16).padStart(2, "0");
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hueDistance(a: number, b: number): number {
	const diff = Math.abs(a - b);
	return diff > 180 ? 360 - diff : diff;
}


export async function getVividColorFromImage(src: string | null): Promise<string> {
	if (!src) return "#2a7524";

	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "Anonymous";
		img.src = src;

		img.onload = () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			if (!ctx) return reject("Failed to get 2D context");

			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0, img.width, img.height);

			const maxTries = 50;

			for (let i = 0; i < maxTries; i++) {
				const x = Math.floor(Math.random() * img.width);
				const y = Math.floor(Math.random() * img.height);
				const data = ctx.getImageData(x, y, 1, 1).data;
				const [r, g, b, a] = data;

				if (a < 200) continue; // Skip transparent pixels

				// Convert original RGB to HSL
				const [h] = rgbToHsl(r, g, b); // ignore s, l

				// Use only hue, crank up saturation & lightness
				const [rr, gg, bb] = hslToRgb(h, 1, 0.5);
				resolve(rgbToHex(rr, gg, bb));
				return;
			}

			resolve("#2a7524"); // fallback color
		};

		img.onerror = () => {
			reject("Failed to load image");
		};
	});
}
