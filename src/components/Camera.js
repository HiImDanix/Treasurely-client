import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import {GAMES_URL} from "../Api";

const Task = (props) => {
	const [camera, setCamera] = useState(false);

	return (
		<div id="reader" width="600px"></div>
	);
};

export default Task;
