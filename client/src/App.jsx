import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Auth, Home, Document } from './components';

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

function App() {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const checkLogin = async () => {
		console.log(`loading on`);
		console.log(process.env);
		const token = localStorage.getItem('token');
		if (token) {
			axios
				.post('/api/auth', {
					token: token,
				})
				.then((res) => {
					setUser({
						userName: res.data.userName,
						email: res.data.email,
						id: res.data.id,
					});
					toast.success(res.data.message);
					console.log(res);
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
					localStorage.removeItem('token');
					toast.error(err.response?.data?.message);
					toast.error('Please login again');
					setLoading(false);
				});
		} else {
			console.log(`loading off`);
			setLoading(false);
			toast.warning('Please Login');
			console.log('No token found');
		}
	};
	useEffect(() => {
		return checkLogin;
	}, []);
	return (
		<>
			{loading ? (
				<h1>Loading...</h1>
			) : (
				<>
					{!user ? (
						<Auth setUser={setUser} />
					) : (
						<BrowserRouter>
							<Routes>
								<Route
									path="/"
									element={
										<>
											<Home
												user={user}
												setUser={setUser}
											/>
										</>
									}
								/>
								<Route
									path="/:id"
									element={
										<>
											<Document
												user={user}
												setUser={setUser}
											/>
										</>
									}
								/>
							</Routes>
						</BrowserRouter>
					)}
				</>
			)}
			<ToastContainer />
		</>
	);
}

export default App;
