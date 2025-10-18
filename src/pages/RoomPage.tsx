import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Home, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Character } from '@/components/Character';
import { useRoomStore } from '@/stores/room-store';
import { useMovement } from '@/hooks/use-movement';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { ChatMessage } from '@shared/types';
import { useRoomSync } from '@/hooks/use-room-sync';
import { api } from '@/lib/api-client';
import { toast } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/sonner';
import { formatDistanceToNow } from 'date-fns';
export function RoomPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const localPlayer = useRoomStore((state) => state.localPlayer);
  const playersMap = useRoomStore((state) => state.players);
  const players = React.useMemo(() => Array.from(playersMap.values()), [playersMap]);
  const chatMessages = useRoomStore((state) => state.chatMessages);
  const addChatMessage = useRoomStore((state) => state.addChatMessage);
  const [message, setMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useMovement();
  useRoomSync(categoryId!);
  useEffect(() => {
    if (!localPlayer) {
      toast.error("You're not in a room. Redirecting home.");
      setTimeout(() => navigate('/'), 2000);
    }
  }, [localPlayer, navigate]);
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [chatMessages]);
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && localPlayer && categoryId) {
      const newChatMessage: Omit<ChatMessage, 'id' | 'timestamp' | 'roomId'> = {
        playerId: localPlayer.id,
        playerName: localPlayer.name,
        playerColor: localPlayer.customization.color,
        text: message.trim(),
      };
      try {
        const sentMessage = await api<ChatMessage>(`/api/room/${categoryId}/messages`, {
          method: 'POST',
          body: JSON.stringify(newChatMessage),
        });
        addChatMessage(sentMessage);
        setMessage('');
      } catch (error) {
        toast.error('Failed to send message.');
        console.error(error);
      }
    }
  };
  if (!localPlayer) {
    return (
      <div className="w-screen h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Redirecting to home...</p>
        </div>
        <Toaster />
      </div>
    );
  }
  return (
    <div className="w-screen h-screen bg-muted/40 flex flex-col md:flex-row overflow-hidden">
      <Toaster richColors />
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <Button asChild size="icon" variant="outline">
          <Link to="/"><Home className="size-4" /></Link>
        </Button>
        <ThemeToggle className="relative top-0 right-0" />
      </div>
      <div className="flex-1 relative bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="relative w-[800px] h-[600px] bg-white dark:bg-gray-900/50 shadow-lg m-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-dotted-pattern bg-dotted-gray-300 dark:bg-dotted-gray-700">
          {players.map((player) => (
            player.id !== localPlayer.id && <Character key={player.id} player={player} />
          ))}
          <Character player={localPlayer} isLocalPlayer />
        </div>
      </div>
      <div className="w-full md:w-80 lg:w-96 bg-background border-l flex flex-col h-1/3 md:h-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold font-display capitalize">{categoryId?.replace('-', ' ')} Room</h2>
          <p className="text-sm text-muted-foreground">Chat with others!</p>
        </div>
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={cn("flex items-start gap-2", msg.isModerator && "p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg")}>
                <div className="w-6 h-6 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: msg.playerColor }} />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="font-bold text-sm" style={{ color: msg.isModerator ? undefined : msg.playerColor }}>
                      {msg.playerName}
                    </p>
                    <time className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                    </time>
                  </div>
                  <p className="text-sm text-foreground/90 break-words">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={!localPlayer}
            />
            <Button type="submit" size="icon" disabled={!localPlayer || !message.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}