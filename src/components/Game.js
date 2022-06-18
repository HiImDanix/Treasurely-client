import {useState} from "react";
import { useLocation } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import NameEnter from "./NameEnter";

const Game = () => {
	let location = useLocation();

	const data = location.state;

	const [name, setName] = useState("");

	console.log(data)

	console.log(name)

	return (
		<div className="game">
			<Navbar className="nav">
				<Container>
					<Navbar.Brand href="/">
						<h2 className="nav-logo">Treasurely</h2>
					</Navbar.Brand>
					<h4>{data.name}</h4>
				</Container>
			</Navbar>

			{name === "" ? (
				<NameEnter 
					data={data}
					confirm={setName}
				/>
			) 
			: (
				<p>players</p>
			)}

		</div>
	)
}

export default Game;
