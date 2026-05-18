'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatsCard } from '@/components/StatsCard';
import { ticketApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Inbox, Clock, CheckCircle, Archive, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Loader';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await ticketApi.getDashboardStats();
        setStats(statsRes.data);

        // Fetch recent tickets based on role
        let ticketsRes;
        if (user?.role === 'ADMIN') {
          ticketsRes = await ticketApi.getAllTickets({ size: 5, sortBy: 'createdAt', sortDir: 'desc' });
        } else {
          ticketsRes = await ticketApi.getMyTickets({ size: 5, sortBy: 'createdAt', sortDir: 'desc' });
        }
        setRecentTickets(ticketsRes.data.content || []);

      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading || !stats) {
    return (
      <DashboardLayout>
        <PageLoader />
      </DashboardLayout>
    );
  }

  const priorityData = {
    labels: ['Low', 'Medium', 'High', 'Urgent'],
    datasets: [
      {
        data: [
          stats.ticketsByPriority?.LOW || 0,
          stats.ticketsByPriority?.MEDIUM || 0,
          stats.ticketsByPriority?.HIGH || 0,
          stats.ticketsByPriority?.URGENT || 0,
        ],
        backgroundColor: [
          'rgba(148, 163, 184, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const statusData = {
    labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
    datasets: [
      {
        label: 'Tickets',
        data: [stats.openTickets, stats.inProgressTickets, stats.resolvedTickets, stats.closedTickets],
        backgroundColor: 'rgba(124, 58, 237, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-2">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.fullName}. Here&apos;s your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Open Tickets" value={stats.openTickets} icon={<Inbox size={24} />} color="bg-blue-600" />
        <StatsCard title="In Progress" value={stats.inProgressTickets} icon={<Clock size={24} />} color="bg-amber-500" />
        <StatsCard title="Resolved" value={stats.resolvedTickets} icon={<CheckCircle size={24} />} color="bg-emerald-500" />
        <StatsCard title="Closed" value={stats.closedTickets} icon={<Archive size={24} />} color="bg-slate-500" />
      </div>

      {user?.role === 'ADMIN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           <StatsCard title="Total Users" value={stats.totalUsers} icon={<Users size={24} />} color="bg-indigo-600" />
           <StatsCard title="Total Agents" value={stats.totalAgents} icon={<Users size={24} />} color="bg-fuchsia-600" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card glass className="p-6">
              <h3 className="text-lg font-bold mb-4 tracking-tight">Tickets by Status</h3>
              <div className="h-64">
                <Bar 
                  data={statusData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }} 
                />
              </div>
            </Card>
          </motion.div>
        </div>

        <div>
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="h-full">
            <Card glass className="p-6 h-full flex flex-col">
              <h3 className="text-lg font-bold mb-4 tracking-tight">Priority Breakdown</h3>
              <div className="flex-1 flex justify-center items-center min-h-[250px]">
                 <Doughnut 
                   data={priorityData} 
                   options={{ 
                     responsive: true, 
                     maintainAspectRatio: false,
                     cutout: '70%',
                     plugins: {
                       legend: { position: 'bottom' }
                     }
                   }} 
                 />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="mt-8">
        <Card glass className="overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold tracking-tight">Recent Tickets</h3>
            <Link href="/tickets" className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/80">
                  <th className="px-6 py-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ticket</th>
                  <th className="px-6 py-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentTickets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">No recent tickets found.</td>
                  </tr>
                ) : (
                  recentTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/`} className="font-semibold text-slate-900 dark:text-slate-100 hover:text-violet-600 dark:hover:text-violet-400 block line-clamp-1">
                          {ticket.subject}
                        </Link>
                        <span className="text-xs text-slate-500 font-medium">#{ticket.id}</span>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
                      <td className="px-6 py-4"><PriorityBadge priority={ticket.priority} /></td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
