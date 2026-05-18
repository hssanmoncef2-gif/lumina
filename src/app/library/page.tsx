'use client';
import AtmosphericBg from '@/components/ui/AtmosphericBg';
import BottomNav from '@/components/ui/BottomNav';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export default function LibraryPage() {
  return (
    <div className="relative min-h-screen bg-[#09091a] text-white overflow-hidden flex flex-col">
      <AtmosphericBg />
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center pb-24 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
            <BookOpen size={28} className="text-sky-400/50" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/25">Library</p>
          <h1 className="text-3xl font-light tracking-wide text-white/80">Coming soon</h1>
          <p className="text-white/25 text-sm max-w-xs">Your reading list is being shelved.</p>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
