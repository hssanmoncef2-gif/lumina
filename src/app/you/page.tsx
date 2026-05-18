'use client';
import AtmosphericBg from '@/components/ui/AtmosphericBg';
import BottomNav from '@/components/ui/BottomNav';
import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function YouPage() {
  return (
    <div className="relative min-h-screen bg-[#09091a] text-white overflow-hidden flex flex-col">
      <AtmosphericBg />
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center pb-24 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
            <User size={28} className="text-amber-400/50" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/25">You</p>
          <h1 className="text-3xl font-light tracking-wide text-white/80">Coming soon</h1>
          <p className="text-white/25 text-sm max-w-xs">Your profile is taking shape.</p>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[12px] transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            <LogOut size={14} strokeWidth={1.8} />
            Sign out
          </motion.button>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
