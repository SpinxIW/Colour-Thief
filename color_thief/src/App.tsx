import { useEffect, useState } from "react";
import { Container, Typography, Grid } from "@mui/material";
import ImageDisplay from "./ImageDisplay";
import { getVividColorFromImage } from "./utils";
import ColourRemovedImageDisplay from "./ColourRemovedImageDisplay";
import ColourButtons from "./ColourButtons";
import { getRandomImage } from "./ImportImages";

const radius = 20;
// const targetHex = "#629e2d";

function App() {
	const [guessDisabled, setGuessDisabled] = useState(true);
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [guessedCorrectly, setGuessedCorrectly] = useState<boolean | null>(null);
	const [targetHex, setTargetHex] = useState<string | null>(null);

	useEffect(() => {
		async function loadImage() {
			const img = await getRandomImage();
			const tarhex = await getVividColorFromImage(img);
			setImageSrc(img);
			setTargetHex(tarhex);
			setGuessDisabled(false); // Enable guessing after image loaded
		}
		loadImage();
	}, []);

	console.log(guessedCorrectly);

	async function changeImage() {
		setGuessDisabled(true);
		const img = await getRandomImage();
		setImageSrc(img);
		setGuessedCorrectly(null);
		setGuessDisabled(false);
	}

	async function changeTargetHex() {
		const tarhex = await getVividColorFromImage(imageSrc);
		setTargetHex(tarhex);
	}

	if (!imageSrc || !targetHex) {
		return (
			<Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
				<Typography>Loading image...</Typography>
			</Container>
		);
	}

	return (
		<Container maxWidth="md" sx={{ mt: 4 }}>
			<Grid container spacing={4} justifyContent="center" alignItems="center">
				{/* Title & Subtitle */}
				<Grid size={12} textAlign="center">
					<Typography variant="h3" gutterBottom>
						🎨 Color Thief
					</Typography>
					<Typography variant="subtitle1">One color in the image is missing. Can you spot it?</Typography>
				</Grid>

				{/* Image Display
				<Grid size={12} container justifyContent="center">
					<ImageDisplay imageSrc={imageSrc} />
				</Grid> */}
				{guessedCorrectly !== null ? (
					<Grid container spacing={2} justifyContent="center">
						{/* Left: Colour Removed Image */}
						<Grid size={6}>
							<ColourRemovedImageDisplay imageSrc={imageSrc} targetHex={targetHex} radius={radius} />
						</Grid>

						{/* Right: Original Image */}
						<Grid size={6}>
							<ImageDisplay imageSrc={imageSrc} />
						</Grid>
					</Grid>
				) : (
					<Grid container justifyContent="center">
						<Grid size={12}>
							<ColourRemovedImageDisplay imageSrc={imageSrc} targetHex={targetHex} radius={radius} />
						</Grid>
					</Grid>
				)}
				{/* <Grid size={12} container justifyContent="center">
					<ColourRemovedImageDisplay imageSrc={imageSrc} targetHex={targetHex} radius={radius} />
				</Grid> */}
				<Grid size={12} container justifyContent="center">
					<ColourButtons correctHex={targetHex} radius={radius} setGuessedCorrectly={setGuessedCorrectly} />
				</Grid>

				{guessedCorrectly !== null && (
					<Grid container direction="column" alignItems="center" spacing={2}>
						<Grid size={12}>
							<Typography variant="h2" color={guessedCorrectly ? "success.main" : "error.main"}>
								{guessedCorrectly ? "🎉 Woohoo! You did it!" : "❌ Nope, that was WRONG."}
							</Typography>
						</Grid>
						{/* 
						<Grid size={12}>
							<ImageDisplay imageSrc={imageSrc} />
						</Grid> */}
					</Grid>
				)}

				{/* Controls */}
				{/* <Grid size={12} container justifyContent="center" alignItems="center">
					<Button variant="contained" disabled={guessDisabled} fullWidth>
						Submit Guess
					</Button>
				</Grid> */}
			</Grid>
		</Container>
	);
}

export default App;
