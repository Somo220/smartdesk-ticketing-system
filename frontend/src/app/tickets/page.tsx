'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { TicketCard } from '@/components/TicketCard';
import { ticketApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Search, Filter, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import { Card } from '@/components/ui/Card';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        search: search || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        sortBy: 'createdAt',
        sortDir: 'desc'
      };

      let res;
      if (user?.role === 'ADMIN') {
        res = await ticketApi.getAllTickets(params);
      } else {
        res = await ticketApi.getMyTickets(params);
      }
      
      setTickets(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page, statusFilter, priorityFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchTickets();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-2">Tickets</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and track your support requests</p>
        </div>
        {(user?.role === 'USER' || user?.role === 'ADMIN') && (
           <Link href="/tickets/create" passHref>
             <Button>
               <Plus size={18} className="mr-2" /> New Ticket
             </Button>
           </Link>
        )}
      </div>

      <Card glass className="p-4 mb-8 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <Input
            type="text"
            placeholder="Search tickets by subject or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={18} />}
          />
        </form>
        
        <div className="flex gap-4">
          <div className="relative">
             <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
             <select
               value={statusFilter}
               onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
               className="pl-9 pr-8 py-2.5 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none appearance-none text-sm transition-all text-slate-700 dark:text-slate-300 w-[140px]"
             >
               <option value="">All Statuses</option>
               <option value="OPEN">Open</option>
               <option value="IN_PROGRESS">In Progress</option>
               <option value="RESOLVED">Resolved</option>
               <option value="CLOSED">Closed</option>
             </select>
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value); setPage(0); }}
            className="px-4 py-2.5 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none text-sm transition-all text-slate-700 dark:text-slate-300 w-[140px]"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </Card>

      <div className="space-y-4">
        <AnimatePresence>
          {loading ? (
            <div className="py-24">
               <Loader size={36} />
            </div>
          ) : tickets.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Card glass className="inline-block p-12 text-center max-w-sm">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-400 w-8 h-8" />
                </div>
                <p className="text-xl text-slate-800 dark:text-slate-100 font-semibold mb-2">No tickets found</p>
                <p className="text-slate-500 text-sm">Try adjusting your search or filters.</p>
              </Card>
            </motion.div>
          ) : (
            tickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <TicketCard ticket={ticket} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-3 items-center">
          <Button
            variant="secondary"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
}
