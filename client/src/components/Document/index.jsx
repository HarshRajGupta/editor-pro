import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Code, Header } from '../';
import socket from './socket';

function File({ user, setUser }) {
	const [file, setFile] = useState(null);
	const [code, setCode] = useState();
	const [lastChanged, setLastChanged] = useState(0);

	useEffect(() => {
		const docId = window.location.pathname.split('/')[1];
		socket.emit('request', {
			docId: docId,
			userEmail: user.email,
		});
		socket.on('response', (data) => {
			console.log('response', data);
			if (data.success) {
				setFile(data.document);
				setCode(data.document.data);
			} else {
				console.error(data.message);
				toast.error(data.message);
			}
		});
		socket.on('receive', (data) => {
			if (data.source !== user.email) {
				setLastChanged(0);
				console.log('receive-changes', data);
				setCode(data.data);
			}
		});
		socket.on('user-joined', (user) => {
			toast.success(`${user} joined...!`);
		});
		socket.on('user-left', (user) => {
			toast.info(`${user} left...!`);
		});
		socket.on('disconnect', () => {
			toast.error(`Connection Lost...!`);
		});
	}, []);

	useEffect(() => {
		if (lastChanged) {
			socket.emit('receive-changes', {
				data: code,
				source: user.email,
			});
		}
	}, [lastChanged, code, user]);

	if (!file) return <h1>Loading...</h1>;
	return (
		<>
			<Header
				user={user}
				fileName={file.fileName}
				setUser={setUser}
			/>
			{socket.connected ? (
				<Code
					code={code}
					setCode={setCode}
					defaultLanguage={file.type}
					setLastChanged={setLastChanged}
				/>
			) : (
				<h1>Loading...</h1>
			)}
		</>
	);
}

export default File;
