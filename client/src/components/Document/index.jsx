import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Code, Header, Loader, Doc, Markdown } from '../';
import socket from './socket';

function File({ user, setUser }) {
	const navigate = useNavigate();
	const [file, setFile] = useState(null);
	const [data, setData] = useState();
	const [lastChanged, setLastChanged] = useState(false);
	const [openToAll, setOpenToAll] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			socket.connect();
		}, 0)
		return () => {
			setTimeout(() => {
				socket.disconnect();
			}, 0)
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
		socket.on('receive', (value) => {
			setTimeout(() => {
				setData(value);
				setLastChanged(false);
			}, 0)
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
			setTimeout(() => {
				socket.emit('receive-changes', {
					data: data,
					timestamp: Date.now(),
				});
				setLastChanged(false);
			}, 0)
		}
	}, [lastChanged, data]);

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
