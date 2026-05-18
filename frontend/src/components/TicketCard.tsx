'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { MessageSquare, Paperclip } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface TicketCardProps {
  ticket: any;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card glass className="p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">#{ticket.id}</span>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
          <Link href={`/`} className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors inline-block mb-1">
            {ticket.subject}
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{ticket.description}</p>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 mt-4 md:mt-0">
          <div className="text-sm text-slate-400 flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
              <MessageSquare size={14} /> {ticket.comments?.length || 0}
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
              <Paperclip size={14} /> {ticket.attachments?.length || 0}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Created by <span className="font-medium text-slate-600 dark:text-slate-300">{ticket.creator?.fullName || 'Unknown'}</span> on {new Date(ticket.createdAt).toLocaleDateString()}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
