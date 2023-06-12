import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Code, Header, Loader, Doc } from '../';
import socket from './socket';

function File({ user, setUser }) {
	const [file, setFile] = useState(null);
	const [code, setCode] = useState();
	const [lastChanged, setLastChanged] = useState(0);
	useEffect(() => {
		const docId = window.location.pathname.split('/')[1];
		socket.emit('request', {
			docId: docId,
			userEmail: user?.email,
		});
		socket.on('response', (data) => {
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
		document.addEventListener('keypress', () => console.log('key pressed'));
	}, []);

	useEffect(() => {
		if (lastChanged) {
			socket.emit('receive-changes', {
				data: code,
				source: user?.email,
			});
		}
	}, [lastChanged, code, user]);
	if (!file) return <Loader />;
	return (
		<>
			{socket.connected ? (
				<div onKeyPress={() => console.log('pressed')}>
					{file?.type?.value === 'text' ? (
						<Doc
							user={user}
							code={code}
							setCode={setCode}
							setLastChanged={setLastChanged}
						/>
					) : (
						<>
							<Header
								user={user}
								fileName={file?.fileName}
								setUser={setUser}
							/>
							<Code
								code={code}
								setCode={setCode}
								defaultLanguage={file?.type}
								setLastChanged={setLastChanged}
							/>
						</>
					)}
				</div>
			) : (
				<Loader />
			)}
		</>
	);
}

export default File;
