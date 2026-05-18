'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Home, List, PlusSquare, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['USER', 'SUPPORT_AGENT', 'ADMIN'] },
    { name: 'Tickets', href: '/tickets', icon: List, roles: ['USER', 'SUPPORT_AGENT', 'ADMIN'] },
    { name: 'New Ticket', href: '/tickets/create', icon: PlusSquare, roles: ['USER'] },
    { name: 'Users', href: '/admin/users', icon: Users, roles: ['ADMIN'] },
  ];

  const filteredLinks = links.filter(link => user && link.roles.includes(user.role));

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isOpen ? 250 : 0,
          opacity: isOpen ? 1 : 0
        }}
        className={`fixed md:sticky top-0 left-0 h-screen overflow-hidden bg-sidebar z-50 transition-all border-r border-slate-200 dark:border-slate-800 shadow-sm`}
      >
        <div className="w-[250px] h-full p-4 flex flex-col pt-20 md:pt-6">
          <div className="md:hidden pb-8 px-2 border-b border-slate-100 dark:border-slate-800 mb-6">
             <Link href="/dashboard" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 block tracking-tight">
               SmartDesk
             </Link>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2 hidden md:block">Menu</p>
          <nav className="flex-1 space-y-1.5">
            {filteredLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                    isActive 
                    ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>
    </>
  );
};
