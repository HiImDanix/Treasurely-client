import {Html5QrcodeScanner} from "html5-qrcode";
import {useEffect} from "react";
import { QrReader } from "react-qr-reader";

const Camera = (props) => {

	function submitAnswer(answer) {
		props.goBack();
		props.handleAnswer(answer);
	}

	useEffect(() => {
		let html5QrcodeScanner = new Html5QrcodeScanner(
			"reader",
			{ fps: 10, qrbox: {width: 250, height: 250} },
			false);
		html5QrcodeScanner.render(submitAnswer, false);

		return () => html5QrcodeScanner.clear();
	}, []);

	return (
		<div className="center-tab camera" style={ {animationName: props.animation} }>
			<div id="reader" className="camera-reader"></div>
			{/*
			<QrReader 
				className="camera-reader"
				videoStyle={{
					objectFit: "cover",
					borderRadius: "10px"
				}}
				onResult={(result, error) => {
					if (!!result) {
						console.log(result)
					}
				}}
			/>

*/}
			<button className="camera-input">
				<i className="bi bi-alt"></i>
			</button>
		</div>
	)
}

export default Camera;
