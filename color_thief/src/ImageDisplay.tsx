import React from "react";
import { Box, Typography } from "@mui/material";

interface ImageDisplayProps {
	imageSrc?: string;
	alt?: string;
	maxWidth?: number | string;
	maxHeight?: number | string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
	imageSrc,
	alt = "Game image",
	maxWidth = 600,
	maxHeight = 600,
}) => {
	return (
		<Box
			sx={{
				border: "2px dashed grey",
				bgcolor: "#242424",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				overflow: "hidden",
				maxWidth,
				maxHeight,
				margin: "0 auto", // center horizontally
			}}
		>
			{imageSrc ? (
				<img
					src={imageSrc}
					alt={alt}
					style={{
						maxWidth: "100%",
						maxHeight: "100%",
						height: "auto",
						width: "auto",
					}}
				/>
			) : (
				<Typography variant="body1" color="text.secondary" sx={{ p: 4 }}>
					🖼️ Image will go here
				</Typography>
			)}
		</Box>
	);
};

export default ImageDisplay;
