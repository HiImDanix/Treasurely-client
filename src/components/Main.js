import {Container } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'
import {useState} from "react";
import Game from "./Game";
import Login from "./Login";
import Nav from "./Nav";

const Main = () => {

    // Player state
    const [username, setUsername] = useState(null);
    const [sessionID, setSessionID] = useState(null);

    if (!username) {
        return <Login setUsername={(username) => setUsername(username)} setSessionID={(sessionID) => setSessionID(sessionID)} />;
    } else {
        return <Game username={username} sessionID={sessionID} />;
    }
}

export default Main;
