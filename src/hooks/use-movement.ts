import { useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useShallow } from 'zustand/react/shallow';
import { useRoomStore } from '@/stores/room-store';
const MOVEMENT_SPEED = 10;
const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;
const PLAYER_SIZE = 40;
export function useMovement() {
  const { moveLocalPlayer } = useRoomStore(
    useShallow((state) => ({ moveLocalPlayer: state.moveLocalPlayer, localPlayer: state.localPlayer }))
  );
  const move = useCallback(
    (dx: number, dy: number) => {
      const player = useRoomStore.getState().localPlayer;
      if (!player) return;
      const newX = Math.max(0, Math.min(MAP_WIDTH - PLAYER_SIZE, player.position.x + dx));
      const newY = Math.max(0, Math.min(MAP_HEIGHT - PLAYER_SIZE, player.position.y + dy));
      moveLocalPlayer({ x: newX, y: newY });
    },
    [moveLocalPlayer]
  );
  useHotkeys('w,arrowup', () => move(0, -MOVEMENT_SPEED), { preventDefault: true }, [move]);
  useHotkeys('s,arrowdown', () => move(0, MOVEMENT_SPEED), { preventDefault: true }, [move]);
  useHotkeys('a,arrowleft', () => move(-MOVEMENT_SPEED, 0), { preventDefault: true }, [move]);
  useHotkeys('d,arrowright', () => move(MOVEMENT_SPEED, 0), { preventDefault: true }, [move]);
}