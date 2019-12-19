import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import io from 'socket.io-client'
import lightWallet from 'mvs-lightwallet'
import './App.css'

function App() {
	const [userAvatars, setUserAvatars] = useState([])
	useEffect(() => {
		const LightWallet = new lightWallet({ target: '*' })
		LightWallet.getAvatars()
			.then(avatars => setUserAvatars(avatars))
			.catch(console.error)
		const socket = io('https://localhost')
		socket.on('all-users', users => {
			console.log(users)
		})

		return () => {
      socket.close()
      socket.off()
		}
	}, [])
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	)
}

export default App
