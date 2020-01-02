import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Blockies from 'react-blockies'
import { Link } from 'react-router-dom'

export default function FolderList({ avatars }) {
	return (
		<List
			style={{
				maxWidth: 360,
				backgroundColor: '#c2c2c2',
				margin: '35px auto 0',
				width: '100%',
				borderRadius: 5,
			}}
		>
			{avatars.map(avatar => (
				<ListItem key={avatar.id}>
					<ListItemAvatar>
						<Avatar>
							<Blockies seed={avatar.avatar} />
						</Avatar>
					</ListItemAvatar>
					<Link
						to={`/call/${avatar.id}`}
						style={{ textDecoration: 'none', color: '#444' }}
					>
						<ListItemText primary={avatar.avatar} secondary={avatar.id} />
					</Link>
				</ListItem>
			))}
		</List>
	)
}
