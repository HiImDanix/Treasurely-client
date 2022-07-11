import {useEffect, useState} from 'react';
import {Container} from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import {GAMES_URL, PLAYERS_URL, GAME_START_PATH} from "../Api";
import Camera from "./Camera";
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
		FINISHED: "FINISHED",
		JOINING: "JOINING"
	}

	// Game state
	const [game, setGame] = useState({
		id: null,
		code: null,
		status: AVAILABLE_GAME_STATUSES.JOINING,
		players: null
	});

	const playerSessionID = props.sessionID;

	// VIEWS
	const AVAILABLE_VIEWS = {
		CAMERA: "CAMERA",
		CONTENT: "CONTENT"
	};

	const [currentView, setCurrentView] = useState(AVAILABLE_VIEWS.CONTENT);


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

	// Run only once
	useEffect(() => {
		executeGameLoop()
	}, []);

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
				setGame(data);
			}
		}

		const delay = ms => new Promise(r => setTimeout(r, ms));

		while (isGameLoopRunning) {
			await delay(1000);
			await gameLoop();
		}
	};

	const getPlayersList = () => {
		return (
			<div className="players-list">
				{game.players.map((player, playerID) => {
					return (
						<div className='player' key={playerID}>
							<i className="bi bi-emoji-laughing player-emoji"></i>
							<p className='player-name'>{player.name}</p>
						</div>
					)
				})}
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
				return (
					<>
						<div className="mt-2 task card-container">
								<Answer
									player_session_id={playerSessionID}
									gameID={game.id}
									cameraToggleCallback={() => {alert("Camera view toggled")}}
								/>
						</div>
						<div className="mt-4 card-container">
							<h1>Missions</h1>
							<Mission text={"Enjoy the view of the iceberg from the favourite lookout. Enjoy the view of the iceberg from the favourite lookout."}/>

							<Mission text={"Find the missing leg for 'big bug'"}/>
						</div>
					</>

				)
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
			case AVAILABLE_GAME_STATUSES.JOINING:
				return (
					<h1 className='name'>Joining...</h1>
				)
		}
	}

	const getCameraView = () => {
		return (
			<Camera />
		)
	}

	const getGameView = () => {
		switch (currentView) {
			case AVAILABLE_VIEWS.CAMERA:
				return getCameraView();
			case AVAILABLE_VIEWS.CONTENT:
				return (
					<Container className="game-container">
						{getPageBody()}
					</Container>
				)
		}
	}

	return (
		<div className="game">
			<Nav leaveGame={props.leaveGame} />
			{getGameView()}
		</div>
	)
}

export default Game;
