'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiClock, FiActivity } from 'react-icons/fi';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-500/20 blur-[120px] pointer-events-none" />

      <main className="z-10 flex flex-col items-center justify-center p-8 max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Welcome to <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
              SmartDesk
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            The next-generation IT Support Ticketing System built for speed, clarity, and seamless resolutions.
          </p>

          <Link href="/login">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 mx-auto text-lg"
            >
              Get Started <FiArrowRight />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
        >
          {/* Feature 1 */}
          <div className="glass p-8 rounded-3xl flex flex-col items-center text-center shadow-lg border border-white/20">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 mx-auto">
               <FiShield size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure & Reliable</h3>
            <p className="text-gray-600 dark:text-gray-400">Enterprise-grade security with JWT authentication and role-based access control.</p>
          </div>

          {/* Feature 2 */}
           <div className="glass p-8 rounded-3xl flex flex-col items-center text-center shadow-lg border border-white/20 md:-translate-y-4">
            <div className="w-16 h-16 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-900/30 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 mb-6 mx-auto">
               <FiClock size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-gray-600 dark:text-gray-400">Streamlined ticketing flow ensures your issues are resolved faster than ever.</p>
          </div>

          {/* Feature 3 */}
          <div className="glass p-8 rounded-3xl flex flex-col items-center text-center shadow-lg border border-white/20">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 mx-auto">
               <FiActivity size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Live Tracking</h3>
            <p className="text-gray-600 dark:text-gray-400">Real-time status updates, email notifications, and detailed dashboard analytics.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
