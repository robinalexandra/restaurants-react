import React from 'react';
import './App.css';

import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	tableTitle: {
		padding: theme.spacing(2),
	},
	buttonGroup: {
		margin: theme.spacing(2),
	},
	textButton: {
		margin: theme.spacing(1),
	},
	pageField: {
		textAlign: 'center',
	},
});

class App extends React.Component {

	state = {
		restaurantList: [],
		page: 1,
		rowsPerPage: 10,
	};

	componentDidMount() {
		this.getRestaurantData();
	}

	getRestaurantData = async () => {
		const { page, rowsPerPage } = this.state;
		if(page){
			const request = `http://localhost:8080/api/restaurants?page=${page}&pagesize=${rowsPerPage}`;
			console.log(request);
			const response = await fetch(request);
			const { data } = await response.json();
			await this.setState({ restaurantList : data })
		}
		
	}

	handlePreviousPage = async event => {
		if(!this.state.page) {
			await this.setState({page: 1});
			await this.getRestaurantData();
		}
		else if(this.state.page > 1) {
			const newPage = this.state.page - 1;
			await this.setState({page: newPage});
			await this.getRestaurantData();
		}
	};

	handleNextPage = async event => {
		if(!this.state.page) {
			await this.setState({page: 1});
			await this.getRestaurantData();
		}
		else {
			const newPage = this.state.page + 1;
			await this.setState({page: newPage});
			await this.getRestaurantData();
		}
	};

	handlePageChange = async event => {
		await this.setState({page: parseInt(event.target.value,10)});
		await this.getRestaurantData();
	};

	handleRowsPerPageChange = async event => {
		await this.setState({page: 1, rowsPerPage: event.target.value});
		await this.getRestaurantData();
	};

	render() {
		const { classes } = this.props;

		return (
			<div className="App">
				<Container className={classes.container}>
					<Paper>
						<Typography component="h1" variant="h6" color="primary" className={classes.tableTitle}>Restaurants</Typography>
						<Table aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell>Cuisine</TableCell>
									<TableCell>Borough</TableCell>
									<TableCell>Address</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{this.state.restaurantList.map((restaurant, key) => (
									<TableRow key={key}>
									<TableCell>{restaurant.name}</TableCell>
									<TableCell>{restaurant.cuisine}</TableCell>
									<TableCell>{restaurant.borough}</TableCell>
									<TableCell>{restaurant.address.building} {restaurant.address.street}<br />New York, NY {restaurant.address.zipcode}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<Grid container>
							<Grid item xs={6}>
								<FormControl>
									<Tooltip title="Eléments affichés" placement="bottom">
										<Select
											value={this.state.rowsPerPage}
											onChange={this.handleRowsPerPageChange}>
											<MenuItem value={10}>10</MenuItem>
											<MenuItem value={25}>25</MenuItem>
											<MenuItem value={50}>50</MenuItem>
											<MenuItem value={100}>100</MenuItem>
										</Select>
									</Tooltip>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<ButtonGroup className={classes.buttonGroup}>
									<IconButton onClick={this.handlePreviousPage}>
										<NavigateBeforeIcon />
									</IconButton>
									<TextField
										value={this.state.page} 
										onChange={this.handlePageChange}
										type="number"
										variant="standard"
									/>
									<IconButton onClick={this.handleNextPage}>
										<NavigateNextIcon />
									</IconButton>
								</ButtonGroup>
							</Grid>
						</Grid>
						
						
					</Paper>
				</Container>
			</div>
		);
	}
	
}

export default withStyles(styles)(App);