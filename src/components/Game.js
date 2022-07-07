import {useState} from 'react';
import {Container} from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import {useLocation} from "react-router-dom";
import {GAMES_URL, GAME_START_PATH} from "../Api";
import Camera from "./Camera";
import JoinGame from "./JoinGame";
import Nav from "./Nav";
import Answer from "./Answer";
import Mission from "./Mission";

const Game = () => {
	const location = useLocation();
	const propsGame = location.state;
	let gameLoopRunning = false;

	// States that the game can be in
	const AVAILABLE_GAME_STATUSES = {
		NOT_STARTED: "NOT_STARTED",
		IN_PROGRESS: "IN_PROGRESS",
		PAUSED: "PAUSED",
		FINISHED: "FINISHED"
	}

	// Player state
	const [playerName, setPlayerName] = useState("");
	// sessionID must be verified using the API before it can be used
	const [playerSessionID, setPlayerSessionID] = useState(localStorage.getItem('PLAYER_SESSION_ID'));

	// Game state
	const [game, setGame] = useState({
		id: propsGame.id,
		code: propsGame.code,
		status: propsGame.status,
		players: propsGame.players
	});

	// VIEWS
	const [cameraView, setCameraView] = useState(false);
	const [joinGameView, setJoinGameView] = useState(false);


	// try to join the game with the player's session ID that is stored in local storage.
	const joinExistingGame = () => {
		if (playerSessionID && playerName === "") {

			fetch(`${GAMES_URL}/${game.id}/players?
				${new URLSearchParams({player_session_id: playerSessionID})}`

			).then(async response => {
				console.log(response);

				if (response.ok) {
					const player = await response.json();
					setPlayerName(player.name);

				} else {
					console.log("Previous game not found");
				}

			} ).catch(error => {
				console.log("Failed to join previous game");
			})
		}
	};

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
		if (playerName === "" || gameLoopRunning) {
			return;
		}

		gameLoopRunning = true;

		await new Promise(resolve => setTimeout(resolve, 1000));

		let response = await fetch(GAMES_URL + "?" + new URLSearchParams({ code: game.code}))

		if (response.status === 502) {
			await executeGameLoop(); // Status 502 is a connection timeout error
		} else if (response.status !== 200) {
			// An error - let's show it
			console.log(response.statusText);
			// Reconnect in one second
			await executeGameLoop();
		} else {
			// update local game state
			let data = await response.json();

			console.log(data)
			if (data.status && game.status != data.status) {
				updateGame("status", data.status);
			}

			if (game.players != data.players) {
				updateGame("players", data.players);
			}

			await executeGameLoop();
		}
	};

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
		joinExistingGame();
		executeGameLoop();

		if (playerName === "") {
			return (
				<JoinGame
					gameCode={game.code}
					gameID={game.id}
					setPlayerName={setPlayerName}
					setPlayerSessionID={setPlayerSessionID}
				/>
			)
		} else {
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
