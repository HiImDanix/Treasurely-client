import {useState} from "react";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import {GAMES_URL } from "../Api";
import Nav from "./Nav";

const JoinGame = (props) => {
	const [name, setName] = useState("");

	function handleChange(event) {
		setName(event.target.value);
	}

	const joinGame = async () => {
		if (name !== "") {
			await fetch(`${GAMES_URL}/${props.gameID}/player?
				${new URLSearchParams({name: name, code: props.gameCode})}`, {
					method: "POST"

				}).then(async response => {

					if (response.ok) {
						const player = await response.json();
						localStorage.setItem('PLAYER_SESSION_ID', player.playerSessionID);
						props.setSessionID([player.playerSessionID]);
						props.setUsername(name);
					}

				}).catch(error => {
					console.log(error);

				})

		} else {
			alert("Name cannot be empty");
		}
	}

	return (
		<div className="center">
			<h1 className="name-title">What shall we call you?</h1>

			<div className="card">
				<FormControl
					className="field-default"
					value={name}
					onChange={handleChange}
					placeholder={"Nickname"}
				/>
				<Button 
					className="button-default" 
					onClick={joinGame}
				>
					Let's go!
				</Button>

			</div>
		</div>
	)
}

export default JoinGame;
