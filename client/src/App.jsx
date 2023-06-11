import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Auth, Files, File } from './container';
import { Header } from './components';

function Loading() {
	return <h1>Loading...</h1>;
}

axios.defaults.baseURL = import.meta.env.VITE_APP_BACKEND_URL;
axios.defaults.withCredentials = true;

function App() {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const [fileName, setFileName] = useState(null);
	const checkLogin = async () => {
		const token = localStorage.getItem('token');
		if (token && !user) {
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
				<Loading />
			) : (
				<>
					{!user ? (
						<Auth setUser={setUser} />
					) : (
						<>
							<Header
								user={user}
								setUser={setUser}
								fileName={fileName}
							/>
							<BrowserRouter>
								<Routes>
									<Route
										path="/"
										element={<Files user={user} />}
									/>
									<Route
										path="/:id"
										element={
											<File
												user={user}
												setFileName={setFileName}
											/>
										}
									/>
								</Routes>
							</BrowserRouter>
						</>
					)}
				</>
			)}
			<ToastContainer />
		</>
	);
}

export default App;
