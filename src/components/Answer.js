import { useState } from "react";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import {GAMES_URL} from "../Api";

const Answer = (props) => {

	const [value, setValue] = useState("");

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	const handleAnswer = async () => {

		await fetch(`${GAMES_URL}/${props.gameID}/submit?
			${new URLSearchParams({qr_code: value, player_session_id: props.player_session_id})}`,
			{
				method: "POST"
			}
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

	return (
		<div className="answer">
			<h1 className="mb-4">Found a code?</h1>
			<div className="answer-input">
				<FormControl
					onChange={handleChange}
					value={value}
					className="field-default"
					placeholder="Code"
				/>
				<i className="bi bi-camera-fill answer-camera-btn" onClick={props.cameraToggleCallback}></i>
			</div>
			<Button className="button-default" onClick={handleAnswer}>
				Appraise
			</Button>
		</div>
	);
};

export default Answer;
