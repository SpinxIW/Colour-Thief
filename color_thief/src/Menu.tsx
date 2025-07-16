import { Container, Typography, Button, Stack } from "@mui/material";

interface MenuProps {
	onSelectRadius: (radius: number) => void;
}

const Menu: React.FC<MenuProps> = ({ onSelectRadius }) => {
	return (
		<Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
			<Typography variant="h3" gutterBottom>
				🎯 Welcome to Color Thief!
			</Typography>
			<Typography variant="h6" gutterBottom>
				Select a difficulty:
			</Typography>
			<Stack spacing={2} mt={4}>
				<Button variant="contained" color="success" onClick={() => onSelectRadius(30)}>
					Easy (Radius 30)
				</Button>
				<Button variant="contained" color="primary" onClick={() => onSelectRadius(20)}>
					Medium (Radius 20)
				</Button>
				<Button variant="contained" color="warning" onClick={() => onSelectRadius(5)}>
					Hard (Radius 5)
				</Button>
				<Button variant="contained" color="error" onClick={() => onSelectRadius(2)}>
					Extreme (Radius 2)
				</Button>
			</Stack>
		</Container>
	);
};

export default Menu;
