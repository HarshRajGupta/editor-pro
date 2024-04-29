import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Header } from '../';
import { DefaultCode, DeleteIcon, Languages } from '../../assets';
import { UserContext } from '../../context';

function Files() {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const [files, setFiles] = useState([]);
	const [creating, setCreating] = useState(false);
	const fileRef = useRef(null);
	const options = [
		{
			id: 43,
			label: 'Word File',
			name: 'Word File',
			value: 'text',
		},
		{
			id: 42,
			label: 'Markdown',
			name: 'Markdown',
			value: 'markdown',
		},
		...Languages,
	];
	const [fileType, setFileType] = useState(options[0]);
	const deleteFile = async (id, name) => {
		await axios
			.delete(`/api/document/${id}`)
			.then(() => {
				getFiles();
				toast.success(`${name} deleted successfully`);
			})
			.catch((err) => {
				console.error(err);
				toast.error('Failed to delete file');
			});
	};

	const getFiles = () => {
		axios
			.get('/api/document')
			.catch((err) => console.error(err))
			.then((res) => {
				setFiles(res?.data?.documents || []);
			});
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
			const res = await axios.post('/api/document', {
				type: fileType,
				name: fileRef.current.value,
				defaultCode: DefaultValue,
			});
			getFiles();
			toast.success(res.data?.message);
			fileRef.current.value = '';
			setCreating(false);
			navigate(`/${res.data?.document?.id}`);
		} catch (err) {
			setCreating(false);
			console.error(err);
			toast.error('Please Check your internet Connection');
		}
	};

	const Line = ({ file, index }) => {
		const clickHandler = () => navigate(`/${file.id}`);
		const deleteHandler = () => deleteFile(file?.id, file?.name);
		console.log(file.owner.id, user);
		if (!file) return <br />;
		return (
			<div className="grid grid-cols-[6fr_4fr_4fr] md:grid-cols-[11fr_4fr_4fr] w-[94vw] max-[600px]:w-[92vw] h-max px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded my-2 mx-auto justify-around relative">
				<div
					className="w-full cursor-pointer h-fit text-sm md:text-base max-[600px]:text-[10px]"
					onClick={clickHandler}
				>
					<span className="opacity-75 text-xs md:text-sm cursor-default mr-4 md:mr-10 max-[600px]:text-[8px]">
						{index + 1}.
					</span>
					<span className="text-s">{file?.name}</span>
				</div>
				<div
					className="opacity-60 m-auto cursor-default text-xs md:text-sm max-[600px]:hidden"
					onClick={clickHandler}
				>
					{file?.type?.label}
				</div>
				{file?.owner.id !== user.id ? (
					<div
						className="opacity-60 m-auto capitalize cursor-default text-xs md:text-sm max-[600px]:text-[8px]"
						onClick={clickHandler}
					>
						{file?.owner.name}
					</div>
				) : (
					<div className="absolute right-5">
						<img
							src={DeleteIcon}
							onClick={deleteHandler}
							alt={`delete`}
							className="w-5 h-5 cursor-pointer top-[50%] bottom-[50%] transform translate-y-[50%] opacity-60 scale-90 hover:scale-100 transition-all duration-200 ease-in-out hover:opacity-80 max-[600px]:w-4 max-[600px]:h-4"
						/>
					</div>
				)}
			</div>
		);
	};

	useEffect(getFiles, []);
	return (
		<>
			<Header />
			<main className="grid py-[1vh] px-[2vw] md:p-4 h-[calc(100vh-64px)]">
				<div className="block p-1 h-full border-2 rounded overflow-hidden md:p-4">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							createFile();
						}}
						className={
							'grid grid-cols-[7fr_4fr_4fr] md:grid-cols-[11fr_4fr_4fr] max-[600px]:grid-cols-[11fr_4fr_4fr]  w-[94vw] h-max p-1 sm:px-4 sm:py-2 bg-slate-200 rounded mb-4 mx-auto justify-around ' +
							(creating ? 'cursor-not-allowed' : '')
						}
					>
						<input
							className={
								'py-2 px-4 w-full text-sm md:text-base rounded m-auto max-[600px]:text-[10px] max-[600px]:py-1 ' +
								(creating ? 'cursor-not-allowed' : '')
							}
							type="text"
							ref={fileRef}
							required
							disabled={creating}
							placeholder="New File Name"
						/>
						<Select
							options={options}
							defaultValue={options[0]}
							isSearchable={true}
							className={
								'w-fit h-fit m-auto text-xs md:text-sm max-[600px]:text-[10px] max-[600px]:p-0 max-[600px]:scale-75 z-10'
							}
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
								'bg-slate-500 hover:bg-slate-600 text-white rounded px-2 py-2 m-auto text-xs md:text-sm max-[600px]:text-[10px] max-[600px]:py-1 h-fit ' +
								(creating
									? 'opacity-50 cursor-not-allowed'
									: '')
							}
						>
							New File
						</button>
					</form>
					{files.length === 0 ? (
						<div className='italic font-["Comic_Sans_MS"]'>
							No files found
						</div>
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
			</main>
		</>
	);
}

export default Files;
