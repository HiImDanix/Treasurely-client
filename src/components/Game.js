import { useState } from 'react';
import {Link, useLocation} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import {Container } from 'react-bootstrap'
import {GAMES_URL, GAME_START_PATH, PLAYERS_URL} from "../Api";
import JoinGame from "./JoinGame";
import Task from "./Task";
import Camera from './Camera';

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
	const [gameID, setGameID] = useState(propsGame.id);
	const [gameCode, setGameCode] = useState(propsGame.code);
	const [gameStatus, setGameStatus] = useState(propsGame.status);

	const [players, setPlayers] = useState(propsGame.players);

	// try to join the game with the player's session ID that is stored in local storage.
	const joinExistingGame = () => {
		if (playerSessionID) {
			fetch(`${PLAYERS_URL}?
				${new URLSearchParams({player_session_id: playerSessionID})}`)
				.then(async response => {
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
		await fetch(`${GAMES_URL}/${gameID}` + GAME_START_PATH,
			{
				method: "POST"
			})
			.then(response => {
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

		let response = await fetch(GAMES_URL + "?" + new URLSearchParams({ code: gameCode}))

		if (response.status === 502) {
			await executeGameLoop(); // Status 502 is a connection timeout error
		} else if (response.status !== 200) {
			// An error - let's show it
			console.log(response.statusText);
			// Reconnect in one second
			await executeGameLoop();
		} else {
			// update local game state
			let game = await response.json();

			console.log(game)
			if (game.status && gameStatus != game.status) {
				setGameStatus(game.status);
			}

			if (players != game.players) {
				setPlayers(game.players);
			}

			await executeGameLoop();
		}
	};

	const getPlayersList = () => {
		return (
			<div className="players-list">
				{players.map(player => {
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

				<div className="mission-card" onClick={() => alert("Open task page")}>
					<i class="cursor bi bi-cursor-fill"></i>
					<div className="mission-text">Enjoy the view of the iceberg from the favourite lookout.Enjoy the view of the iceberg from the favourite lookout.</div>
					<i className="bi-chevron-compact-right mission-chevron ml-auto-p2"></i>
				</div>

				<div className="mission-card" onClick={() => alert("Open task page")}>
					<i class="cursor bi bi-cursor-fill"></i>
					<div className="mission-text">Find the missing leg for 'big bug'</div>
					<i className="bi-chevron-compact-right mission-chevron ml-auto-p2"></i>
				</div>
			</div>

		)
	}

	const getPageBody = () => {
		joinExistingGame();
		executeGameLoop();

		if (playerName === "") {
			return (
				<JoinGame
					gameCode={gameCode}
					gameID={gameID}
					setPlayerName={setPlayerName}
					setPlayerSessionID={setPlayerSessionID}
				/>
			)
		} else {
			switch (gameStatus) {
				case AVAILABLE_GAME_STATUSES.NOT_STARTED:
					return (
						(
							<div className="game-players">
								<h1 className="game-playersTitle">Players</h1>
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
						<div>
							<Task player_session_id={playerSessionID} gameID={gameID} />
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
			}

		}
	}

	const getPageHeader = () => {
		return <Navbar className="nav">
			<Container>
				<Navbar.Brand style={{cursor: "default"}}>
					<h2 className="nav-logo logo">Treasurely</h2>
				</Navbar.Brand>
				<Navbar.Text>
					<Link className={"link-light"} to="/">
						<i className="nav-leave bi bi-box-arrow-left"></i>
						Leave
					</Link>
				</Navbar.Text>
			</Container>
		</Navbar>
	}


	return (
		<div className="game">
			{getPageHeader()}
			<Container className="game-container">
				{playerName !== "" && getMissions()}
				{getPageBody()}
			</Container>

		</div>
	)
}

export default Game;
