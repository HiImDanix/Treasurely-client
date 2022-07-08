import {useState} from 'react';
import {Container} from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import {useLocation} from "react-router-dom";
import {GAMES_URL, PLAYERS_URL, GAME_START_PATH} from "../Api";
import Camera from "./Camera";
import JoinGame from "./JoinGame";
import Nav from "./Nav";
import Answer from "./Answer";
import Mission from "./Mission";

const Game = (props) => {
	let isGameLoopRunning = true;

	// States that the game can be in
	const AVAILABLE_GAME_STATUSES = {
		NOT_STARTED: "NOT_STARTED",
		IN_PROGRESS: "IN_PROGRESS",
		PAUSED: "PAUSED",
		FINISHED: "FINISHED"
	}

	// Player state
	const [playerName, setPlayerName] = useState(props.username);
	// sessionID must be verified using the API before it can be used
	const [playerSessionID, setPlayerSessionID] = useState(props.sessionID);

	// Game state
	const [game, setGame] = useState({
		id: null,
		code: null,
		status: null,
		players: null
	});

	// VIEWS
	const [cameraView, setCameraView] = useState(false);
	const [joinGameView, setJoinGameView] = useState(false);


	// Tell API to start the game
	const handleStartGameButton = async () => {
		await fetch(`${GAMES_URL}/${game.id}` + GAME_START_PATH,
			{ method: "POST" }

		).then(response => {
			console.log(response);

			if (response.ok) {
				console.log("started")
			}

		}).catch(error => {
			console.log(error);
		})
	}

	// Retrieve information about the current game, in a recursive loop
	const executeGameLoop = async () => {
		async function gameLoop() {
			let response = await fetch(`${PLAYERS_URL}/${playerSessionID}/game`);

			if (response.status === 502) {
				console.log("Server error");
				// Status 502 is a connection timeout error
			} else if (response.status !== 200) {
				// An error - let's show it
				console.log(response.statusText);
			} else {
				// update local game state
				let data = await response.json();

				console.log(data)
				if (data.status && game.status !== data.status) {
					updateGame("status", data.status);
				}

				if (game.players !== data.players) {
					updateGame("players", data.players);
				}
			}
		}
		const delay = ms => new Promise(r => setTimeout(r, ms));
		while (isGameLoopRunning) {
			await delay(1000);
			await gameLoop();
		}

	};
	executeGameLoop()

	const updateGame = (name, value) => {
		setGame(prevGame => {
			return {
				...prevGame,
				[name]: value 
			}
		})
	}

	const getPlayersList = () => {
		return (
			<div className="players-list">
				{game.players.map(player => {
					return (
						<div className='player'>
							<i className="bi bi-emoji-laughing player-emoji"></i>
							<p className='player-name'>{player.name}</p>
						</div>
					)
				})}
			</div>
		)
	}

	const getMissions = () => {
		return (
			<div className="mission">
				<h1>Missions</h1>
				<Mission text={"Enjoy the view of the iceberg from the favourite lookout. Enjoy the view of the iceberg from the favourite lookout."}/>

				<Mission text={"Find the missing leg for 'big bug'"}/>

			</div>
		)
	}

	const getPageBody = () => {
		switch (game.status) {
			case AVAILABLE_GAME_STATUSES.NOT_STARTED:
				return (
					(
						<div className="game-players">
							<h2>Players:</h2>
							{getPlayersList()}
							<Button
								className="white"
								onClick={handleStartGameButton}
								style={{margin: "30px"}}
							>Start game</Button>
						</div>
					)
				)
			case AVAILABLE_GAME_STATUSES.IN_PROGRESS:
				return <>
							<Answer
								player_session_id={playerSessionID}
								gameID={game.id}
								cameraToggleCallback={() => {alert("Camera view toggled")}}
							/>
							{getMissions()}
						</>

			case AVAILABLE_GAME_STATUSES.PAUSED:
				return (
					<div>
						<p>PAUSED</p>
					</div>
				)
			case AVAILABLE_GAME_STATUSES.FINISHED:
				return (
					<div>
						<p>FINISHED</p>
					</div>
				)
		}
	}

	const getGameView = () => {
		return (
			<Container className="game-container">
					{getPageBody()}
			</Container>
		)
	}

	const getCameraView = () => {
		return (
			<Camera />
		)
	}

	return (
		<div className="game">
			<Nav isLoggedIn={playerName !== ""} />
			{cameraView ? getCameraView() : getGameView()}

		</div>
	)
}

export default Game;
