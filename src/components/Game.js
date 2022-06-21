import { useState, useEffect } from 'react';
import {Link, useLocation} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import {GAMES_URL, GAME_START_PATH, PLAYERS_URL} from "../Api";
import NameEnter from "./NameEnter";
import Task from "./Task";


const Game = () => {
	let location = useLocation();

	const states = {
		NOT_STARTED: "NOT_STARTED",
		IN_PROGRESS: "IN_PROGRESS",
		PAUSED: "PAUSED",
		FINISHED: "FINISHED"
	}

	const data = location.state;

	const [name, setName] = useState("");

	const [playerSessionID, setPlayerSessionID] = useState(localStorage.getItem('PLAYER_SESSION_ID'));

	const [status, setStatus] = useState(data.status);

	useEffect(() => {
		if (playerSessionID) {
			fetch(`${PLAYERS_URL}?
				${new URLSearchParams({player_session_id: playerSessionID})}`)
				.then(async response => {
					console.log(response);
					if (response.ok) {
						const player = await response.json();
						setName(player.name);
						setPlayerSessionID(player.playerSessionID);
					} else {
						console.log("Previous game not found");
					}
				} ).catch(error => {
				console.log("Failed to join previous game");
				})
			}
		} , []
	);

	const startGame = async () => {
		const requestOptions = {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
		}

		await fetch(`${GAMES_URL}/${data.id}` + GAME_START_PATH,
			requestOptions)
			.then(response => {
				console.log(response);
				if (response.ok) {
					console.log("started")
				}
			}).catch(error => {
				console.log(error);
			})
	}

	const getUpdates = async () => {
		if (name === "") {
			return;
		}

		await new Promise(resolve => setTimeout(resolve, 1000));

		let response = await fetch(GAMES_URL + "?" + new URLSearchParams({ code: data.code}))

		if (response.status === 502) {
			// Status 502 is a connection timeout error,
			// may happen when the connection was pending for too long,
			// and the remote server o a proxy closed it
			// let's reconnect
			await getUpdates();
		} else if (response.status !== 200) {
			// An error - let's show it
			console.log(response.statusText);
			// Reconnect in one second
			await getUpdates();
		} else {
			let data = await response.json();
			setStatus(data.status);

			await getUpdates();
		}
	}

	useEffect(() => {
		getUpdates();
	}, [name]);

	const getContent = () => {
		if (name === "") {
			return (
				<NameEnter 
					data={data}
					confirm={setName}
				/>
			)
		} else {
			switch (status) {
				case states.NOT_STARTED:
					return (
						(
							<div className="game-players">
								{/*showPlayers()*/}
								<Button 
									className="white"
									onClick={startGame}
								>Start game</Button>
							</div>
						)
					)
				case states.IN_PROGRESS:
					return (<div><Task player_session_id={playerSessionID} /></div>)

				case states.PAUSED:
					return (
						<div>
							<p>PAUSED</p>
						</div>
					)
				case states.FINISHED:
					return (
						<div>
							<p>FINISHED</p>
						</div>
					)
			}

		}   
	}


	return (
		<div className="game">
			<Navbar className="nav">
				<Container>
					<Navbar.Brand style={{cursor: "default"}}>
						<h2 className="nav-logo">Treasurely</h2>
					</Navbar.Brand>
					<Navbar.Text>
						<Link className={"link-light"} to="/">Quit</Link>
					</Navbar.Text>
				</Container>
			</Navbar>

			{getContent()}

		</div>
	)
}

export default Game;
