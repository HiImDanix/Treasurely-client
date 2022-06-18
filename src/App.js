import './App.scss';
import Game from './components/Game';
import Login from './components/Login';
import {BrowserRouter, Routes, Route} from "react-router-dom";


function App() {
	return (
		<div className='App'>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path=":id" element={<Game />} />
				</Routes>
			</BrowserRouter>

		</div>
	);
}

export default App;
