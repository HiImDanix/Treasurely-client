import { useState } from "react";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import {GAMES_URL} from "../Api";
import Camera from "./Camera";

const Task = (props) => {

	const [value, setValue] = useState("");

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	const handleAnswer = async () => {

		await fetch(`${GAMES_URL}/${props.gameID}/submit?
			${new URLSearchParams({qr_code: value, player_session_id: props.player_session_id})}`,
			{
				method: "POST"
			})
			.then(async response => {
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

	return (
		<div className="task">
			<h1 className="mb-4">Found a code?</h1>
			<div className="task-input">
				<FormControl
					onChange={handleChange}
					value={value}
					className="task-field"
					placeholder="Code"
				/>
				<i className="bi bi-camera-fill task-camera-btn" onClick={props.cameraToggleCallback}></i>
			</div>
			<Button className="validate-code-btn w-100" onClick={props.cameraToggleCallback}>
				Appraise
			</Button>
		</div>
	);
};

export default Task;
