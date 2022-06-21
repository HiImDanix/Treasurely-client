import { useState } from "react";
import { QrReader } from "react-qr-reader";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl"


const Task = (props) => {
	const [camera, setCamera] = useState(false);

	const [value, setValue] = useState("");

	const handleChange = (event) => {
		setValue(event.target.value);
	}

	const checkValue = () => {
		if (value === props.currentTask.qrCodeValue) {
			console.log("next task")
			props.nextTask();
		}
	}

	const handleClick = () => {
		setCamera(prevCamera => !prevCamera);
	}

	return (
		<div className="task">
			<p className="task-hint">Hint: {props.currentTask.qrCodeValue}</p>
			<FormControl onChange={handleChange} value={value} className="task-field" placeholder="Answer"/>
			<Button className="task-checkButton" onClick={checkValue}>Check answer</Button>
			<Button onClick={handleClick} className="task-cameraButton">
				{camera ? "Disable camera" : "Enable camera"}
			</Button>
			{camera && (<QrReader 
				className="task-camera"
				onResult={(result, error) => {
					if (!!result) {
						setValue(result?.text);
						checkValue();
					}

					if (!!error) {
						console.info(error);
					}
				}}
				constraints={{
					facingMode: 'environment'
				}}
			/>
			)}
		</div>
	)
}

export default Task;
