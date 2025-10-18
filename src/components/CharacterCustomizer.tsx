import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Character } from './Character';
import type { CustomizationOptions, Player } from '@shared/types';
import { cn } from '@/lib/utils';
import { PawPrint, Zap, Coins, PartyPopper, Loader2 } from 'lucide-react';
interface CharacterCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: (data: { customization: CustomizationOptions; name: string }) => void;
  isJoining: boolean;
}
const COLORS = ['#60A5FA', '#FBBF24', '#EC4899', '#34D399', '#A78BFA', '#F87171'];
const HATS = ['none', 'party'];
const SYMBOLS = ['none', 'lightning', 'paw', 'coin'];
export function CharacterCustomizer({ open, onOpenChange, onJoin, isJoining }: CharacterCustomizerProps) {
  const [name, setName] = useState('');
  const [customization, setCustomization] = useState<CustomizationOptions>({
    color: COLORS[0],
    hat: 'none',
    symbol: 'none',
  });
  const mockPlayer: Player = useMemo(() => ({
    id: 'local-player-preview',
    name: name || 'You',
    position: { x: 0, y: 0 },
    customization,
  }), [customization, name]);
  const handleJoin = () => {
    if (name.trim() && !isJoining) {
      onJoin({ customization, name: name.trim() });
    }
  };
  const renderSymbolIcon = (symbol: string) => {
    switch (symbol) {
      case 'lightning': return <Zap className="size-6" />;
      case 'paw': return <PawPrint className="size-6" />;
      case 'coin': return <Coins className="size-6" />;
      default: return <span>None</span>;
    }
  };
  const renderHatIcon = (hat: string) => {
    switch (hat) {
      case 'party': return <PartyPopper className="size-6" />;
      default: return <span>None</span>;
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Customize Your Character</DialogTitle>
          <DialogDescription>
            Make it your own! Choose your look before joining the room.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="flex items-center justify-center p-4 aspect-square">
              <CardContent className="p-0">
                <div className="scale-[2.5] relative">
                  <Character player={mockPlayer} isLocalPlayer={true} />
                </div>
              </CardContent>
            </Card>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium mb-2">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={15}
                />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Color</h3>
                <div className="grid grid-cols-6 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCustomization((prev) => ({ ...prev, color }))}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                        customization.color === color ? 'border-primary scale-110' : 'border-transparent'
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Hat</h3>
              <div className="grid grid-cols-2 gap-2">
                {HATS.map((hat) => (
                  <Button
                    key={hat}
                    variant={customization.hat === hat ? 'default' : 'outline'}
                    onClick={() => setCustomization((prev) => ({ ...prev, hat }))}
                    className="h-12 capitalize"
                  >
                    {renderHatIcon(hat)}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Symbol</h3>
              <div className="grid grid-cols-2 gap-2">
                {SYMBOLS.map((symbol) => (
                  <Button
                    key={symbol}
                    variant={customization.symbol === symbol ? 'default' : 'outline'}
                    onClick={() => setCustomization((prev) => ({ ...prev, symbol }))}
                    className="h-12 capitalize"
                  >
                    {renderSymbolIcon(symbol)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" size="lg" onClick={handleJoin} className="w-full" disabled={!name.trim() || isJoining}>
            {isJoining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isJoining ? 'Joining...' : 'Join Room'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}