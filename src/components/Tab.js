import { useState } from "react";

const Tab = (props) => {
	const [animation, setAnimation] = useState("none");

	const tabStyle = {
		width: 60,
		gap: 20
	}

	const selectedStyle = {
		left: `calc(50% + (${props.currentView * (tabStyle.width + tabStyle.gap) 
				+ tabStyle.width * 0.5}px - ${tabStyle.width * 2.5 + tabStyle.gap * 2}px))`,
		"--tab-selected-width": `${tabStyle.width + 100}px`,
		animationName: animation
	};

	const handleClick = (view) => {
		setAnimation("stretch");
		props.setCurrentView(view);
	}

	return (
		<div 
			style={ {"--button-width": `${tabStyle.width}px`, "--tab-gap": `${tabStyle.gap}px`} } 
			className="tab"
		>
			<div className="tab-selected" style={selectedStyle} onAnimationEnd={() => setAnimation("none")}></div>

			<button onClick={() => handleClick(props.AVAILABLE_VIEWS.INFO)}>
				<i className="bi bi-info-lg"></i>
			</button>

			<button onClick={() => handleClick(props.AVAILABLE_VIEWS.HOME)}>
				<i className="bi bi-house-door-fill"></i>
			</button>

			<button className="tab-camera" onClick={props.toggleCamera}>
				{
					props.camera ? <i className="bi bi-chevron-down"></i> :
						<div className="tab-camera-icons">
							<i className="bi bi-camera-fill"></i>
							<i className="bi bi-chevron-up"></i>
						</div>
				}
			</button>

			<button onClick={() => handleClick(props.AVAILABLE_VIEWS.PLAYERS)}>
				<i className="bi bi-people-fill"></i>
			</button>

			<button onClick={() => handleClick(props.AVAILABLE_VIEWS.SETTINGS)}>
				<i className="bi bi-gear-fill"></i>
			</button>

		</div>
	)
}

export default Tab;
