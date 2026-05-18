'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Menu, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="glass sticky top-0 z-30 h-16 w-full px-4 flex items-center justify-between shadow-sm border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="p-2 md:hidden"
        >
          <Menu size={20} />
        </Button>
        <Link href="/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 hidden md:block tracking-tight">
          SmartDesk
        </Link>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="p-2 rounded-full"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: theme === 'dark' ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </motion.div>
        </Button>

        {user && (
          <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4 ml-2">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold tracking-tight">{user.fullName}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize bg-slate-100 dark:bg-slate-800 rounded-md px-1 mt-0.5 inline-block">{user.role.replace('_', ' ').toLowerCase()}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-900">
              {user.fullName.charAt(0)}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-1"
              title="Logout"
            >
              <LogOut size={18} />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
