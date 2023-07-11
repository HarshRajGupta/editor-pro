import { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Auth({ setUser }) {
	const [page, setPage] = useState('login');
	const emailRef = useRef();
	const passwordRef = useRef();
	const nameRef = useRef();
	const [emailPlaceholder, setEmailPlaceholder] = useState(true);
	const [passwordPlaceholder, setPasswordPlaceholder] = useState(true);
	const [namePlaceholder, setNamePlaceholder] = useState(true);
	const [loading, setLoading] = useState(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const user = {
			email: emailRef.current?.value,
			password: passwordRef.current?.value,
		};
		if (page === 'register') {
			user.userName = nameRef.current?.value;
		}
		try {
			await axios
				.post(`/api/auth/${page}`, user)
				.then((res) => {
					setLoading(false);
					localStorage.setItem('token', res.data.token);
					toast.success(res.data.message);
					document.title = res.data?.user?.userName || 'Editor-Pro';
					return setUser(res.data?.user);
				})
				.catch((err) => {
					setLoading(false);
					if (!err.response) {
						toast.error('Something went wrong!');
					} else {
						toast.error(err.response?.data?.message);
					}
					return console.error(err);
				});
		} catch (err) {
			setLoading(false);
			return console.error(err);
		}
	};
	return (
		<main className="limiter">
			<div className="container-login100">
				<div className="wrap-login100">
					<form
						className="login100-form"
						onSubmit={handleSubmit}
					>
						<span className="login100-form-title p-b-26">
							Welcome
						</span>
						<span className="login100-form-title p-b-48">
							<i className="zmdi zmdi-font"></i>
						</span>

						{page === 'register' && (
							<div className="wrap-input100">
								<input
									className="input100"
									type="text"
									name="userName"
									autocomplete={`off`}
									ref={nameRef}
									disabled={loading}
									onChange={(e) => {
										setNamePlaceholder(
											e.target.value ? false : true,
										);
									}}
									required
								/>
								<span
									className={
										namePlaceholder
											? 'focus-input100'
											: 'focus-input100 has-val'
									}
									data-placeholder="Name"
								/>
							</div>
						)}
						<div className="wrap-input100">
							<input
								className="input100 lowercase"
								type="email"
								name="email"
								autoComplete={`off`}
								ref={emailRef}
								disabled={loading}
								onChange={(e) => {
									setEmailPlaceholder(
										e.target.value ? false : true,
									);
								}}
								required
							/>
							<span
								className={
									emailPlaceholder
										? 'focus-input100'
										: 'focus-input100 has-val'
								}
								data-placeholder="Email"
							/>
						</div>
						<div className="wrap-input100">
							<span className="btn-show-pass">
								<i className="zmdi zmdi-eye"></i>
							</span>
							<input
								className="input100"
								type="password"
								name="pass"
								autoComplete={`off`}
								disabled={loading}
								ref={passwordRef}
								onChange={(e) => {
									setPasswordPlaceholder(
										e.target.value ? false : true,
									);
								}}
								required
							/>
							<span
								className={
									passwordPlaceholder
										? 'focus-input100'
										: 'focus-input100 has-val'
								}
								data-placeholder="Password"
							/>
						</div>

						<div
							className={
								loading
									? `container-login100-form-btn opacity-50`
									: `container-login100-form-btn`
							}
						>
							<div className="wrap-login100-form-btn">
								<div className="login100-form-bgbtn"></div>
								<button
									className="login100-form-btn"
									onClick={handleSubmit}
									disabled={loading}
								>
									{page === 'login' ? 'Login' : 'Sign Up'}
								</button>
							</div>
						</div>

						{page === 'login' ? (
							<div className="text-center p-t-115">
								<span className="txt1">
									Don’t have an account?
								</span>

								<span
									className="txt2"
									onClick={() => setPage('register')}
								>
									Sign Up
								</span>
							</div>
						) : (
							<div className="text-center p-t-115">
								<span className="txt1">
									Already have an account?
								</span>

								<span
									className="txt2"
									onClick={() => setPage('login')}
								>
									Login
								</span>
							</div>
						)}
					</form>
				</div>
			</div>
		</main>
	);
}

export default Auth;