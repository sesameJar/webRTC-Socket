import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import lightWallet from 'mvs-lightwallet'
import Container from '@material-ui/core/Container'
import SelectAvatar from './components/SelectAvatar'
import { Router, Switch, Route } from 'react-router-dom'
import './App.css'

function App() {
	const [userAvatars, setUserAvatars] = useState([])
	// const [isLoading, setIsLoading] = useState(false)
	useEffect(() => {
		console.log('Loading')
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
			<Router>
				<Container maxWidth="md">
					<h1>Video Chat Plugin</h1>
					{userAvatars.length ? (
						<SelectAvatar avatars={[...userAvatars]} />
					) : (
						'Loading'
					)}
				</Container>
			</Router>
		</div>
	)
}

export default App
