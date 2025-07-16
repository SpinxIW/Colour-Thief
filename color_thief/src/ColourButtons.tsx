import React, { useMemo, useState } from "react";
import { Button, Box, Stack, Grid } from "@mui/material";
import { hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from "./utils";

interface ColorButtonsProps {
	correctHex: string;
	radius: number; // in degrees
	setGuessedCorrectly: (correct: boolean) => void; // New prop
}

const ColourButtons: React.FC<ColorButtonsProps> = ({ correctHex, radius, setGuessedCorrectly }) => {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const [submitted, setSubmitted] = useState(false);

	const normalizeHue = (h: number) => ((h % 360) + 360) % 360;

	const buttons = useMemo(() => {
		const rgb = hexToRgb(correctHex);
		if (!rgb) return [];
		const [r, g, b] = rgb;
		const [h, s, l] = rgbToHsl(r, g, b);
		const baseHue = h * 360;

		const margin = 10; // extra space between ranges
		const spacing = 2 * radius + margin;

		// Place correctHue at baseHue
		// Place 4 wrong hues spaced evenly apart on the wheel avoiding overlap with the correctHue
		// We'll put 2 wrong hues on one side, 2 on the other, but spaced enough to avoid overlap.

		// Compute wrong hues by offsetting multiples of spacing (e.g., ±spacing, ±2*spacing)
		// but also avoid overlapping with the correct hue ±radius

		// Let's pick offsets like ±spacing, ±2*spacing but skip ±0

		const wrongHues: number[] = [];
		const maxButtons = 4;

		// We try to place wrong hues evenly spaced around the wheel
		// But ensuring no overlap: each hue must be at least 2*radius + margin apart from others.

		// Start from baseHue + spacing, and keep adding spacing until we have 4 wrong hues
		let multiplier = 1;
		while (wrongHues.length < maxButtons) {
			// Add positive offset
			wrongHues.push(normalizeHue(baseHue + multiplier * spacing));
			if (wrongHues.length < maxButtons) {
				// Add negative offset
				wrongHues.push(normalizeHue(baseHue - multiplier * spacing));
			}
			multiplier++;
		}

		// Limit to 4
		const limitedWrongHues = wrongHues.slice(0, maxButtons);

		const wrongColors = limitedWrongHues.map((hue) => {
			const [rr, gg, bb] = hslToRgb(hue / 360, s, l);
			return rgbToHex(rr, gg, bb);
		});

		const btns = [{ hex: correctHex, isCorrect: true }].concat(
			wrongColors.map((hex) => ({ hex, isCorrect: false }))
		);

		// Shuffle buttons so correct one is not always in same position
		for (let i = btns.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[btns[i], btns[j]] = [btns[j], btns[i]];
		}

		return btns;
	}, [correctHex, radius]);

	// Find index of correct button for styling
	const correctIndex = buttons.findIndex((btn) => btn.isCorrect);

	const handleSubmit = () => {
		if (selectedIndex !== null) {
			const { isCorrect } = buttons[selectedIndex];
			setGuessedCorrectly(isCorrect);
			setSubmitted(true);
		}
	};

	// Compute preview colors within radius of the selected color
	const previewColors = useMemo(() => {
		if (selectedIndex === null) return [];

		// Get the HSL of the selected color
		const selectedHex = buttons[selectedIndex].hex;
		const rgb = hexToRgb(selectedHex);
		if (!rgb) return [];
		const [r, g, b] = rgb;
		const [h, s, l] = rgbToHsl(r, g, b);
		const baseHue = h * 360;

		// Generate hues within the radius around baseHue
		// We'll generate a smooth gradient of colors +/- radius degrees from baseHue
		const step = 5; // degrees step for the preview
		let hues: number[] = [];

		for (let deg = -radius; deg <= radius; deg += step) {
			hues.push(normalizeHue(baseHue + deg));
		}

		// Convert hues to hex colors
		return hues.map((hue) => {
			const [rr, gg, bb] = hslToRgb(hue / 360, s, l);
			return rgbToHex(rr, gg, bb);
		});
	}, [selectedIndex, buttons, radius]);

	return (
		<Grid container spacing={2} justifyContent="center" textAlign="center">
			{/* Row 1: Buttons */}
			<Grid size={12}>
				<Stack direction="row" spacing={2} justifyContent="center" mb={2}>
					{buttons.map(({ hex }, idx) => {
						let borderColor = "black";
						let borderWidth = 1;

						if (submitted) {
							if (idx === correctIndex) {
								borderColor = "success.main";
								borderWidth = 5;
							}
							if (idx === selectedIndex) {
								borderColor = "primary.main";
								borderWidth = 3;
							}
						} else {
							if (idx === selectedIndex) {
								borderColor = "primary.main";
								borderWidth = 3;
							}
						}

						return (
							<Button
								key={idx}
								onClick={() => !submitted && setSelectedIndex(idx)}
								aria-label={`Color option ${idx + 1}`}
								title={`Color option ${idx + 1}`}
								sx={{
									minWidth: 60,
									minHeight: 60,
									backgroundColor: hex,
									borderRadius: 2,
									border: `${borderWidth}px solid`,
									borderColor,
									"&:hover": {
										backgroundColor: hex,
										opacity: submitted ? 1 : 0.8,
									},
									padding: 0,
									cursor: submitted ? "default" : "pointer",
								}}
								disabled={submitted}
							/>
						);
					})}
				</Stack>
			</Grid>

			{/* Row 2: Color Preview */}
			<Grid size={12}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						gap: 1,
						padding: 1,
						border: "1px solid",
						borderColor: "grey.400",
						borderRadius: 1,
						minWidth: 150,
						minHeight: 60,
						overflowX: "auto",
						whiteSpace: "nowrap",
					}}
					aria-label="Colors within radius preview"
				>
					{previewColors.length === 0 ? (
						<Box sx={{ color: "text.secondary" }}>Select a color to preview</Box>
					) : (
						previewColors.map((color, i) => (
							<Box
								key={i}
								sx={{
									width: 20,
									height: 40,
									backgroundColor: color,
									borderRadius: 1,
									border: "1px solid #ccc",
									display: "inline-block",
								}}
								title={color}
							/>
						))
					)}
				</Box>
			</Grid>

			{/* Row 3: Submit Button */}
			<Grid size={12} display="flex" justifyContent="center">
				<Button
					variant="contained"
					onClick={handleSubmit}
					disabled={selectedIndex === null || submitted}
					size="large"
				>
					Submit Guess
				</Button>
			</Grid>
		</Grid>
	);
};

export default ColourButtons;
