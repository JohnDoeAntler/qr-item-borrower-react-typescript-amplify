import Button from '@mui/material/Button';
import { useContext } from 'react';
import { AppContext } from '../../App';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

const HomeItem = (props: {
	name: string;
	description: string;
	imageUrl: string;
	imageHeight?: number;
	mode: 'borrow' | 'return';
}) => {

	const context = useContext(AppContext);

  return (
		<Link to='/qrcode' style={{ textDecoration: 'none' }} onClick={() => context.setMode(props.mode)}>
			<Card sx={{ maxWidth: 345 }}>
				<CardActionArea>
					<CardMedia
						component="img"
						height={props.imageHeight || 140}
						image={props.imageUrl}
						alt="image"
					/>
					<CardContent>
						<Typography gutterBottom variant="h5" component="div">
							{props.name}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{props.description}
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		</Link>
	);
}

const HomePage = () => {
	return (
		<div style={{
			width: '100%',
			minHeight: '100vh',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			gap: '1rem',
		}}>
			<Typography variant='h4' fontWeight={700}>Borrowing System</Typography>

			<Typography style={{ width: '90%', textAlign: 'center' }} variant='caption' fontWeight={200}>Labore quis labore dolor minim deserunt dolor dolor in pariatur Lorem.</Typography>

			<hr style={{ width: '90%', borderColor: 'hsl(0, 0%, 60%)', borderTop: 0 }} />

			<HomeItem
				name="Borrow"
				description="Tempor et et reprehenderit ea ut aute minim qui do irure."
				imageUrl='/assets/borrow.jpeg'
				mode='borrow'
			/>

			<HomeItem
				name="Return"
				description="Amet do ipsum sit laborum commodo magna quis."
				imageUrl='/assets/return.jpg'
				mode='return'
			/>
		</div>
	);
}

export default HomePage;
