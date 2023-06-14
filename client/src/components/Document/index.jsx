import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Code, Header, Loader, Doc, Markdown } from '../';
import socket from './socket';

function File({ user, setUser }) {
	const [file, setFile] = useState(null);
	const [code, setCode] = useState();
	const [lastChanged, setLastChanged] = useState(0);
	const [openToAll, setOpenToAll] = useState(false);
	useEffect(() => {
		socket.emit('request', {
			docId: window.location.pathname.split('/')[1],
			userEmail: user?.email,
		});
		socket.on('response', (data) => {
			if (data.success) {
				setFile(data.document);
				setCode(data.document.data);
				setOpenToAll(data.document.openToAll);
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
	}, []);

	useEffect(() => {
		if (lastChanged) {
			socket.emit('receive-changes', {
				data: code,
				source: user?.email,
			});
			setLastChanged(0);
		}
	}, [lastChanged, code, user]);
	if (!file) return <Loader />;
	return (
		<>
			{socket.connected ? (
				<>
					{file?.type?.value === 'text' ? (
						<Doc
							user={user}
							code={code}
							setCode={setCode}
							setLastChanged={setLastChanged}
							openToAll={openToAll}
							setOpenToAll={setOpenToAll}
						/>
					) : (
						<>
							<Header
								user={user}
								fileName={file?.fileName}
								setUser={setUser}
								isLight={file?.type?.value === 'markdown'}
								openToAll={openToAll}
								setOpenToAll={setOpenToAll}
							/>
							{file?.type?.value === 'markdown' ? (
								<Markdown
									code={code}
									setCode={setCode}
									setLastChanged={setLastChanged}
								/>
							) : (
								<Code
									code={code}
									setCode={setCode}
									defaultLanguage={file?.type}
									setLastChanged={setLastChanged}
								/>
							)}
						</>
					)}
				</>
			) : (
				<Loader />
			)}
		</>
	);
}

export default File;
