import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import lightWallet from 'mvs-lightwallet'
import Container from '@material-ui/core/Container'
import AvatarDialog from './components/AvatarDialog'
import { Switch, Route } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import UsersList from './components/UsersList'
import Call from './components/Call'
import './App.css'

function App() {
	const [userAvatars, setUserAvatars] = useState([])
	const [onlineAvatars, setOnlineAvatars] = useState([])
	const [selectedValue, setSelectedValue] = useState(null)
	const [open, setOpen] = useState(false)

	// const [isLoading, setIsLoading] = useState(false)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = value => {
		setOpen(false)
		setSelectedValue(value)
	}
	let socket
	useEffect(() => {
		socket = io('https://localhost')
		if (selectedValue) {
			socket.emit('setAvatar', selectedValue)

			socket.on('offer', () => {
				console.log('Offer in APPJS')
			})
		}
		socket.on('offer', async offer => {
			console.log('OFFER IN APPJS')
		})
		const LightWallet = new lightWallet({ target: '*' })
		LightWallet.getAvatars()
			.then(avatars => {
				setSelectedValue(avatars[0].symbol)
				setUserAvatars(avatars)
			})
			.catch(console.error)

		socket.on('all-users', users => {
			let onlineUsersArray = []
			for (let user in users) {
				onlineUsersArray.push({ avatar: user, id: users[user] })
			}

			setOnlineAvatars([...onlineUsersArray])
		})
	}, [selectedValue])

	useEffect(() => {
		return () => {
			socket.emit('disconnect')
			socket.off()
		}
	}, [])

	return (
		<div className="App">
			<Container maxWidth="md">
				<h1>Video Chat Plugin</h1>
				{userAvatars.length ? (
					<div>
						<Typography variant="subtitle1">
							Selected: {selectedValue}
						</Typography>
						<br />
						<Button
							variant="outlined"
							color="primary"
							onClick={handleClickOpen}
						>
							Choose Your Avatar
						</Button>
						<AvatarDialog
							selectedValue={selectedValue}
							open={open}
							onClose={handleClose}
							avatars={userAvatars}
						/>
					</div>
				) : (
					'Loading'
				)}
				{onlineAvatars.length ? <UsersList avatars={onlineAvatars} /> : ''}
				<Switch>
					<Route path="/call/:remoteId" render={() => <Call>HEY</Call>} />
				</Switch>
			</Container>
		</div>
	)
}

export default App
