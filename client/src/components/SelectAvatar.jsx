import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
// import PersonIcon from '@material-ui/icons/Person'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'

function AvatarDialog(props) {
	const { onClose, selectedValue, open, avatars } = props

	const handleClose = () => {
		onClose(selectedValue)
	}

	const handleListItemClick = value => {
		onClose(value)
	}

	return (
		<Dialog
			onClose={handleClose}
			aria-labelledby="simple-dialog-title"
			open={open}
		>
			<DialogTitle id="simple-dialog-title">
				Avatars found in your wallet :
			</DialogTitle>
			<List>
				{avatars.map(avatar => (
					<ListItem
						button
						onClick={() => handleListItemClick(avatar.symbol)}
						key={avatar.symbol}
					>
						<Link to="/call">
							<ListItemAvatar>
								<Avatar>{/* <PersonIcon /> */}</Avatar>
							</ListItemAvatar>
							<ListItemText primary={avatar.symbol} />
						</Link>
					</ListItem>
				))}
			</List>
		</Dialog>
	)
}

AvatarDialog.propTypes = {
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	selectedValue: PropTypes.string.isRequired,
	avatars: PropTypes.array.isRequired,
}

export default function SelectAvatar({ avatars }) {
	console.log(avatars[0])
	const [open, setOpen] = React.useState(false)
	const [selectedValue, setSelectedValue] = React.useState(avatars[0].symbol)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = value => {
		setOpen(false)
		setSelectedValue(value)
	}

	return (
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
				avatars={avatars}
			/>
		</div>
	)
}
