import { Container } from "react-bootstrap"

const Leaderboard = (props) => {
	const getContent = () => {
		// TODO sort based on points
		return props.players.map((player, playerID)=> {
			return (
				<div key={playerID} className="leaderboard-team">
					<i className="bi bi-emoji-laughing"></i>
					<p>{player.name}</p>
					<p className="leaderboard-team-points">?</p>
				</div>
			)
		})
	}

	return (
		<Container>
			<h1>Leaderboard</h1>
			<div className="leaderboard-teams">
				{getContent()}
			</div>
		</Container>
	)
}

export default Leaderboard;
