import Group from "./Group";
import Container from "react-bootstrap/Container";

const Groups = (props) => {
	return (
		<Container>
			<h1>Groups</h1>
			<div className="groups">
				{props.groups.map((group, groupID) => {
					return <Group group={group} missions={props.missions} key={groupID}/>
				})}
			</div>
		</Container>
	)
}

export default Groups;
