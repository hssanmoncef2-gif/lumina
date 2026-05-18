'use client';
import AtmosphericBg from '@/components/ui/AtmosphericBg';
import BottomNav from '@/components/ui/BottomNav';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#09091a] text-white overflow-hidden flex flex-col">
      <AtmosphericBg />
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center pb-24 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/25 mb-2">Welcome back</p>
          <h1 className="text-4xl font-light tracking-wide text-white/90 mb-3">Lumina</h1>
          <p className="text-white/30 text-sm max-w-xs">Your space to reflect, listen, and grow.</p>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
