import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Plus, Search, Edit, CheckCircle, XCircle, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';

type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  role_code: string;
  is_active: boolean;
  created_at: string;
};

export const UsersPage: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, roles(code)')
        .order('full_name', { ascending: true });
      if (error) throw error;
      return data as any[];
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ user }: { user: Partial<UserProfile> }) => {
      if (user.id) {
        const { error } = await supabase.from('profiles').update(user).eq('id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('profiles').insert(user);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
      setEditingUser(null);
      toast.success(t('common.saveSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('common.error'));
    },
  });

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: !currentStatus })
      .eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t('common.statusUpdated'));
    }
  };

  const filteredUsers = users?.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('master_data.users')}</h1>
          <p className="text-sm text-slate-500">{t('master_data.usersDesc')}</p>
        </div>
        <Button onClick={() => { setEditingUser(null); setIsModalOpen(true); }} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          {t('common.create')}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              className="pl-10" 
              placeholder={t('common.search')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.name')}</TableHead>
                  <TableHead>{t('common.email')}</TableHead>
                  <TableHead>{t('common.role')}</TableHead>
                  <TableHead className="text-center">{t('common.status')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-100 text-slate-700">
                        {user.role_code || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={user.is_active ? 'success' : 'danger'}>
                        {user.is_active ? t('common.active') : t('common.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingUser(user); setIsModalOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleStatus(user.id, user.is_active)}>
                        {user.is_active ? <XCircle className="h-4 w-4 text-rose-500" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? t('common.edit') : t('common.create')}>
        <UserForm 
          initialData={editingUser} 
          onSubmit={(data) => mutation.mutate({ user: data })} 
          isLoading={mutation.isPending} 
        />
      </Modal>
    </div>
  );
};

const UserForm: React.FC<{ initialData: UserProfile | null; onSubmit: (data: Partial<UserProfile>) => void; isLoading: boolean }> = ({ initialData, onSubmit, isLoading }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || '',
    email: initialData?.email || '',
    role_code: initialData?.role_code || '',
    is_active: initialData?.is_active ?? true,
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
      <Input 
        label={t('common.name')} 
        required 
        value={formData.full_name} 
        onChange={e => setFormData({...formData, full_name: e.target.value})} 
      />
      <Input 
        label={t('common.email')} 
        type="email" 
        required 
        value={formData.email} 
        onChange={e => setFormData({...formData, email: e.target.value})} 
      />
      <Input 
        label={t('common.role')} 
        required 
        value={formData.role_code} 
        onChange={e => setFormData({...formData, role_code: e.target.value})} 
      />
      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          id="is_active" 
          checked={formData.is_active} 
          onChange={e => setFormData({...formData, is_active: e.target.checked})} 
        />
        <label htmlFor="is_active" className="text-sm font-medium text-slate-700">{t('common.active')}</label>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {t('common.save')}
      </Button>
    </form>
  );
};

export default UsersPage;
