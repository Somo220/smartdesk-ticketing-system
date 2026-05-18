'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, color = 'bg-violet-600' }) => {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Card glass className="p-6 relative overflow-hidden group">
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide uppercase mb-1">{title}</p>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">{value}</h3>
            {trend && (
              <p className="text-sm mt-2 text-emerald-500 font-medium">
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3.5 rounded-xl text-white shadow-lg ${color} ring-4 ring-white/50 dark:ring-slate-900/50`}>
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
