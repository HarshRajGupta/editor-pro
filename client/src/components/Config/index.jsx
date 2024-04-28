import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { Document, Loader } from '..';
import { AppContext } from '../../context';

const index = () => {
	const navigate = useNavigate();
	const [file, setFile] = useState(null);
	const [socketInstance, setSocketInstance] = useState(null);

	useEffect(() => {
		const id = window.location.pathname.split('/')[1];
		axios.get(`/api/document/${id}`)
			.then(({ data }) => {
				if (data.success) {
					document.title = data?.document?.name || 'Editor-Pro';
					setFile(data.document);
					setSocketInstance(
						io(data.document.source, {
							autoConnect: false,
						}),
					);
				}
			})
			.catch((err) => {
				console.error(err);
				toast.error(err.response?.data?.message);
				navigate(`/`);
			});
	}, []);
	if (!file) return <Loader />;
	return (
		<AppContext.Provider
			value={{
				file,
			}}
		>
			<Document socket={socketInstance} />
		</AppContext.Provider>
	);
};

export default index;
