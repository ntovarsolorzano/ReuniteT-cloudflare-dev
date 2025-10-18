import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Player, ChatMessage, CustomizationOptions } from '@shared/types';
export interface RoomState {
  id: string | null;
  players: Record<string, Player>;
  chatMessages: ChatMessage[];
}
export type RoomStore = {
  localPlayer: Player | null;
  players: Map<string, Player>;
  chatMessages: ChatMessage[];
  setLocalPlayer: (player: Player) => void;
  setCustomization: (customization: CustomizationOptions) => void;
  moveLocalPlayer: (position: { x: number; y: number }) => void;
  addChatMessage: (message: ChatMessage) => void;
  initializeRoom: (localPlayer: Player) => void;
  syncState: (roomState: RoomState) => void;
};
export const useRoomStore = create<RoomStore>()(
  immer((set) => ({
    localPlayer: null,
    players: new Map(),
    chatMessages: [],
    setLocalPlayer: (player) => {
      set((state) => {
        state.localPlayer = player;
      });
    },
    setCustomization: (customization) => {
      set((state) => {
        if (state.localPlayer) {
          state.localPlayer.customization = customization;
        }
      });
    },
    moveLocalPlayer: (position) => {
      set((state) => {
        if (state.localPlayer) {
          state.localPlayer.position = position;
        }
      });
    },
    addChatMessage: (message) => {
      set((state) => {
        // Avoid adding duplicate messages
        if (!state.chatMessages.some(m => m.id === message.id)) {
          state.chatMessages.push(message);
        }
      });
    },
    initializeRoom: (localPlayer) => {
      set((state) => {
        state.localPlayer = localPlayer;
        state.players = new Map();
        state.chatMessages = [];
      });
    },
    syncState: (roomState) => {
      set((state) => {
        const newPlayers = new Map<string, Player>();
        for (const playerId in roomState.players) {
          newPlayers.set(playerId, roomState.players[playerId]);
        }
        state.players = newPlayers;
        state.chatMessages = roomState.chatMessages;
      });
    },
  }))
);