import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import Header from "../../components/Header";

const SuccessPage = () => {

	const context = useContext(AppContext);
	const navigate = useNavigate();

	return (
		<div style={{
			width: '100%',
			minHeight: '100vh',
			display: 'flex',
			flexDirection: 'column',
		}}>
			<Header title="Result"/>

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
				<Typography variant='h4' fontWeight={700}>Success</Typography>

				<Typography variant='caption' fontWeight={200} lineHeight={1} color="lightgray">You have successfully {context.mode}ed an item.</Typography>

				<Button variant="contained" onClick={() => navigate('/')}>Return to Home Page</Button>
			</div>
		</div>
	);
}

export default SuccessPage;
