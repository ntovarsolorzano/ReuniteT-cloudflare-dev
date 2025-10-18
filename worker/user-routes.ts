import { Hono } from "hono";
import type { Env } from './core-utils';
import { RoomEntity } from "./entities";
import { ok, bad, isStr } from './core-utils';
import type { Player, ChatMessage } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // GET /api/room/:roomId - Get the full state of a room
  app.get('/api/room/:roomId', async (c) => {
    const { roomId } = c.req.param();
    if (!isStr(roomId)) return bad(c, 'Invalid room ID');
    const room = new RoomEntity(c.env, roomId);
    const state = await room.getState();
    await room.triggerTick();
    return ok(c, state);
  });
  // POST /api/room/:roomId/players - Add or update a player
  app.post('/api/room/:roomId/players', async (c) => {
    const { roomId } = c.req.param();
    if (!isStr(roomId)) return bad(c, 'Invalid room ID');
    const player = (await c.req.json()) as Player;
    if (!player || !isStr(player.id) || !isStr(player.name)) {
      return bad(c, 'Invalid player data');
    }
    const room = new RoomEntity(c.env, roomId);
    await room.updatePlayer(player);
    await room.triggerTick();
    return ok(c, { success: true });
  });
  // DELETE /api/room/:roomId/players/:playerId - Remove a player
  app.delete('/api/room/:roomId/players/:playerId', async (c) => {
    const { roomId, playerId } = c.req.param();
    if (!isStr(roomId) || !isStr(playerId)) return bad(c, 'Invalid IDs');
    const room = new RoomEntity(c.env, roomId);
    await room.removePlayer(playerId);
    await room.triggerTick();
    return ok(c, { success: true });
  });
  // POST /api/room/:roomId/messages - Post a new chat message
  app.post('/api/room/:roomId/messages', async (c) => {
    const { roomId } = c.req.param();
    if (!isStr(roomId)) return bad(c, 'Invalid room ID');
    const message = (await c.req.json()) as Omit<ChatMessage, 'id' | 'timestamp' | 'roomId'>;
    if (!message || !isStr(message.playerId) || !isStr(message.text)) {
      return bad(c, 'Invalid message data');
    }
    const room = new RoomEntity(c.env, roomId);
    const createdMessage = await room.addMessage({ ...message, roomId });
    await room.triggerTick();
    return ok(c, createdMessage);
  });
}