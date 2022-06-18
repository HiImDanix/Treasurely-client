import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl"
import { gamesURL } from "../Api";

const Login = () => {
	// Hardcoded as EJ4K3
	const [gameCode, setGameCode] = useState("EJ4K3");

	const [joined, setJoined] = useState(false);

	let navigate = useNavigate();

	const handleChange = (event) => {
		setGameCode(event.target.value);
	}

	const joinedButtonStyles = {
		disabled: true,
		opacity: 0.2,
		cursor: 'not-allowed'
	}

	const joinGame = async () => {
		setJoined(true);

		await fetch(gamesURL + "?" + new URLSearchParams({ code: gameCode }), {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => {
				if (response.ok) {

					return response.json();
				} else if (response.status === 404) {
					setJoined(false);
					alert("You entered an invalid game code.");
				}

			})
			.then(data => {
				navigate(`/${gameCode}`, {state: data});
			}).catch(error => {
				setJoined(false);
				console.log(error);
			});
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
					style={joined ? joinedButtonStyles : {}} 
					onClick={joinGame}
				>
					{joined ? "Joining": "Join game"}
				</Button>
			</div>
		</div>
	);
}

export default Login;

