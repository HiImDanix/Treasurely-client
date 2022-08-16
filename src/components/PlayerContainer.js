import Leaderboard from "./Leaderboard";
import Groups from "./Groups";
import Activity from "./Activity";

const PlayerContainer = (props) => {
	return (
		<div className="content-container center-tab">
			<Leaderboard players={props.players}/>
			<Groups groups={props.players} missions={props.missions}/>
			<Activity />

		</div>
	)
}

export default PlayerContainer;
