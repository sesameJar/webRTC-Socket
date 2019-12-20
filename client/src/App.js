import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import lightWallet from 'mvs-lightwallet'
import Container from '@material-ui/core/Container'
import AvatarDialog from './components/AvatarDialog'
import { Router, Switch, Route } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import './App.css'

function App() {
	const [userAvatars, setUserAvatars] = useState([])
	const [selectedValue, setSelectedValue] = React.useState(null)
	const [open, setOpen] = React.useState(false)
	// const [isLoading, setIsLoading] = useState(false)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = value => {
		setOpen(false)
		setSelectedValue(value)
	}

	useEffect(() => {
		const LightWallet = new lightWallet({ target: '*' })
		LightWallet.getAvatars()
			.then(avatars => {
				setUserAvatars(avatars)
				setSelectedValue(avatars[0].symbol)
			})
			.catch(console.error)
		const socket = io('https://localhost')
		socket.on('all-users', users => {
			console.log(users)
		})

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
				<Switch>
					<Route path="/call" render={() => <div>HEY</div>} />
				</Switch>
			</Container>
		</div>
	)
}

export default App
