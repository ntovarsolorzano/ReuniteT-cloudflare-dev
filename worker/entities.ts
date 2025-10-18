import { Entity } from "./core-utils";
import type { Env } from "./core-utils";
import type { Player, ChatMessage } from "@shared/types";
import { moderatorPrompts } from "./moderator-prompts";
const MODERATOR_INTERVAL = 30000;const INACTIVE_PLAYER_THRESHOLD = 15000;const MODERATOR_PLAYER: Omit<Player, 'position'> = { id: 'moderator', name: 'Moderator', customization: { color: '#1f2937', hat: 'none', symbol: 'none' }
};
export interface RoomState {
  id: string;
  players: Record<string, Player & {lastSeen: number;}>;
  chatMessages: ChatMessage[];
  moderatorPrompts: string[];
  currentPromptIndex: number;
  lastTickTimestamp: number;
}
export class RoomEntity extends Entity<RoomState> {
  static readonly entityName = "room";
  static readonly initialState: RoomState = {
    id: "",
    players: {},
    chatMessages: [],
    moderatorPrompts: [],
    currentPromptIndex: 0,
    lastTickTimestamp: 0
  };
  constructor(env: Env, id: string) {
    super(env, id);
    // Fire-and-forget initialization. `waitUntil` is not available here.
    this.initialize();
  }
  async initialize() {
    await this.ensureState();
    if (!this.state.moderatorPrompts || this.state.moderatorPrompts.length === 0) {
      const prompts = moderatorPrompts[this.id] || moderatorPrompts.default;
      await this.mutate((s) => ({ ...s, moderatorPrompts: prompts }));
    }
  }
  async tick() {
    await this.cleanupInactivePlayers();
    await this.postModeratorMessage();
  }
  async triggerTick(): Promise<void> {
    const now = Date.now();
    const lastTick = (await this.getState()).lastTickTimestamp || 0;
    if (now - lastTick > 5000) {
      await this.mutate((s) => ({ ...s, lastTickTimestamp: now }));
      // Fire-and-forget the tick.
      this.tick();
    }
  }
  async cleanupInactivePlayers() {
    await this.mutate((s) => {
      const now = Date.now();
      const newPlayers = { ...s.players };
      let changed = false;
      for (const playerId in newPlayers) {
        if (now - newPlayers[playerId].lastSeen > INACTIVE_PLAYER_THRESHOLD) {
          delete newPlayers[playerId];
          changed = true;
        }
      }
      return changed ? { ...s, players: newPlayers } : s;
    });
  }
  async postModeratorMessage() {
    const state = await this.getState();
    const lastMessage = state.chatMessages[state.chatMessages.length - 1];
    const shouldPost = !lastMessage || Date.now() - lastMessage.timestamp > MODERATOR_INTERVAL;
    if (shouldPost && state.moderatorPrompts.length > 0) {
      const prompt = state.moderatorPrompts[state.currentPromptIndex];
      const moderatorMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
        roomId: this.id,
        playerId: MODERATOR_PLAYER.id,
        playerName: MODERATOR_PLAYER.name,
        playerColor: MODERATOR_PLAYER.customization.color,
        text: prompt,
        isModerator: true
      };
      await this.addMessage(moderatorMessage);
      await this.mutate((s) => ({
        ...s,
        currentPromptIndex: (s.currentPromptIndex + 1) % s.moderatorPrompts.length
      }));
    }
  }
  async updatePlayer(player: Player): Promise<void> {
    await this.mutate((s) => ({
      ...s,
      players: { ...s.players, [player.id]: { ...player, lastSeen: Date.now() } }
    }));
  }
  async removePlayer(playerId: string): Promise<void> {
    await this.mutate((s) => {
      const newPlayers = { ...s.players };
      delete newPlayers[playerId];
      return { ...s, players: newPlayers };
    });
  }
  async addMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    const chatMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    await this.mutate((s) => ({
      ...s,
      chatMessages: [...s.chatMessages, chatMessage].slice(-50)
    }));
    return chatMessage;
  }
  async getState(): Promise<RoomState> {
    const state = await super.getState();
    if (!state.id) {
      return { ...state, id: this.id };
    }
    return state;
  }
}