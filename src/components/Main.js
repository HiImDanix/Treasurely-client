import {useState} from "react";
import Game from "./Game";
import Login from "./Login";
import { PLAYERS_URL } from "../Api";

const Main = () => {

	// Player state
	const [username, setUsername] = useState("");
	const [sessionID, setSessionID] = useState("");

	const leaveGame = async () => {
		if (sessionID !== "") {
			await fetch(`${PLAYERS_URL}/${sessionID}`, {
					method: "DELETE"
				}).then(async response => {

					if (response.ok) {
						setUsername("")
						setSessionID("")
					}

				}).catch(error => {
					console.log(error);

				})
		}
	}

	console.log("Render")

	if (username === "") {
		return (
			<div>
				<Login 
					setUsername={(username) => setUsername(username)} 
					setSessionID={(sessionID) => setSessionID(sessionID)} 
					leaveGame={leaveGame}
				/>
			</div>
		)
	} else {
		return (
			<Game 
				username={username} 
				sessionID={sessionID} 
				leaveGame={leaveGame}
			/>
		)
	}
}

export default Main;
