import { useEffect, useRef, useState } from "react";
import { hueDistance, rgbToHsl } from "./utils";

interface ColorRemoveProps {
	imageSrc: string;
	targetHex: string; // e.g. '#ffcc00'
	radius: number;
	alt?: string;
	width?: number | string;
	height?: number | string;
}

const ColourRemovedImageDisplay: React.FC<ColorRemoveProps> = ({
	imageSrc,
	targetHex,
	radius,
	alt = "Processed image",
	width = 600,
	height = 600,
}) => {
	const [processedSrc, setProcessedSrc] = useState<string | null>(null);
	const [scalableRadius, setScalableRadius] = useState(radius)
	const imgRef = useRef<HTMLImageElement>(null);

	// Convert hex to RGB
	function hexToRgb(hex: string): [number, number, number] | null {
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

	useEffect(() => {
		if (!imgRef.current) return;
		const img = imgRef.current;
		const rgb = hexToRgb(targetHex);
		if (!rgb) {
			console.error("Invalid hex color:", targetHex);
			return;
		}
		const [r, g, b] = rgb;
		const [h] = rgbToHsl(r, g, b);
		const targetHue = h * 360;

		if (!img.complete) {
			img.onload = () => processImage(img, targetHue);
		} else {
			processImage(img, targetHue);
		}

		function processImage(image: HTMLImageElement, targetHue: number) {
			const canvas = document.createElement("canvas");
			canvas.width = image.naturalWidth;
			canvas.height = image.naturalHeight;
			const ctx = canvas.getContext("2d")!;
			ctx.drawImage(image, 0, 0);

			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const data = imageData.data;

			for (let i = 0; i < data.length; i += 4) {
				const r = data[i];
				const g = data[i + 1];
				const b = data[i + 2];

				const [h] = rgbToHsl(r, g, b);
				const hue = h * 360;

				if (hueDistance(hue, targetHue) <= radius) {
					data[i] = 255;
					data[i + 1] = 255;
					data[i + 2] = 255;
					data[i + 3] = 255;
				}
			}

			ctx.putImageData(imageData, 0, 0);
			setProcessedSrc(canvas.toDataURL());
		}

		return () => {
			img.onload = null;
		};
	}, [imageSrc, targetHex, radius]);

	return (
		<>
			<img ref={imgRef} src={imageSrc} alt={alt} style={{ display: "none" }} crossOrigin="anonymous" />

			{processedSrc ? (
				<img
					src={processedSrc}
					alt={alt}
					style={{ width, height, objectFit: "contain", border: "1px solid #ccc" }}
				/>
			) : (
				<p>Loading...</p>
			)}
		</>
	);
};

// ... keep rgbToHsl and hueDistance helpers as before

export default ColourRemovedImageDisplay;
