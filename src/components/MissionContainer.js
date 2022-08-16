import Mission from "./Mission";

const MissionContainer = (props) => {
	return (
			<div className="content-container center-tab">
				<h1>Missions</h1>
				<div className="mission-status">
					<i className="bi bi-check2"></i>
					<p>?/{props.missions.length} missions completed</p>
					<p className="mission-status-points">?/? pts</p>
				</div>
				<div className="missions">
					{props.missions.map((mission, missionId) => {
						return <Mission key={missionId} text={mission.description} />
					})}
				</div>
			</div>
	)
}

export default MissionContainer;
