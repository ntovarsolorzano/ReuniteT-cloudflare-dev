export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface CustomizationOptions {
  color: string;
  hat: string;
  symbol: string;
}
export interface Player {
  id: string;
  name: string;
  position: { x: number; y: number };
  customization: CustomizationOptions;
}
export interface ChatMessage {
  id: string;
  roomId: string;
  playerId: string;
  playerName: string;
  playerColor: string;
  text: string;
  timestamp: number;
  isModerator?: boolean;
}
export interface RoomCategory {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name as a string
  color: string; // A tailwind color class for card accents
}