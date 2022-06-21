import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl"
import { GAMES_URL } from "../Api";

const Login = () => {
	const [gameCode, setGameCode] = useState("EJ4K3");

	let navigate = useNavigate();

	const handleChange = (event) => {
		setGameCode(event.target.value);
	}

	const joinGame = async () => {

		await fetch(GAMES_URL + "?" + new URLSearchParams({ code: gameCode }))
			.then(async res => {
				if (res.ok) {
					const data = await res.json();
					navigate("/play", {state:data});
				} else {
					alert("Game not found!");
				}
			})
			.catch(err => {
					alert("Error joining the game");
				}
			);
	}

	return (
		<div className="login-page">
			<h2 className="logo">Treasurely</h2>

			<div className="login-card">
				<FormControl 
					className="login-input" 
					placeholder="Game Code" 
					value={gameCode} 
					onChange={handleChange}
				/>
				<Button 
					className="login-button"
					onClick={joinGame}
				>
					Join
				</Button>
			</div>
		</div>
	);
}

export default Login;

