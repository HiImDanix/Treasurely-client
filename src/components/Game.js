import {useEffect, useState} from 'react';
import {Container} from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import {GAMES_URL, PLAYERS_URL, GAME_START_PATH} from "../Api";
import Camera from "./Camera";
import Nav from "./Nav";
import Answer from "./Answer";
import Mission from "./Mission";

const Game = (props) => {
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
		status: AVAILABLE_GAME_STATUSES.JOINING,
	});

	const playerSessionID = props.sessionID;

	// VIEWS
	const AVAILABLE_VIEWS = {
		CAMERA: "CAMERA",
		CONTENT: "CONTENT"
	};

	const [currentView, setCurrentView] = useState(AVAILABLE_VIEWS.CONTENT);

	console.log("Render");


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

	// Run game loop
	useEffect(() => {
		const interval = setInterval(function run() {

			// Has to be a nested function because run cannot be async
			async function updateGame(){
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

					if (JSON.stringify(data) !== JSON.stringify(game)) {
						setGame(data);
					}
				}
			}

			updateGame();

			return run;
		}(), 1000); // 1000 ms 

		return () => clearInterval(interval);
	}, [game]);

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
					<h1 className='joining'>Joining...</h1>
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
