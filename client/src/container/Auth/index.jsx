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
	const handleSubmit = async (e) => {
		e.preventDefault();
		const user = {
			email: emailRef.current?.value,
			password: passwordRef.current?.value,
		};
		if (page === 'signup') {
			user.userName = nameRef.current?.value;
		}
		try {
			await axios
				.post(`http://localhost:4000/api/auth/${page}`, user)
				.then((res) => {
					localStorage.setItem('token', res.data.token);
					toast.success(res.data.message);
					setUser(res.data?.user);
					console.log(res);
				})
				.catch((err) => {
					if (!err.response) {
						toast.error('Something went wrong!');
					} else {
						toast.error(err.response?.data?.message);
					}
					console.error(err);
				});
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<div className="limiter">
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

						{page === 'signup' && (
							<div className="wrap-input100">
								<input
									className="input100"
									type="text"
									name="userName"
									ref={nameRef}
									onChange={(e) => {
										setNamePlaceholder(
											e.target.value ? false : true,
										);
										console.log(nameRef.current?.value);
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
								className="input100"
								type="email"
								name="email"
								ref={emailRef}
								onChange={(e) => {
									setEmailPlaceholder(
										e.target.value ? false : true,
									);
									console.log(emailRef.current?.value);
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
								ref={passwordRef}
								onChange={(e) => {
									setPasswordPlaceholder(
										e.target.value ? false : true,
									);
									console.log(passwordRef.current?.value);
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

						<div className="container-login100-form-btn">
							<div className="wrap-login100-form-btn">
								<div className="login100-form-bgbtn"></div>
								<button
									className="login100-form-btn"
									onClick={handleSubmit}
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
									onClick={() => setPage('signup')}
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
		</div>
	);
}

export default Auth;
