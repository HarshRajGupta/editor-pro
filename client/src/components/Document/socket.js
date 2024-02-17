import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:4000");
socket.disconnect();

export default (socket);