import { useState } from "react";
import { QrReader } from "react-qr-reader";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import {GAMES_URL} from "../Api";
import {useLocation} from "react-router-dom";

const Task = (props) => {
	const [camera, setCamera] = useState(false);

	const [value, setValue] = useState("");

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	let location = useLocation();
	const data = location.state;

	const handleAnswer = async () => {

		await fetch(`${GAMES_URL}/${data.id}/submit?
			${new URLSearchParams({qr_code: value})}`,
			{
				method: "POST"
			})
			.then(response => {
				console.log(response);
				if (response.ok) {
					alert("Correct!");
				} else {
					alert("Incorrect!");
				}
			}).catch(error => {
				console.log(error);
			})
	};

	const toggleCamera = () => {
		setCamera(camera => !camera);
	};

	return (
		<div className="task">
			<FormControl
				onChange={handleChange}
				value={value}
				className="task-field"
				placeholder="Answer"
			/>
			<Button className="task-checkButton" onClick={handleAnswer}>
				Check answer
			</Button>
			<Button onClick={toggleCamera} className="task-cameraButton">
				{camera ? "Disable camera" : "Enable camera"}
			</Button>
			{camera && (
				<QrReader
					className="task-camera"
					onResult={(result, error) => {
						setValue(result?.text);
						handleAnswer()
					}}
				/>
			)}
		</div>
	);
};

export default Task;
