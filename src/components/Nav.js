import {Container } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import LeaveButton from './LeaveButton';

const Nav = (props) => {
	return (
		<Navbar className="nav">
			<Container>
				<Navbar.Brand style={{cursor: "default"}}>
					<h2 className="nav-logo logo">Treasurely</h2>
				</Navbar.Brand>
				<LeaveButton handleClick={props.leaveGame}/>
			</Container>
		</Navbar>
	)
}

export default Nav;
