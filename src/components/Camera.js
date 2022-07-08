import {useEffect, useRef, useState} from "react";
import Button from "react-bootstrap/Button";

const Camera = (props) => {
	const [open, setOpen] = useState(false);
	const ref = useRef();

	const handleChange = () => {
		setOpen(prevOpen => !prevOpen);
	}

	useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (open && ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", checkIfClickedOutside)

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [open])

	return (
		<div className="camera"
			style={open ? {right: "10px"} : {}}
			ref={ref}
		>
			<Button 
				className="camera-button" 
				onClick={handleChange}
			>
				<i className={`bi bi-chevron-compact-${open ? "right" : "left"}`}></i>
				<i className="bi bi-camera-fill"></i>
			</Button>
			{
				open && (
						<div
							className="camera-reader"
							videoStyle={{
								objectFit: "cover",
								borderRadius: "10px"
							}}
							onResult={(result, error) => {
								if (!!result) {
									props.setValue(result?.text);
									setOpen(false);
								}
							}}
							constraints={{
								facingMode: "environment"
							}}
						/>
				)
			}
		</div>
	)
}

export default Camera;
