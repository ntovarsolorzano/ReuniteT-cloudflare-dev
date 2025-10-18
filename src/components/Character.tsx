import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Crown, PawPrint, Coins, Zap } from 'lucide-react';
import type { Player } from '@shared/types';
interface CharacterProps {
  player: Player;
  isLocalPlayer?: boolean;
}
const Hat = ({ type }: { type: string }) => {
  if (type === 'party') {
    return (
      <g transform="translate(20, -10) rotate(-15)">
        <path d="M0 20 L10 0 L20 20 Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
        <circle cx="10" cy="-3" r="3" fill="#EC4899" />
      </g>
    );
  }
  return null;
};
const Symbol = ({ type }: { type: string }) => {
  const iconProps = {
    x: 12.5,
    y: 12.5,
    width: 15,
    height: 15,
    color: 'white',
    strokeWidth: 2,
  };
  switch (type) {
    case 'lightning':
      return <Zap {...iconProps} />;
    case 'paw':
      return <PawPrint {...iconProps} />;
    case 'coin':
      return <Coins {...iconProps} />;
    default:
      return null;
  }
};
export const Character: React.FC<CharacterProps> = React.memo(({ player, isLocalPlayer = false }) => {
  const { position, customization, name } = player;
  return (
    <motion.div
      className="absolute"
      initial={{ x: position.x, y: position.y }}
      animate={{ x: position.x, y: position.y }}
      transition={{ duration: 0.1, ease: 'linear' }}
      style={{ willChange: 'transform' }}
    >
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 40 40" width="40" height="40" className="overflow-visible">
          <g>
            {/* Body */}
            <rect x="5" y="10" width="30" height="25" rx="15" fill={customization.color} stroke={isLocalPlayer ? 'white' : 'black'} strokeWidth="2" />
            {/* Visor */}
            <rect x="25" y="15" width="15" height="10" rx="5" fill="#A1A1AA" stroke="black" strokeWidth="2" />
            <rect x="27" y="17" width="10" height="6" rx="3" fill="#E4E4E7" />
            {/* Legs */}
            <rect x="10" y="33" width="8" height="7" rx="4" fill={customization.color} stroke="black" strokeWidth="2" />
            <rect x="22" y="33" width="8" height="7" rx="4" fill={customization.color} stroke="black" strokeWidth="2" />
            <Symbol type={customization.symbol} />
            <Hat type={customization.hat} />
          </g>
        </svg>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-max px-2 py-0.5 bg-background/80 text-foreground text-xs rounded-full shadow">
          {name}
        </div>
      </div>
    </motion.div>
  );
});