import { Server } from 'socket.io';
import { configureRedisAdapter } from '../config/redisClient.js';

import { joinRoom, handleDisconnect, handleRequestInitialState } from './handlers/roomHandlers.js';
import { updateLanguage, syncDocUpdate } from './handlers/docHandlers.js';

export async function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    maxHttpBufferSize: 1e7,
  });

  await configureRedisAdapter(io);

  io.on('connection', (socket) => {
    console.log(`WebSocket Connected: ${socket.id}`);

    socket.on('join_room', joinRoom);
    socket.on('request_initial_state', handleRequestInitialState);
    socket.on('disconnect', handleDisconnect);

    socket.on('update_room_language', updateLanguage);
    socket.on('sync_doc_update', syncDocUpdate);
  });

  return io;
}
