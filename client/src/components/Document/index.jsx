import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Code, Doc, Header, Markdown } from '../';
import { AppContext, UserContext } from '../../context';

function File({ socket }) {
const { user } = useContext(UserContext);
	const { file } = useContext(AppContext);
	const [lastChanged, setLastChanged] = useState(false);
	const [data, setData] = useState();

	useEffect(() => {
		setTimeout(() => {
			socket.connect();
		}, 0);
		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		setTimeout(() => {
			socket.emit('request', {
				id: window.location.pathname.split('/')[1],
				email: user.email ||"Anonymous",
				type: file?.type?.id,
			});
		}, 0);
		socket.on('response', ({ success, data, message }) => {
			if (success) {
				setTimeout(() => {
					setData(data);
				}, 0);
			} else {
				console.error(message);
				toast.error(message);
			}
		});
		socket.on('server_to_client', ({ data }) => {
			setTimeout(() => {
				setLastChanged(false);
				setData(data);
				console.info('Received Changes!');
			}, 0);
		});
		socket.on('joined', (user) => {
			toast.success(`${user} joined!`);
		});
		socket.on('left', (user) => {
			toast.info(`${user} left!`);
		});
		socket.on('disconnect', (reason) => {
			if (
				reason === 'transport error' ||
				reason === 'ping timeout' ||
				reason === 'transport close' ||
				reason === 'parse error'
			) {
				toast.error(`Connection Lost...!`);
				const interval = setInterval(() => {
					if (socket.connected) {
						setTimeout(() => {
							socket.emit('request', {
								id: window.location.pathname.split('/')[1],
								email: user.email,
							});
							toast.success(`Reconnected...!`);
						}, 0);
						clearInterval(interval);
					} else {
						setTimeout(() => {
							toast.info(`Reconnecting...!`);
							socket.connect();
						}, 0);
					}
				}, 15 * 1000);
			}
		});
		return () => {
			socket.offAny();
		};
	}, []);

	useEffect(() => {
		if (lastChanged) {
			setTimeout(() => {
				setLastChanged(false);
				socket.emit('client_to_server', {
					data: data,
					timestamp: Date.now(),
				});
				console.info('Emitting Changes...!');
			}, 0);
		}
	}, [lastChanged, data]);

	return (
		<>
			{file?.type?.value === 'text' ? (
				<Doc
					text={data}
					setText={setData}
					setLastChanged={setLastChanged}
				/>
			) : (
				<>
					<Header file={file} />
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
	);
}

export default File;
