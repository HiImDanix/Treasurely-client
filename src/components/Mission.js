
const Mission = (props) => {
	return (
		<div className="mission-card" onClick={() => alert("Open task page")}>
			<i class="cursor bi bi-cursor-fill"></i>
			<div className="mission-text">{props.text}</div>
			<i className="bi-chevron-compact-right mission-chevron ml-auto-p2"></i>
		</div>
	)
}

export default Mission;
