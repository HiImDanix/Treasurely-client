import {useState} from "react";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl"
import { gamesURL } from "../Api";

const NameEnter = (props) => {
	const [name, setName] = useState("");

	function handleChange(event) {
		setName(event.target.value);
	}

	const confirm = async () => {
		const requestOptions = {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: name, code: props.data.code })
		}

		await fetch(gamesURL + "/" + props.data.id + "/join?", 
			requestOptions)
			.then(response => {
				console.log(response)
			}).catch(error => {
				console.log(error);
			})
	}

	return (
		<div className="name-enter">
			<h2 className="name-title">Enter your name</h2>

			<div className="name-card">
				<FormControl
					className="name-input"
					type="text" 
					value={name}
					onChange={handleChange}
				/>
				<Button 
					className="name-button" 
					onClick={confirm}
				>
					Confirm	
				</Button>

			</div>
		</div>
	)
}

export default NameEnter;
