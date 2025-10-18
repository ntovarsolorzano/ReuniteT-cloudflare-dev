import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CharacterCustomizer } from '@/components/CharacterCustomizer';
import { useRoomStore } from '@/stores/room-store';
import type { CustomizationOptions, RoomCategory } from '@shared/types';
import { Gamepad2, HeartHandshake, Clapperboard, BookOpen, Trophy, Loader2 } from 'lucide-react';
const roomCategories: RoomCategory[] = [
  { id: 'veterans', name: 'Veterans of War', description: 'Discuss current events and share experiences.', icon: 'HeartHandshake', color: 'border-red-500' },
  { id: 'videogames', name: 'Videogames', description: 'Talk about the latest releases and classic favorites.', icon: 'Gamepad2', color: 'border-blue-500' },
  { id: 'netflix', name: 'Netflix', description: 'What are you binging? Share recommendations.', icon: 'Clapperboard', color: 'border-pink-500' },
  { id: 'christian-life', name: 'Christian Life', description: 'Fellowship and discuss faith-based topics.', icon: 'BookOpen', color: 'border-yellow-500' },
  { id: 'basketball', name: 'Basketball', description: 'Debate GOATs, trades, and game highlights.', icon: 'Trophy', color: 'border-orange-500' },
];
const iconMap: { [key: string]: React.ElementType } = {
  HeartHandshake,
  Gamepad2,
  Clapperboard,
  BookOpen,
  Trophy,
};
export function HomePage() {
  const navigate = useNavigate();
  const initializeRoom = useRoomStore((state) => state.initializeRoom);
  const [isCustomizerOpen, setCustomizerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const handleCardClick = (category: RoomCategory) => {
    setSelectedCategory(category);
    setCustomizerOpen(true);
  };
  const handleJoinRoom = ({ customization, name }: { customization: CustomizationOptions; name: string }) => {
    if (!selectedCategory || isJoining) return;
    setIsJoining(true);
    const localPlayer = {
      id: `player-${crypto.randomUUID()}`,
      name: name,
      position: { x: 100, y: 100 },
      customization,
    };
    initializeRoom(localPlayer);
    setCustomizerOpen(false);
    navigate(`/room/${selectedCategory.id}`);
    // No need to setIsJoining(false) as the component will unmount
  };
  return (
    <>
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        <ThemeToggle className="absolute top-6 right-6" />
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-brand-blue opacity-20 blur-[100px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-24 md:py-32 lg:py-40 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-handwritten text-7xl md:text-8xl lg:text-9xl bg-gradient-brand-title text-transparent bg-clip-text"
            >
              ReuniteT
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground"
            >
              Jump into themed virtual rooms. Customize your character, move around, and engage in moderated conversations on topics you love.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pb-24 md:pb-32"
          >
            <h2 className="text-3xl font-bold text-center mb-12 font-display">Choose a Room</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {roomCategories.map((category, i) => {
                const Icon = iconMap[category.icon];
                const isSelectedAndJoining = isJoining && selectedCategory?.id === category.id;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  >
                    <Card className={`h-full flex flex-col border-2 ${category.color} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                      <CardHeader className="flex-row items-center gap-4">
                        {Icon && <Icon className="w-8 h-8" />}
                        <CardTitle>{category.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col">
                        <CardDescription className="flex-grow">{category.description}</CardDescription>
                        <Button onClick={() => handleCardClick(category)} className="mt-6 w-full" disabled={isJoining}>
                          {isSelectedAndJoining ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          {isSelectedAndJoining ? 'Joining...' : 'Join Conversation'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
        <footer className="text-center py-8 text-muted-foreground">
          Built with ❤️ at Cloudflare
        </footer>
      </div>
      <CharacterCustomizer
        open={isCustomizerOpen}
        onOpenChange={setCustomizerOpen}
        onJoin={handleJoinRoom}
        isJoining={isJoining}
      />
    </>
  );
}