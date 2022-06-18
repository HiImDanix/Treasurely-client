

const Login = () => {
    const logo = <h2 className="logo">Treasurely</h2>;

    const joinGame = async (game_code) => {
        console.log(game_code);
        await fetch('http://192.168.0.210:8080/games?' + new URLSearchParams({ code: game_code }), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    let joinBtn = document.querySelector(".login-card button")
                    joinBtn.disabled = true;
                    joinBtn.style.opacity = 0.2;
                    joinBtn.innerHTML = 'Joined';
                    joinBtn.style.cursor = 'not-allowed';

                    return response.json();
                } else if (response.status === 404) {
                    alert("You entered an invalid game code.");
                }

            })
            .then(data => {
                console.log(data);
            }).catch(error => {
                console.log(error);
            });
    }

    return (
        <div className="login-page">
            {logo}
            <div className="login-card">
                <input type="text" placeholder="Game Code" defaultValue={"EJ4K3"} />
                <button onClick={() => joinGame(
                    document.querySelector('.login-card input').value
                )}>Join Game</button>
            </div>
        </div>
    );
}

export default Login;

