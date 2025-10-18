import { useEffect, useRef } from 'react';
import { useRoomStore } from '@/stores/room-store';
import { api } from '@/lib/api-client';
import type { RoomState } from '@/stores/room-store';
import { useShallow } from 'zustand/react/shallow';
const SYNC_INTERVAL = 2000; // 2 seconds
export function useRoomSync(roomId: string) {
  const { localPlayer, syncState } = useRoomStore(
    useShallow((state) => ({
      localPlayer: state.localPlayer,
      syncState: state.syncState,
    }))
  );
  const lastSentPosition = useRef<{ x: number; y: number } | null>(null);
  // Main sync effect
  useEffect(() => {
    if (!roomId) return;
    const sync = async () => {
      const { localPlayer } = useRoomStore.getState();
      if (!localPlayer) return;

      try {
        // Send local player update
        const currentPosition = localPlayer.position;
        if (
          !lastSentPosition.current ||
          lastSentPosition.current.x !== currentPosition.x ||
          lastSentPosition.current.y !== currentPosition.y
        ) {
          await api(`/api/room/${roomId}/players`, {
            method: 'POST',
            body: JSON.stringify(localPlayer),
          });
          lastSentPosition.current = currentPosition;
        } else {
          // Even if position hasn't changed, we need to update our 'lastSeen' timestamp
          await api(`/api/room/${roomId}/players`, {
            method: 'POST',
            body: JSON.stringify(localPlayer),
          });
        }
        // Fetch latest room state
        const roomState = await api<RoomState>(`/api/room/${roomId}`);
        syncState(roomState);
      } catch (error) {
        console.error('Failed to sync with room:', error);
      }
    };
    const intervalId = setInterval(sync, SYNC_INTERVAL);
    // Initial sync
    sync();
    return () => {
      clearInterval(intervalId);
    };
  }, [roomId, syncState]);
  // Cleanup effect for when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!roomId || !localPlayer) return;
      // Use fetch with keepalive for reliability on page unload
      const url = `/api/room/${roomId}/players/${localPlayer.id}`;
      fetch(url, {
        method: 'DELETE',
        keepalive: true,
      });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Also trigger on component unmount (e.g., navigating away within the app)
      if (roomId && localPlayer) {
        api(`/api/room/${roomId}/players/${localPlayer.id}`, {
          method: 'DELETE',
        }).catch(err => console.error("Failed to remove player on unmount:", err));
      }
    };
  }, [roomId, localPlayer]);
}