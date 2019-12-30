import React from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
// import PersonIcon from '@material-ui/icons/Person'
import { Link } from 'react-router-dom'
import Blockies from 'react-blockies'

export default function AvatarDialog(props) {
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
				Avatars found in your wallet:
			</DialogTitle>
			<List>
				{avatars.map(avatar => (
					<ListItem
						button
						onClick={() => handleListItemClick(avatar.symbol)}
						key={avatar.symbol}
					>
						<ListItemAvatar>
							<Avatar>
								<Blockies seed={avatar.symbol} />
							</Avatar>
						</ListItemAvatar>
						<Link
							to="/call"
							style={{ color: '#444', textDecoration: 'none' }}
						>
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
