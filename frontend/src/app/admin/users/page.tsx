'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { userApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const fetchUsers = async () => {
    try {
      const res = await userApi.getAllUsers({ page, size: 20 });
      setUsers(res.data.content || []);
    } catch (err: any) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleRoleChange = async (userId: number, currentRole: string, newRole: string) => {
    if (currentRole === newRole) return;
    try {
      await userApi.updateUser(userId, { role: newRole });
      toast.success('User role updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await userApi.updateUser(userId, { enabled: !currentStatus });
      toast.success(currentStatus ? 'User disabled' : 'User enabled');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage all users, agents, and administrators.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700">
                <th className="p-4 font-semibold text-sm text-gray-500">User</th>
                <th className="p-4 font-semibold text-sm text-gray-500">Contact</th>
                <th className="p-4 font-semibold text-sm text-gray-500">Role</th>
                <th className="p-4 font-semibold text-sm text-gray-500">Status</th>
                <th className="p-4 font-semibold text-sm text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center"><div className="mx-auto w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div></td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{user.fullName}</div>
                        <div className="text-xs text-gray-500">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, user.role, e.target.value)}
                      className="text-sm px-2 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded outline-none"
                    >
                      <option value="USER">User</option>
                      <option value="SUPPORT_AGENT">Agent</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${user.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {user.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleToggleStatus(user.id, user.enabled)}
                      className={`p-2 rounded-lg transition ${user.enabled ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
                      title={user.enabled ? "Disable User" : "Enable User"}
                    >
                      {user.enabled ? <FiUserX size={18} /> : <FiUserCheck size={18} />}
                    </button>
                    {/* Additional edit/delete actions could be added here */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
