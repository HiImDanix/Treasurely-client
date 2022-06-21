import {useState} from "react";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl"
import { GAMES_URL } from "../Api";
import async from "async";

const NameEnter = (props) => {
	const [name, setName] = useState("");

	function handleChange(event) {
		setName(event.target.value);
	}

	const joinGame = async () => {

		await fetch(`${GAMES_URL}/${props.data.id}/player?
			${new URLSearchParams({name: name, code: props.data.code})}`, {
			method: "POST"
		})
			.then(async response => {
				if (response.ok) {
					const player = await response.json();
					console.log(player);
					localStorage.setItem('PLAYER_SESSION_ID', player.playerSessionID);
					props.confirm(name);
				}
			}).catch(error => {
				console.log(error);
			})
	}

	return (
		<div className="name-enter">
			<h1 className="name-title">What shall we call you?</h1>

			<div className="name-card">
				<FormControl
					className="name-input"
					value={name}
					onChange={handleChange}
					placeholder={"Nickname"}
				/>
				<Button 
					className="name-button" 
					onClick={joinGame}
				>
					Let's go!
				</Button>

			</div>
		</div>
	)
}

export default NameEnter;
