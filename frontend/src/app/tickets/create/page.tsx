'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ticketApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';

export default function NewTicketPage() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await ticketApi.createTicket({ subject, description, priority });
      toast.success('Ticket created successfully!');
      router.push('/tickets');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Link href="/tickets" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-4 font-medium">
          <ArrowLeft size={16} /> Back to Tickets
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card glass>
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold tracking-tight">Submit New Ticket</CardTitle>
            <CardDescription>
              Please provide detailed information about your issue so we can help you quickly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Subject"
                type="text"
                required
                maxLength={200}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of the issue"
              />

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition appearance-none text-slate-900 dark:text-slate-100"
                >
                  <option value="LOW">Low - General query or request</option>
                  <option value="MEDIUM">Medium - Non-critical issue</option>
                  <option value="HIGH">High - Significant business impact</option>
                  <option value="URGENT">Urgent - System down / critical impact</option>
                </select>
              </div>

              <TextArea
                label="Description"
                required
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide as many details as possible to help us resolve the issue quickly..."
              />

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <Link href="/tickets" passHref>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={loading}
                  isLoading={loading}
                >
                  {!loading && <>Submit Ticket <Send size={18} className="ml-2" /></>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
