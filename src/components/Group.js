
const Group = (props) => {
	console.log(props)
	return (
		<div className="group">
			<i className="bi bi-emoji-laughing group-image"></i>

			<div className="group-info">
				<div className="group-players">
					<p className="group-name">{props.group.name}</p>
					<div className="group-playerNumber">
						<i className="bi bi-person-fill"></i>
						<p>?</p>
					</div>
				</div>

				<div className="group-missions">
					<i className="bi bi-check2"></i>
					<p>?/{props.missions.length} missions</p>
				</div>
			</div>

		</div>
	)
}

export default Group;
