import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Languages, DefaultCode, DeleteIcon } from '../../assets';
import { Header } from '../';

function Files({ user, setUser }) {
	const navigate = useNavigate();
	const [files, setFiles] = useState([]);
	const [fileType, setFileType] = useState(Languages[0]);
	const [creating, setCreating] = useState(false);
	const fileRef = useRef(null);

	const deleteFile = async (id, fileName) => {
		try {
			const res = await axios.post('/api/document/delete', {
				userEmail: user.email,
				id: id,
			});
			console.log(res);
			await getFiles();
			toast.success(`${fileName} deleted successfully`);
		} catch (err) {
			console.error(err);
			toast.error('Please Check your internet Connection');
		}
	};

	const getFiles = async () => {
		try {
			console.log(user);
			const res = await axios.post('/api/document', {
				userEmail: user.email,
			});
			setFiles(res.data.documents);
			console.log(res);
			console.log(files);
		} catch (err) {
			console.error(err);
		}
	};

	const createFile = async () => {
		if (!fileRef.current.value)
			return toast.error('Please enter a file name');
		setCreating(true);
		toast.info('Creating file...');
		try {
			const DefaultValue = DefaultCode.find(
				(x) => x.id === fileType.id,
			)?.code;
			const res = await axios.post('/api/document/create', {
				userEmail: user.email,
				type: fileType,
				fileName: fileRef.current.value,
				defaultCode: DefaultValue,
			});
			console.log(res);
			await getFiles();
			toast.success(res.data?.message);
			fileRef.current.value = '';
			setCreating(false);
			// navigate(`/${res.data?.document?._id}`);
		} catch (err) {
			setCreating(false);
			console.error(err);
			toast.error('Please Check your internet Connection');
		}
	};

	const Line = ({ file, index }) => {
		if (!file) return <br />;
		return (
			<div className="grid grid-cols-[7fr_4fr_4fr] md:grid-cols-[11fr_4fr_4fr] w-full max-w-[calc(100vw-6rem)] h-max px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded my-2 mx-auto justify-around relative">
				<div
					className="w-full capitalize cursor-pointer h-max text-sm md:text-base"
					onClick={() => navigate(`/${file._id}`)}
				>
					<span className="opacity-75 text-xs md:text-sm cursor-default mr-4 md:mr-10">
						{index + 1}.
					</span>
					<span className="">{file?.fileName}</span>
				</div>
				<div className="opacity-60 m-auto cursor-default text-xs md:text-sm">
					{file?.type?.label}
				</div>
				<div className="opacity-60 m-auto capitalize cursor-default text-xs md:text-sm">
					{file?.owner}
				</div>
				{file?.owner === user.email && (
					<div className="absolute right-5">
						<img
							src={DeleteIcon}
							onClick={() =>
								deleteFile(file?._id, file?.fileName)
							}
							alt={`delete`}
							className="w-5 h-5 cursor-pointer top-[50%] bottom-[50%] transform translate-y-[50%] opacity-60 scale-90 hover:scale-100 transition-all duration-200 ease-in-out hover:opacity-80"
						/>
					</div>
				)}
			</div>
		);
	};

	useEffect(() => {
		return getFiles;
	}, []);
	return (
		<>
			<Header
				user={user}
				setUser={setUser}
			/>
			<div className="grid p-2 md:p-4 h-[calc(100vh-64px)]">
				<div className="block p-1 h-full border-2 rounded overflow-hidden md:p-4">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							createFile();
						}}
						className={
							'grid grid-cols-[7fr_4fr_4fr] md:grid-cols-[11fr_4fr_4fr] w-full max-w-[calc(100vw-6rem)] h-max px-4 py-2 bg-slate-200 rounded mb-6 mx-auto justify-around ' +
							(creating ? 'cursor-not-allowed' : '')
						}
					>
						<input
							className={
								'py-2 px-4 w-full text-sm md:text-base rounded m-auto ' +
								(creating ? 'cursor-not-allowed' : '')
							}
							type="text"
							ref={fileRef}
							required
							disabled={creating}
							placeholder="New File Name"
						/>
						<Select
							options={Languages}
							defaultValue={Languages[0]}
							isSearchable={true}
							className={'w-fit m-auto text-xs md:text-sm'}
							onChange={(e) => {
								setFileType(e);
							}}
							isDisabled={creating}
						/>
						<button
							onClick={createFile}
							disabled={creating}
							type={'submit'}
							className={
								'h-9 bg-slate-500 hover:bg-slate-600 text-white rounded px-2 py-1 m-auto text-xs md:text-sm ' +
								(creating
									? 'opacity-50 cursor-not-allowed'
									: '')
							}
						>
							+ New File
						</button>
					</form>
					{files.length === 0 ? (
						<div>No files found</div>
					) : (
						<div className="grid max-h-full overflow-y-auto">
							{files.map((file, index) => (
								<Line
									key={index}
									file={file}
									index={index}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default Files;