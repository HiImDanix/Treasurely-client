import { useState } from "react";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import {GAMES_URL} from "../Api";

const Answer = (props) => {

	const [value, setValue] = useState("");

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	return (
		<>
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
			<Button className="task-btn" onClick={(v) => props.handleAnswer(v)}>
				Appraise
			</Button>
		</>
	);
};

export default Answer;
