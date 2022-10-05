import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import Header from "../../components/Header";
import Typography from "@mui/material/Typography";
import { DataStore, Predicates } from '@aws-amplify/datastore';
import { Item } from '../../models';
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const QRCodePage = () => {

	const context = useContext(AppContext);

  const [data, setData] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const [isValid, setValid] = useState(false);
	const [snackbar, setSnackbar] = useState('');

	useEffect(() => {
		context.setQRCode('');
	}, []);

	// fetch item if data is available
	useEffect(() => {
		if (data) {
			DataStore.query(Item, data).then((item) => {
				if (!item) {
					setSnackbar("Invalid QRCode has scanned, please try another.");
					return;
				}

				const isBorrowed = item.record.some(e => !e?.returnedAt);

				if (context.mode === 'borrow' !== !isBorrowed) {
					const opposite = context.mode === 'borrow' ? 'return' : 'borrow';
					setSnackbar(`This item could not be ${context.mode}ed since it has not been ${opposite}ed yet.`);
					return;
				}

				context.setItem(item);
				setValid(true);
			});
		}
	}, [data]);

	useEffect(() => {
		if (data && isValid) {
			context.setQRCode(data);
			navigate('/user-id');
		}
	}, [data, isValid]);

	return (
		<div style={{
			width: '100%',
			minHeight: '100vh',
			display: 'flex',
			flexDirection: 'column',
		}}>
			<Header title="QR Code" />
			<div style={{
				width: '100%',
				height: '100%',
				flex: 'auto',
				display: 'flex',
				gap: '1rem',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}>

				<Typography variant='caption' style={{ width: '90%', textAlign: 'center' }}>Please put your phone right on top of the QR code.</Typography>

				<hr style={{ width: '90%', borderColor: 'hsl(0, 0%, 60%)', borderTop: 0 }} />

				<QrReader
					constraints={{
						facingMode: 'environment',
					}}
					scanDelay={0}
					onResult={(result, error) => {
						if (!!result) {
							setData(result.getText());
						}

						if (!!error) {
							setError(error.message);
						}
					}}
					containerStyle={{
						width: '100%'
					}}
					videoStyle={{
						width: '100%'
					}}
				/>

				{error && `Error: ${error}`}

				<Snackbar
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={!!snackbar}
					autoHideDuration={20000}
					onClose={(e, r) => r !== 'clickaway' && setSnackbar('')}
					message={snackbar}
					action={
						<IconButton
							size="small"
							aria-label="close"
							color="inherit"
							onClick={() => setSnackbar('')}
						>
							<CloseIcon fontSize="small" />
						</IconButton>
					}
				/>
			</div>
		</div>
	);
}

export default QRCodePage;
