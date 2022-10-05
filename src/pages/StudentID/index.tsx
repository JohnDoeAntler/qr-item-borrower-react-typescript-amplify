import Typography from "@mui/material/Typography";
import Header from "../../components/Header";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { BorrowRecord, Item } from "../../models";
import { DataStore } from "@aws-amplify/datastore";

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    background-color: rgba(256, 256, 256, 10%);
		color: white;
  }
`

type UserInfo = {
	userId: string;
	username: string;
}

const validateActions = {
	'borrow': (item: Item, info: UserInfo) => {
		return '';
	},
	'return': (item: Item, info: UserInfo) => {
		return [...item.record].sort((a, b) => (a as BorrowRecord).borrowedAt.localeCompare((b as BorrowRecord).borrowedAt) * -1).at(0)?.userId !== info.userId && 'Invalid action, the user id does not match with the borrower record.';
	},
};

const confirmActions = {
	'borrow': async (item: Item, info: UserInfo) => {
		return await DataStore.save(Item.copyOf(item, item => {
				// Update the values on {item} variable to update DataStore entry
				item.record = [...item.record, {
					...info,
					borrowedAt: new Date().toISOString(),
				}];
				return item;
		}));
	},
	'return': async (item: Item, info: UserInfo) => {
		/* Models in DataStore are immutable. To update a record you must use the copyOf function
		to apply updates to the item’s fields rather than mutating the instance directly */
		return await DataStore.save(Item.copyOf(item, item => {
			// Update the values on {item} variable to update DataStore entry
			const notReturned = item.record.find(e => e && !e.returnedAt);

			if (!notReturned) {
				throw new Error();
			}

			notReturned.returnedAt = new Date().toISOString();

			return item;
		}));
	},
};

const UserIdPage = () => {

	const [userId, setUserId] = useState('');
	const [username, setUsername] = useState('');
	const context = useContext(AppContext);
	const navigate = useNavigate();
	const [error, setError] = useState('');

	useEffect(() => {
		if (!context.item) {
			navigate('/');
		}
	}, [context.item]);

	const confirm = () => {
		if (!context.item) {
			setError('Unknown error, please try again later.');
			return;
		}

		if (userId.length !== 8) {
			setError('The length of user id should exactly equal 8 digits.');
			return;
		}

		if (!username.length) {
			setError('The username is required.');
			return;
		}

		const err = validateActions[context.mode](context.item, { userId, username });

		if (err) {
			setError(err);
			return;
		};

		confirmActions[context.mode](context.item, { userId, username })
			.then(e => {
				navigate('/success');
			})
			.catch(e => {
				setError(e);
			});
	}

	return (
		<div style={{
			width: '100%',
			minHeight: '100vh',
			display: 'flex',
			flexDirection: 'column',
		}}>
			<Header title="User ID"/>

			<div style={{ width: '90%', margin: '0 auto' }}>
				<Typography variant='h4' fontWeight={700}>Item information</Typography>

				<Typography variant='caption' fontWeight={200} lineHeight={1} color="lightgray">Nulla irure ipsum dolor ipsum eiusmod incididunt consectetur pariatur aliqua sit consectetur dolor incididunt nisi. Velit veniam do anim aliqua fugiat ea id nisi reprehenderit proident proident. Aliquip qui ullamco ullamco duis sint velit excepteur.</Typography>

				<hr style={{ borderColor: 'hsl(0, 0%, 60%)', borderTop: 0 }} />

				<Typography variant='h6' fontWeight={700}>Item name</Typography>

				<Typography variant='caption' fontWeight={200}>{context.item?.name || 'item name here'}</Typography>

				<hr style={{ borderColor: 'hsl(0, 0%, 60%)', borderTop: 0 }} />

				<Typography variant='h6' fontWeight={700}>Item description</Typography>

				<Typography variant='caption' fontWeight={200}>{context.item?.description || 'item description here'}</Typography>

				<hr style={{ width: 0, marginBottom: '1rem' }} />

				<Typography variant='h6' fontWeight={700} style={{ marginBottom: '.5rem' }}>Enter User ID to Proceed</Typography>

				<StyledTextField variant="filled" label="User ID" fullWidth value={userId} onChange={(e) => setUserId(e.currentTarget.value)}  style={{ marginBottom: '.5rem' }} />
				{context.mode === 'borrow' ? <StyledTextField variant="filled" label="Username" fullWidth value={username} onChange={(e) => setUsername(e.currentTarget.value)}  style={{ marginBottom: '.5rem' }} /> : <></> }

				<div>
						{error && 
							<>
								<Typography variant='caption' fontWeight={200} lineHeight={1} color="red" style={{ padding: '0 1rem' }}>
									{error}
								</Typography>

								<hr style={{ borderColor: 'hsl(0, 0%, 60%)', borderTop: 0 }} />

								<hr style={{ width: 0, marginTop: '1rem', marginBottom: '1rem' }} />
							</>
						}
				</div>

				<Typography variant='caption' fontWeight={200} lineHeight={1} color="lightgray">Nulla irure ipsum dolor ipsum eiusmod incididunt consectetur pariatur aliqua sit consectetur dolor incididunt nisi. Velit veniam do anim aliqua fugiat ea id nisi reprehenderit proident proident. Aliquip qui ullamco ullamco duis sint velit excepteur.</Typography>

				<div style={{ marginTop: '1rem' }}>
					<Button variant="contained" onClick={() => confirm()}>Confirm</Button>
				</div>
			</div>
		</div>
	);
}

export default UserIdPage;
