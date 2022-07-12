import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl"
import {GAMES_URL, PLAYERS_URL} from "../Api";
import JoinGame from "./JoinGame";
import Nav from "./Nav";

const Login = (props) => {
	const LoginStatus = {
		GAME_CODE: 0,
		USERNAME: 1,
	}

	// TODO: convert to normal variables?
	const [gameCode, setGameCode] = useState("EJ4K3");
	const [gameID, setGameId] = useState(null);

	const [loginStatus, setLoginStatus] = useState(LoginStatus.GAME_CODE);

	const handleGameCodeChange = (event) => {
		setGameCode(event.target.value);
	}

	// join existing game if session ID is provided (as a prop)
	const tryJoiningExistingGame = async () => {
		const sessionID = localStorage.getItem('PLAYER_SESSION_ID');
		if (sessionID) {
			await fetch(`${PLAYERS_URL}/${sessionID}/game`

			).then(async response => {

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
					console.log(data)
					setGameId(data.id)
					setLoginStatus(LoginStatus.USERNAME);
				} else {
					alert("Game not found!");
				}
			})
			.catch(error => {
					alert("Error joining the game");
				}
			);
	}

	const getGameCodeView = () => {
		return (
			<div className="login-page middle">
				<h2 className="logo-font big-font">Treasurely</h2>

				<div className="card">
					<FormControl
						className="field-default"
						placeholder="Game Code"
						value={gameCode}
						onChange={handleGameCodeChange}
					/>
					<Button
						className="button-default"
						onClick={validateGameCode}
					>
						Join
					</Button>
				</div>
			</div>
		)
	}

	tryJoiningExistingGame();

	console.log("joining")

	switch (loginStatus) {
		case LoginStatus.GAME_CODE:
			return getGameCodeView();
		case LoginStatus.USERNAME:
			return (
				<div>
					<Nav leaveGame={() => setLoginStatus(LoginStatus.GAME_CODE)} />
					<JoinGame
						gameCode={gameCode}
						gameID={gameID}
						setUsername={(name) => props.setUsername(name)}
						setSessionID={(id) => props.setSessionID(id)}
					/>
				</div>
			)
	}

}

export default Login;

