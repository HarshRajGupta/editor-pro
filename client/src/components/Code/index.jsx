import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import Terminal from './Terminal';
import axios from 'axios';
import { Languages } from '../../assets';
import { toast } from 'react-toastify';

function Code({ code, setCode, defaultLanguage, setLastChanged }) {
	const inputRef = useRef(null);
	const [submitting, setSubmitting] = useState(false);
	const [language, setLanguage] = useState(defaultLanguage);
	const [output, setOutput] = useState();
	const handleLanguageChange = async (value) => {
		setLanguage(value);
		try {
			await axios.post('/api/document/type', {
				id: window.location.pathname.split('/')[1],
				type: value,
			});
		} catch (err) {
			console.error(err);
			toast.error(err.response?.data?.message);
		}
	};
	const deCodeToken = async (token) => {
		const options = {
			method: 'GET',
			url: process.env.REACT_APP_RAPID_API_URL + '/' + token,
			params: { base64_encoded: 'true', fields: '*' },
			headers: {
				'X-RapidAPI-Host': process.env.REACT_APP_RAPID_API_HOST,
				'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
			},
		};
		try {
			let response = await axios.request(options);
			// console.log('token', response);
			while (
				response.data.status.id === 1 ||
				response.data.status.id === 2
			) {
				setOutput({
					status: response.data.status.id,
					des: 'Processing...',
				});
				response = await axios.request(options);
				// console.log('token', response);
			}
			let stdOut = null;
			if (response.data?.stdout) stdOut = atob(response.data?.stdout);
			let stdErr = null;
			if (response.data?.stderr) stdErr = atob(response.data?.stderr);
			setOutput({
				stdout: stdOut,
				stderr: stdErr,
				status: response.data?.status?.id,
				des: response.data?.status?.description,
			});
			setSubmitting(false);
		} catch (err) {
			setSubmitting(false);
			console.error('Token Decode Failed', err);
			toast.error("Something went wrong");
		}
	};
	const handleSubmit = async () => {
		setSubmitting(true);
		const formData = {
			language_id: language.id,
			source_code: btoa(code),
			stdin: btoa(inputRef.current.value),
		};
		const options = {
			method: 'POST',
			url: process.env.REACT_APP_RAPID_API_URL,
			params: { base64_encoded: 'true', fields: '*' },
			headers: {
				'content-type': 'application/json',
				'Content-Type': 'application/json',
				'X-RapidAPI-Host': process.env.REACT_APP_RAPID_API_HOST,
				'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
			},
			data: formData,
		};
		try {
			const response = await axios.request(options);
			// console.log('compile', response);
			await deCodeToken(response.data.token);
			setSubmitting(false);
		} catch (err) {
			setSubmitting(false);
			console.error('Compile Failed', err);
			toast.error("Compile Failed");
		}
	};
	return (
		<main className="sm:flex h-[calc(100vh-62px)]">
			<div className="bg-[#1f1e1f] text-white w-full sm:w-[70vw] pt-4 h-full max-[600px]:max-h-[70vh]">
				<Editor
					height="calc(100vh - 80px)"
					width={`100%`}
					language={language?.value || 'javascript'}
					theme={'vs-dark'}
					defaultValue={code}
					onChange={(e) => {
						setLastChanged(true);
						setCode(e);
					}}
					className="w-full sm:max-w-[70vw] max-[600px]:max-h-[70vh]"
					value={code}
				/>
			</div>
			<div className="px-8 w-[30vw] overflow-y-auto max-[600px]:w-full">
				<Select
					options={Languages}
					isSearchable={true}
					defaultValue={language || language[0]}
					name="language"
					isDisabled={submitting}
					onChange={(e) => handleLanguageChange(e)}
					className={
						'my-6 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] hover:shadow transition duration-200 bg-white flex-shrink-0 text-sm ' +
						(submitting ? 'border-slate-500 shadow-slate-500' : '')
					}
				/>
				<Terminal output={output} />
				<textarea
					rows="5"
					ref={inputRef}
					placeholder={`Custom input`}
					className={
						'w-full border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white text-sm ' +
						(submitting ? 'opacity-50 cursor-wait' : '')
					}
					disabled={submitting}
				/>
				<div className="grid grid-cols-2 items-center w-full justify-between ">
					<div className="py-2 mt-4">
						{output && (
							<>
								{output?.status === 3 ? (
									<span className="text-green-600 font-semibold">
										Compiled
									</span>
								) : (
									<span className="text-red-500 font-semibold">
										{output?.des}
									</span>
								)}
							</>
						)}
					</div>
					<button
						className={
							'mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-2 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0 text-sm max-[600px]:mb-4 ' +
							(!code || submitting
								? ' opacity-50 cursor-wait'
								: '')
						}
						disabled={!code || submitting}
						onClick={handleSubmit}
					>
						{!code || submitting ? (
							<>Processing...</>
						) : (
							<>Compile</>
						)}
					</button>
				</div>
			</div>
		</main>
	);
}

export default Code;
