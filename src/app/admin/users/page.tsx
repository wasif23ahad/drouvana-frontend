"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, Trash2, ShieldCheck, ShieldOff, Loader2, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  _count?: { applications: number };
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchUsers = useCallback(async (page = 1, q = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (q.trim()) params.set('search', q.trim());
      const res = await api.get(`/api/admin/users?${params}`);
      setUsers(res.data?.data || []);
      if (res.data?.pagination) setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchUsers(1, ''); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1, search);
  };

  const toggleRole = async (user: AdminUser) => {
    setActionId(user.id);
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await api.patch(`/api/admin/users/${user.id}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
      toast.success(`${user.name || user.email} is now ${newRole}`);
    } catch {
      toast.error('Failed to update role');
    } finally {
      setActionId(null);
    }
  };

  const deleteUser = async (user: AdminUser) => {
    if (!confirm(`Delete ${user.name || user.email}? This cannot be undone.`)) return;
    setActionId(user.id);
    try {
      await api.delete(`/api/admin/users/${user.id}`);
      setUsers(prev => prev.filter(u => u.id !== user.id));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-on-surface tracking-tight flex items-center gap-3">
            <Users className="w-7 h-7 text-primary" />
            User Management
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">{pagination.total} total users</p>
        </div>
        <Button
          onClick={() => fetchUsers(pagination.page)}
          variant="outline"
          size="sm"
          className="gap-2 border-white/10 text-xs"
          disabled={loading}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-10 bg-surface border-white/10 rounded-xl text-sm h-10"
          />
        </div>
        <Button type="submit" size="sm" className="rounded-xl px-4 h-10 text-xs">Search</Button>
      </form>

      {/* Table */}
      <div className="bg-surface-container-low/50 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-surface-container/50">
                <th className="text-left px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">User</th>
                <th className="text-left px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Role</th>
                <th className="text-left px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-on-surface-variant hidden md:table-cell">Apps</th>
                <th className="text-left px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-on-surface-variant hidden lg:table-cell">Joined</th>
                <th className="text-right px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto opacity-50" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-on-surface-variant text-sm">No users found</td>
                </tr>
              ) : users.map(user => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 border border-white/10 shrink-0">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">{user.name || '—'}</p>
                        <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={
                        user.role === 'ADMIN'
                          ? 'border-primary/30 bg-primary/10 text-primary text-[10px] font-mono'
                          : 'border-white/10 bg-white/5 text-on-surface-variant text-[10px] font-mono'
                      }
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-on-surface-variant font-mono">{user._count?.applications ?? 0}</span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-xs text-on-surface-variant">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => toggleRole(user)}
                        disabled={actionId === user.id}
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-xs gap-1.5"
                        title={user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                      >
                        {actionId === user.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : user.role === 'ADMIN' ? (
                          <ShieldOff className="w-3.5 h-3.5 text-warning" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        )}
                        {user.role === 'ADMIN' ? 'Demote' : 'Promote'}
                      </Button>
                      <Button
                        onClick={() => deleteUser(user)}
                        disabled={actionId === user.id}
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-xs gap-1.5 text-error hover:text-error hover:bg-error/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-mono">
              Page {pagination.page} of {pagination.totalPages} · {pagination.total} users
            </span>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
                variant="outline"
                size="sm"
                className="h-7 px-2 border-white/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
                variant="outline"
                size="sm"
                className="h-7 px-2 border-white/10"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
