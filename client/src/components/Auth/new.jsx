import Styled from 'styled-components';
import { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import newAuth from '../../assets/images/newAuth.svg';

function Auth({ setUser }) {
	const [page, setPage] = useState('login');
	const emailRef = useRef();
	const passwordRef = useRef();
	const nameRef = useRef();
	const rememberMeRef = useRef();
	const termsRef = useRef();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState({});
	const validate = () => {
		if (!emailRef.current.value || emailRef.current.value === '') {
			setError((prev) => ({ ...prev, email: 'Please enter your email' }));
			return false;
		} else if (
			!/^[^\s@]+@[^\s@]+\.+[^\s@]{2,}$/i.test(emailRef.current.value)
		) {
			setError((prev) => ({
				...prev,
				email: 'Please enter a valid email',
			}));
			return false;
		} else {
			setError((prev) => ({ ...prev, email: '' }));
		}
		if (!passwordRef.current.value || passwordRef.current.value === '') {
			setError((prev) => ({
				...prev,
				password: 'Please enter your password',
			}));
			return false;
		} else if (passwordRef.current.value.length < 8) {
			setError((prev) => ({
				...prev,
				password: 'Password must be at least 8 characters',
			}));
			return false;
		} else {
			setError((prev) => ({ ...prev, password: '' }));
		}
		if (
			page === 'register' &&
			(!nameRef.current.value || nameRef.current.value === '')
		) {
			setError((prev) => ({
				...prev,
				name: 'Please enter your name',
			}));
			return false;
		} else {
			setError((prev) => ({ ...prev, name: '' }));
		}
		if (page === 'register' && !termsRef.current.checked) {
			setError((prev) => ({
				...prev,
				terms: 'Required',
			}));
			return false;
		} else {
			setError((prev) => ({ ...prev, terms: '' }));
		}
		return true;
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		if (!validate()) {
			return setLoading(false);
		}
		const user = {
			email: emailRef.current.value,
			password: passwordRef.current.value,
		};
		if (page === 'register') {
			user.userName = nameRef.current.value;
		}
		try {
			await axios
				.post(`/api/auth/${page}`, user)
				.then((res) => {
					setLoading(false);
					if (rememberMeRef.current.checked)
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
			if (!err.response) {
				toast.error('Something went wrong!');
			} else {
				toast.error(err.response?.data?.message);
			}
			return console.error(err);
		}
	};
	const loginAsGuest = async () => {
		setLoading(true);
		try {
			await axios
				.post(`/api/auth/guest`)
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
			if (!err.response) {
				toast.error('Something went wrong!');
			} else {
				toast.error(err.response?.data?.message);
			}
			return console.error(err);
		}
	};
	return (
		<Container>
			<LeftContainer>
				<Image
					src={newAuth}
					alt="Image"
				/>
			</LeftContainer>
			<Right>
				<RightContainer
					action={''}
					onSubmit={handleSubmit}
				>
					<H1>{page}</H1>
					{page === 'register' ? (
						<div className="grid">
							<Label htmlFor="name">Name</Label>
							<Input
								required
								type="text"
								name="name"
								placeholder="Please Enter you Name"
								disabled={loading}
								ref={nameRef}
								className={
									loading ? 'opacity-50 cursor-wait' : ''
								}
							/>
							{error.name && (
								<div className="error">{error.name}</div>
							)}
						</div>
					) : (
						<></>
					)}
					<div className="grid">
						<Label htmlFor="email">Email ID</Label>
						<Input
							required
							type="email"
							name="email"
							placeholder="Enter Email ID"
							ref={emailRef}
							disabled={loading}
							className={loading ? 'opacity-50 cursor-wait' : ''}
						/>
						{error.email && (
							<div className="error">{error.email}</div>
						)}
					</div>
					<div className="grid">
						<Label htmlFor="password">Password</Label>
						<Input
							required
							placeholder="Password"
							type="password"
							name="password"
							disabled={loading}
							ref={passwordRef}
							className={loading ? 'opacity-50 cursor-wait' : ''}
						/>
						{error.password && (
							<div className="error">{error.password}</div>
						)}
					</div>
					<Box className={loading ? 'opacity-75 cursor-wait' : ''}>
						<CheckBox
							type="checkbox"
							name="rememberMe"
							disabled={loading}
							ref={rememberMeRef}
						/>
						<Suffix htmlFor="rememberMe">Remember me</Suffix>
					</Box>
					{page === 'register' ? (
						<Box
							className={loading ? 'opacity-75 cursor-wait' : ''}
						>
							<CheckBox
								type="checkbox"
								name="terms"
								disabled={loading}
								ref={termsRef}
							/>
							<Suffix htmlFor="terms">
								Agree to&nbsp;
								<a
									target="__blank"
									href="https://docs.google.com/document/d/1C2TUPEbnozRSuMhp4Xur7H4Vy97LOaNOeZDxSKYmLG0/edit?usp=sharing"
								>
									Terms and Conditions
								</a>
								&nbsp;
							</Suffix>
							{error.terms && (
								<div className="error">{error.terms}</div>
							)}
						</Box>
					) : (
						<></>
					)}
					<Button
						type="submit"
						disabled={loading}
						onClick={handleSubmit}
						className={loading ? 'opacity-75 cursor-wait' : ''}
					>
						{page}
					</Button>
					{page === 'login' ? (
						<Link>
							Don`t have an account? &nbsp;{' '}
							<span
								onClick={() => {
									setPage('register');
								}}
							>
								Register Here
							</span>
						</Link>
					) : (
						<Link>
							Already have an account? &nbsp;{' '}
							<span
								onClick={() => {
									setPage('login');
								}}
							>
								Login Here
							</span>
						</Link>
					)}
					<Link>
						<span onClick={() => {
							console.log('Login as Guest');
							loginAsGuest();
						}}>Login as Guest</span>
					</Link>
				</RightContainer>
			</Right>
		</Container>
	);
}

const Container = Styled.main`
	display: grid;
	background: #F5F5F5;
	grid-template-columns: auto auto;
	@media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
	max-width: 100vw;
	min-height: 100vh;
	align-items: center;
	* {
		transition: all 250ms ease-in-out;
		overflow: hidden;
		max-width: 100%;
	}
	justify-content: space-around;
`;

const Right = Styled.div`
	display: flex;
	max-width: 55.6914vw;
	@media (max-width: 768px) {
		max-width: 90vw;
        width: 90vw;
		margin-left: 5vw;
    }
	padding: 0 5vw;
	height: 90vh;
	background: #FFFFFF;
	box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.16);
	border-radius: 12px;
	align-items: center;
`;

/* Form Container */

const RightContainer = Styled.form`
	display: grid;
	width: 40vw;
    @media (max-width: 1024px) {
        width: 35vw;
    }
    @media (max-width: 768px) {
        width: 75vw;
    }
    grid-gap: 16px;
	margin: 0 auto;
	a {
		color: #F78719;
	}
    * {
        align-items: center;
        box-sizing: border-box;
        font-size: 14px;
        font-family: 'Poppins';
		font-style: normal;
        line-height: 126%;
        @media (max-width: 768px) {
            font-size: 12px;
        }
        @media (max-width: 428px) {
            font-size: 10px;
        }
    }
    .grid {
        display: grid;
        grid-gap: 8px;
    }
	.error {
        color: #FF0000;
        font-size: 12px;
        font-weight: 500;
        line-height: 126%;
        @media (max-width: 768px) {
            font-size: 10px;
        }
        @media (max-width: 428px) {
            font-size: 8px;
        }
        &::before {
            content: '⚠ ';
            font-size: 14px;
        }
    }
`;

const H1 = Styled.h1`
	margin: 0 auto;
	font-weight: 700;
	font-size: 48px;
	text-align: center;
	text-transform: Capitalize;
`;

const Label = Styled.label`
    margin-top: 8px;
`;

const Input = Styled.input`
	width: 100%;
	height: 48px;
    font-size: 16px;
    @media (max-width: 1024px) {
        font-size: 14px;
        height: 42px;
    }
    @media (max-width: 428px) {
        font-size: 12px;
        height: 36px;
    }
    max-height: 8vh;
	border: 1px solid rgba(4, 7, 47, 0.4);
	border-radius: 8px;
    padding-left: 16px;
    &:focus {
        border: 2px solid #F78719;
        outline: none;
    }
`;

const Box = Styled.div`
    width: max-content;
    display: flex;
`;

const CheckBox = Styled.input`
	box-sizing: border-box;
	display: flex;
	width: 16px;
	height: 16px;
	border: 2px solid #737B86;
	border-radius: 4px;
`;

const Suffix = Styled.span`
    margin-left: 10px;
	color: #737B86;
`;

const Button = Styled.button`
	margin: 0 auto;
    margin-top: 20px;
	width: 15vw;
    font-size: 18px;
    @media (max-width: 768px) {
        width: 30vw;
        height: 42px;
        font-size: 16px;
    }
    @media (max-width: 428px) {
        height: 36px;
        font-size: 14px;
    }
	height: 56px;
    max-height: 8vh;
	background: #1d91cf;
	border-radius: 8px;
	color: #FFFFFF;
    justify-content: center;
    border: none;
    outline: none;
    text-decoration: none;
    text-transform: capitalize;
    &:hover {
        scale: 1.05;
    }
`;

const Link = Styled.div`
	color: #04072F;
	margin: 0 auto;
    span {
		color: #F78719;
        text-decoration: underline;
        cursor: pointer;
	}
`;

/* Image Container */

const LeftContainer = Styled.div`
    display: grid;
    cursor: pointer;
    @media (max-width: 768px) {
        display: none;
    }
`;
const Image = Styled.img`
    display: flex;
    max-width: 30vw;
    max-height: 84vh;
`;

export default Auth;
