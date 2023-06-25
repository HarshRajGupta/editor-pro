import { useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Moodle({ setShowMoodle, docId, user, openToAll, setOpenToAll }) {
	const inviteMail = useRef(null);
	const openToAllHandler = async (e) => {
		try {
			await axios.post('/api/document/open', {
				docId: docId,
				userEmail: user?.email,
				status: e.target.checked,
			});
			setOpenToAll(e.target.checked);
		} catch (err) {
			e.target.checked = !e.target.checked;
			toast.error(err?.response?.data?.message);
			console.error(err);
		}
	};
	const invite = async () => {
		try {
			const res = await axios.post('/api/document/invite', {
				id: docId,
				userEmail: user?.email,
				newEmail: inviteMail?.current?.value,
			});
			toast.success(res?.data?.message);
			setShowMoodle(false);
		} catch (err) {
			console.error(err);
			toast.error(err.response?.data?.message);
		}
	};
	return (
		<div
			id="authentication-modal"
			className="fixed top-0 left-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full items-center flex justify-center bg-slate-900 bg-opacity-80"
		>
			<div className="relative w-full max-w-md max-h-full justify-center mx-auto">
				<div className="relative bg-white rounded-lg shadow">
					<button
						type="button"
						className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
						onClick={() => setShowMoodle(false)}
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
						<h3 className="mb-4 text-xl font-medium text-gray-900">
							Invite a Collaborator
						</h3>
						<form
							className="space-y-6"
							action="#"
							onSubmit={(e) => {
								e.preventDefault();
								invite();
							}}
						>
							<div class="flex items-center">
								<input
									type="checkbox"
									class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
									onChange={openToAllHandler}
									defaultChecked={openToAll}
								/>
								<label
									for="default-checkbox"
									class="ml-2 text-sm font-medium text-gray-900"
								>
									Anyone with the link can edit
								</label>
							</div>

							{openToAll ? (
								<>
									<button
										onClick={(e) => {
											e.preventDefault();
											navigator.clipboard.writeText(
												window.location.href,
											);
										}}
										className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
									>
										Copy Link
									</button>
								</>
							) : (
								<>
									<div>
										<label className="block mb-2 text-sm font-medium text-gray-900 ">
											Collaborator`s Email
										</label>
										<input
											type="email"
											name="email"
											ref={inviteMail}
											className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  lowercase"
											placeholder="emailId@domain"
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
								</>
							)}
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Moodle;
