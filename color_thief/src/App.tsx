import { useState } from "react";
import Game from "./Game";
import Menu from "./Menu";

function App() {
	const [radius, setRadius] = useState<number | null>(null);

	console.log(radius)

	return <>{radius === null ? <Menu onSelectRadius={setRadius} /> : <Game radius={radius} />}</>;
}

export default App;
