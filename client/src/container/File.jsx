import { useState, useEffect } from 'react';
import { Header, Code } from '../components';
import socket from '../components/socket';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function File({ user, setFileName }) {
	const [file, setFile] = useState(null);
	const [code, setCode] = useState();
	const [lastChanged, setLastChanged] = useState(0);
	const navigate = useNavigate();
	useEffect(() => {
		if (!socket) return;
		return () => {
			socket.emit('request', {
				docId: window.location.pathname.split('/')[1],
				userEmail: user.email,
			});
			socket.on('response', (data) => {
				console.log('response', data);
				if (data.success) {
					setFile(data.document);
					setFileName(data.document.fileName);
					setCode(data.document.data);
				} else {
					console.error(data.message);
					toast.error(data.message);
					navigate('/');
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
		};
	}, []);

	useEffect(() => {
		if (lastChanged) {
			socket.emit('receive-changes', {
				data: code,
				source: user.email,
			});
		}
	}, [lastChanged, code, socket]);

	if (!file) return <h1>Loading...</h1>;
	return (
		<>
			{socket.connected ? (
				<Code
					code={code}
					setCode={setCode}
					defaultLanguage={file.type}
					setLastChanged={setLastChanged}
				/>
			) : (
				'0'
			)}
		</>
	);
}

export default File;
