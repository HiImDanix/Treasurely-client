import {useEffect, useRef, useState} from "react";
import Button from "react-bootstrap/Button";
import {Html5QrcodeScanner} from "html5-qrcode"

const Camera = (props) => {

	function submitAnswer(answer) {
		props.goBack();
		props.handleAnswer(answer);
	}

	useEffect(() => {
		let html5QrcodeScanner = new Html5QrcodeScanner(
			"reader",
			{ fps: 10, qrbox: {width: 250, height: 250} },
			/* verbose= */ false);
		html5QrcodeScanner.render(submitAnswer, /* verbose= */ false);
	}, []);

	return (
		<div className="game-container">
			<Button variant="primary" className="w-100" onClick={props.goBack}>
				Go Back
			</Button>
			<div className="camera">
				<div id="reader"></div>
			</div>
		</div>
	)
}

export default Camera;
