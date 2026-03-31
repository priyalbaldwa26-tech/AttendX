import { io } from 'socket.io-client';

const socket = io({
  path: '/socket.io',
  addTrailingSlash: false,
});

export default socket;
