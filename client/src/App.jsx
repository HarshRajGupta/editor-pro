import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Auth, Config, Home, Loader } from './components';
import { UserContext } from './context';

process.env.REACT_APP_ENV === 'development' &&
	(axios.defaults.baseURL = 'http://localhost:4000');

function App() {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const checkLogin = async () => {
		const token = localStorage.getItem('token');
		if (token) {
			await axios
				.get('/api/auth', {
					headers: {
						authorization: token,
					},
				})
				.then((res) => {
					setUser(res?.data?.user);
					axios.defaults.headers.common['authorization'] = token;
					document.title = res.data?.name || 'Editor-Pro';
					toast.success(res.data.message);
					setLoading(false);
				})
				.catch((err) => {
					console.error(err);
					localStorage.removeItem('token');
					toast.error(err.response?.data?.message);
					toast.error('Please login again');
				});
		} else {
			toast.warning('Please Login');
		}
		setLoading(false);
	};

	useEffect(() => {
		checkLogin();
	}, []);

	if (loading) return <Loader />;

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
			}}
		>
			{!user ? (
				<Auth />
			) : (
				<BrowserRouter>
					<Routes>
						<Route
							path="/"
							element={<Home />}
						/>
						<Route
							path="/:id"
							element={<Config />}
						/>
					</Routes>
				</BrowserRouter>
			)}
			<ToastContainer />
		</UserContext.Provider>
	);
}

export default App;
