import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';

const LeaveButton = (props) => {
	return (
		<div>
			<Navbar.Text>
				<Link onClick={props.handleClick} className={"link-light"} to="/">
					<i className="me-2 bi bi-box-arrow-left"></i>
					Leave
				</Link>
			</Navbar.Text>
		</div>
	)
}

export default LeaveButton;
