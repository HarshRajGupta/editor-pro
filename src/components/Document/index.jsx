import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Code, Header, Loader, Doc, Markdown } from '../';
import socket from './socket';

function File({ user, setUser }) {
	const navigate = useNavigate();
	const [file, setFile] = useState(null);
	const [data, setData] = useState();
	const [lastChanged, setLastChanged] = useState(0);
	const [openToAll, setOpenToAll] = useState(false);

	useEffect(() => {
		socket.connect();
		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		socket.emit('request', {
			docId: window.location.pathname.split('/')[1],
			userEmail: user?.email,
		});
		socket.on('response', (data) => {
			console.log(data);
			if (data.success) {
				document.title = data?.document?.fileName || 'Editor-Pro';
				setFile(data.document);
				setData(data.document.data);
				setOpenToAll(data.document.openToAll);
			} else {
				console.error(data.message);
				toast.error(data.message);
				navigate(`/`);
			}
		});
		socket.on('receive', (data) => {
			if (data.source !== user.email) {
				setLastChanged(0);
				setData(data.data);
			}
		});
		socket.on('user-joined', (user) => {
			toast.success(`${user} joined...!`);
		});
		socket.on('user-left', (user) => {
			toast.info(`${user} left...!`);
		});
		socket.on('disconnect', (reason) => {
			if (
				reason === 'transport error' ||
				reason === 'ping timeout' ||
				reason === 'transport close' ||
				reason === 'parse error'
			) {
				toast.error(`Connection Lost...!`);
			}
		});
		return () => {
			socket.offAny();
		};
	}, []);

	useEffect(() => {
		if (lastChanged) {
			socket.emit('receive-changes', {
				data: data,
				source: user?.email,
			});
			setLastChanged(0);
		}
	}, [lastChanged]);

	if (!file) return <Loader />;
	return (
		<>
			{socket.connected ? (
				<>
					{file?.type?.value === 'text' ? (
						<Doc
							user={user}
							text={data}
							setText={setData}
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
									code={data}
									setCode={setData}
									setLastChanged={setLastChanged}
								/>
							) : (
								<Code
									code={data}
									setCode={setData}
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
