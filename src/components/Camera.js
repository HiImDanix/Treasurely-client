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
		<div style={{display: 'flex', flexDirection: 'column'}}>
			<Button variant="primary" onClick={props.goBack}>
				Go Back
			</Button>
			<div className="camera" style={{flexGrow:1}}>
				<div id="reader"></div>
			</div>
		</div>
	)
}

export default Camera;
