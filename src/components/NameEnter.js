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
		}

		await fetch(`${gamesURL}/${props.data.id}/join?
			${new URLSearchParams({name: name, code: props.data.code})}`,
			requestOptions)
			.then(response => {
				console.log(response);
				if (response.ok) {
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
					onClick={confirm}
				>
					Let's go!
				</Button>

			</div>
		</div>
	)
}

export default NameEnter;
