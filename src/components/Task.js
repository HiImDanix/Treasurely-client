import { useState } from "react";
import { QrReader } from "react-qr-reader";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import {GAMES_URL} from "../Api";

const Task = (props) => {
	const [camera, setCamera] = useState(false);

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

	const toggleCamera = () => {
		setCamera(camera => !camera);
	};

	return (
		<div className="task" col>
			<div className="task-input">
				<FormControl
					onChange={handleChange}
					value={value}
					className="task-field"
					placeholder="Code"
				/>
				<i className="bi bi-camera-fill task-camera-btn" onClick={toggleCamera}></i>
			</div>
			<div className="qr-code-buttons">
				<Button className="validate-code-btn w-100" onClick={handleAnswer}>
					Appraise
				</Button>
			</div>
			{camera && (
				<QrReader
					className="task-camera"
					onResult={(result, error) => {
						if (!!result) {
							setValue(result?.text);
							handleAnswer()
						}

					}} constraints={{
						facingMode: "environment"
				}
				}
				/>
			)}
		</div>
	);
};

export default Task;
