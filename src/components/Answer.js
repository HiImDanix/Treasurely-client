import { useState } from "react";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";

const Answer = (props) => {

	const [value, setValue] = useState("");

	const handleChange = (event) => {
		setValue(event.target.value);
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
			<Button className="button-default" onClick={(v) => props.handleAnswer(v)}>
				Appraise
			</Button>
		</div>
	);
};

export default Answer;
