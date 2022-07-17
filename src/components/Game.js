import {useEffect, useState} from 'react';
import Button from "react-bootstrap/Button";
import {GAMES_URL, PLAYERS_URL, GAME_START_PATH} from "../Api";
import Camera from "./Camera";
import Nav from "./Nav";
import Answer from "./Answer";
import Mission from "./Mission";
import { Container } from 'react-bootstrap';
import Tab from './Tab';

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

	// Camera states
	const [camera, setCamera] = useState(false);
	const [cameraAnimation, setCameraAnimation] = useState("float");

	const toggleCamera = () => {
		if (camera) {
			hideCamera();
		} else {
			setCameraAnimation("float");
			setCamera(true);
		}
	}

	const hideCamera = async () => {
		setCameraAnimation("unfloat");
		await new Promise(r => setTimeout(r, 300));
		setCamera(false);
	}

	// VIEWS
	const AVAILABLE_VIEWS = {
		INFO: "0",
		HOME: "1",
		PLAYERS: "3",
		SETTINGS: "4"
	};

	const [currentView, setCurrentView] = useState(AVAILABLE_VIEWS.INFO);

	useEffect(() => {
		hideCamera();
	}, [currentView]);

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

	const handleAnswer = async (value) => {

		await fetch(`${GAMES_URL}/${game.id}/submit?
			${new URLSearchParams({qr_code: value, player_session_id: props.sessionID})}`,
			{ method: "POST" }
			).then(async response => {
				console.log(response);

				if (response.ok) {
					const resp = await response.text();

					if (resp === "true") {
						alert("Correct!");
					} else {
						alert("Wrong");
					}

				} else {
					alert("Error. Already answered or could not submit.");
				}

		}).catch(error => {
			console.log(error);
		})
	};

	// Run game loop
	useEffect(() => {
		const interval = setInterval(function run() {

			// Has to be a nested function because run cannot be async
			async function updateGame(){
				let response = await fetch(`${PLAYERS_URL}/${props.sessionID}/game`);

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
						<div className="center">
							<h2>Players:</h2>
							{getPlayersList()}
							<Button
								onClick={handleStartGameButton}
								style={{color: "white", margin: "30px"}}
							>Start game</Button>
						</div>
					)
				)
			case AVAILABLE_GAME_STATUSES.IN_PROGRESS:
				return (
					<div>
						{
							camera && <Camera 
								animation={cameraAnimation}
							/>
						}
						{getGameView()}
						<Tab 
							toggleCamera={toggleCamera}
							camera={camera}
							currentView={currentView}
							setCurrentView={(view) => setCurrentView(view)}
							AVAILABLE_VIEWS={AVAILABLE_VIEWS}
						/>
					</div>
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
					<h1 className="joining">Joining...</h1>
				)
		}
	}

	const getGameView = () => {
		switch (currentView) {
			case AVAILABLE_VIEWS.INFO:
				return (
					<p className='center center-tab'>info</p>
				)
			case AVAILABLE_VIEWS.HOME:
				return (
					<div className="center center-tab">
						{/*
						<div className="mt-2 answer-container">
							<Answer
								player_session_id={props.sessionID}
								gameID={game.id}
								cameraToggleCallback={() => {setCurrentView(AVAILABLE_VIEWS.CAMERA)}}
								handleAnswer={handleAnswer}
							/>
						</div>
						*/}
						<div className="mt-4 mission-container">
							<h1>Missions</h1>
							{game.missions.map((mission, missionId) => <Mission key={missionId} text={mission.description}/>)}
						</div>
					</div>
				)
			case AVAILABLE_VIEWS.PLAYERS:
				return (
					<p className='center center-tab'>players</p>
				)
			case AVAILABLE_VIEWS.SETTINGS:
				return (
					<p className='center center-tab'>settings</p>
				)
		}
	}

	return (
		<div className="game">
			<Nav leaveGame={props.leaveGame} />
			<Container className="game-container">
				{getPageBody()}
			</Container>
		</div>
	)
}

export default Game;
