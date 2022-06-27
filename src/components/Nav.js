import {Container } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'

const Nav = () => {
	return (
		<Navbar className="nav">
			<Container>
				<Navbar.Brand style={{cursor: "default"}}>
					<h2 className="nav-logo logo">Treasurely</h2>
				</Navbar.Brand>
				<Navbar.Text>
					<Link className={"link-light"} to="/">
						<i className="nav-leave bi bi-box-arrow-left"></i>
						Leave
					</Link>
				</Navbar.Text>
			</Container>
		</Navbar>
	)
}

export default Nav;
