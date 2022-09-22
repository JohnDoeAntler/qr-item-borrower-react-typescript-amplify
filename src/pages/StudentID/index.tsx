import Typography from "@mui/material/Typography";
import Header from "../../components/Header";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Item } from "../../models";
import { DataStore } from "@aws-amplify/datastore";

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    background-color: rgba(256, 256, 256, 10%);
		color: white;
  }
`

const validateActions = {
	'borrow': (item: Item, id: string) => {
		return '';
	},
	'return': (item: Item, id: string) => {
		return item.record?.studentId !== id && 'Invalid action, the student id does not match with the borrower record.';
	},
};

const confirmActions = {
	'borrow': async (item: Item, id: string) => {
		return await DataStore.save(Item.copyOf(item, item => {
				// Update the values on {item} variable to update DataStore entry
				item.record = {
					studentId: id,
					borrowedAt: new Date().toISOString(),
				};
				return item;
		}));
	},
	'return': async (item: Item, id: string) => {
		/* Models in DataStore are immutable. To update a record you must use the copyOf function
		to apply updates to the item’s fields rather than mutating the instance directly */
		return await DataStore.save(Item.copyOf(item, item => {
			// Update the values on {item} variable to update DataStore entry
			delete item.record;
			return item;
		}));
	},
};

const StudentIDPage = () => {

	const [value, setValue] = useState('');
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

		if (!value.startsWith('11')) {
			setError('The student id should have the prefix of "11".');
			return;
		}

		if (value.length !== 8) {
			setError('The length of student id should exactly equal 8 digits.');
			return;
		}

		const err = validateActions[context.mode](context.item, value);

		if (err) {
			setError(err);
			return;
		};

		confirmActions[context.mode](context.item, value)
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
			<Header title="Student ID"/>

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

				<Typography variant='h6' fontWeight={700} style={{ marginBottom: '.5rem' }}>Enter Student ID to Proceed</Typography>

				<StyledTextField variant="filled" label="Student ID" fullWidth value={value} onChange={(e) => setValue(e.currentTarget.value)}  style={{ marginBottom: '.5rem' }} />

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

export default StudentIDPage;
