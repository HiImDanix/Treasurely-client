import { useState, useEffect } from 'react';
import {Link, useLocation} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import NameEnter from "./NameEnter";


const Game = () => {
	let location = useLocation();

	const data = location.state;

	const [name, setName] = useState(localStorage.getItem('CHOSEN_NAME'));

	useEffect(() => {
		const data = window.localStorage.getItem('CHOSEN_NAME');
		if ( data !== null ) setName(JSON.parse(data));
	}, []);

	useEffect(() => {
		window.localStorage.setItem('CHOSEN_NAME', JSON.stringify(name));
	}, [name])

	return (
		<div className="game">
			<Navbar className="nav">
				<Container>
					<Navbar.Brand style={{cursor: "default"}}>
						<h2 className="nav-logo">Treasurely</h2>
					</Navbar.Brand>
					<Navbar.Text>
						<Link className={"link-light"} to="/">Quit</Link>
					</Navbar.Text>
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
