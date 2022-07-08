import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl"
import {GAMES_URL, PLAYERS_URL} from "../Api";
import JoinGame from "./JoinGame";
import Nav from "./Nav";
import Game from "./Game";

const Login = (props) => {
	const LoginStatus = {
		GAME_CODE: 0,
		USERNAME: 1,
	}
	// TODO: convert to normal variables?
	const [gameCode, setGameCode] = useState("EJ4K3");
	const [gameID, setGameID] = useState(null);

	const [username, setUsername] = useState(null);

	const [loginStatus, setLoginStatus] = useState(LoginStatus.GAME_CODE);

	let navigate = useNavigate();

	const handleGameCodeChange = (event) => {
		setGameCode(event.target.value);
	}

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	}

	// join existing game if session ID is provided (as a prop)
	const tryJoiningExistingGame = () => {
		const sessionID = localStorage.getItem('PLAYER_SESSION_ID');
		if (sessionID) {
			fetch(`${PLAYERS_URL}/${sessionID}/game`

			).then(async response => {
				console.log(response);

				if (response.ok) {
					const game = await response.json(); // TODO: unused???
					props.setSessionID(sessionID);
					props.setUsername(game.players[0].name);
				} else {
					console.log("Previous game not found");
					localStorage.removeItem('PLAYER_SESSION_ID');
				}

			} ).catch(error => {
				console.log("Failed to join previous game");
			})
		}
	};

	const validateGameCode = async () => {
		await fetch(GAMES_URL + "?" + new URLSearchParams({ code: gameCode }))
			.then(async res => {
				if (res.ok) {
					const data = await res.json();
					setLoginStatus(LoginStatus.USERNAME);
					setGameID(data.id);
				} else {
					alert("Game not found!");
				}
			})
			.catch(err => {
					alert("Error joining the game");
				}
			);
	}

	const getGameCodeView = () => {
		return <div className="login-page">
			<h2 className="login-logo">Treasurely</h2>

			<div className="login-card">
				<FormControl
					className="login-input"
					placeholder="Game Code"
					value={gameCode}
					onChange={handleGameCodeChange}
				/>
				<Button
					className="login-button"
					onClick={validateGameCode}
				>
					Join
				</Button>
			</div>
		</div>
	}

	tryJoiningExistingGame();
	switch (loginStatus) {
		case LoginStatus.GAME_CODE:
			return getGameCodeView();
		case LoginStatus.USERNAME:
			return <JoinGame
				gameCode={gameCode}
				gameID={gameID}
				setUsername={(name) => props.setUsername(name)}
				setSessionID={(id) => props.setSessionID(id)}
			/>

	}

}

export default Login;

