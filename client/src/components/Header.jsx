import axios from 'axios';
import { useState, useRef } from 'react';
import logo from '../assets/images/code.png';
import { toast } from 'react-toastify';

function Header({ user, setUser, fileName }) {
	const [showModal, setShowModal] = useState(false);
	const inviteMail = useRef(null);
	const logOut = () => {
		localStorage.removeItem('token');
		setUser(null);
	};
	const docId = window.location.pathname.split('/')[1];
	const invite = async () => {
		try {
			const res = await axios.post(
				'http://localhost:4000/api/document/invite',
				{
					id: docId,
					userEmail: user?.email,
					newEmail: inviteMail?.current?.value,
				},
			);
			console.log(res);
			toast.success('Invitation sent successfully');
			setShowModal(false);
		} catch (err) {
			console.error(err);
		}
	};
	function Moodle() {
		return (
			<>
				{showModal ? (
					<div
						id="authentication-modal"
						className="fixed top-0 left-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full items-center flex justify-center bg-slate-900 bg-opacity-80"
					>
						<div className="relative w-full max-w-md max-h-full justify-center mx-auto">
							<div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
								<button
									type="button"
									className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
									onClick={() => setShowModal(false)}
								>
									<svg
										aria-hidden="true"
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 20 20"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clipRule="evenodd"
										></path>
									</svg>
									<span className="sr-only">Close modal</span>
								</button>
								<div className="px-6 py-6 lg:px-8">
									<h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
										Add a collaborator to {fileName}
									</h3>
									<form
										className="space-y-6"
										action="#"
										onSubmit={(e) => {
											e.preventDefault();
											invite();
										}}
									>
										<div>
											<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
												User Email
											</label>
											<input
												type="email"
												name="email"
												ref={inviteMail}
												className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
												placeholder="name@company.com"
												required
											/>
										</div>
										<button
											type="submit"
											onClick={(e) => {
												e.preventDefault();
												invite();
											}}
											className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
										>
											Invite
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				) : (
					''
				)}
			</>
		);
	}
	let bg1 = 'white',
		bg2 = '[#1f1e1f]';
	if (!fileName) {
		bg1 = '[#1f1e1f]';
		bg2 = 'white';
	}
	return (
		<>
			<Moodle />
			<nav className={`border-gray-200 bg-${bg2} z-10`}>
				<div className="flex  justify-between items-center mx-auto w-screen py-4 px-20">
					<div className="flex items-center">
						<img
							src={logo}
							className="h-8 mr-3"
							alt="Flowbite Logo"
						/>
						<span
							className={`self-center text-xl font-semibold whitespace-nowrap text-${bg1}`}
						>
							{fileName || user?.userName}
						</span>
					</div>
					<div className="flex items-center">
						<div
							onClick={() => setShowModal(true)}
							className="mr-6 text-sm text-gray-500 dark:text-white hover:underline cursor-pointer"
						>
							{docId ? 'Invite' : ''}
						</div>
						{user ? (
							<>
								<div
									onClick={logOut}
									className={`text-sm text-${bg2}  hover:underline rounded-md px-4 py-1 bg-${bg1} cursor-pointer`}
								>
									Logout
								</div>
							</>
						) : (
							''
						)}
					</div>
				</div>
			</nav>
		</>
	);
}

export default Header;
