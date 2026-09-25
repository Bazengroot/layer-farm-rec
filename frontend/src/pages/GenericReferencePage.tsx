import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Plus, Search, Edit, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';

type ReferenceData = {
  id: string;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
  created_at: string;
};

type ReferencePageProps = {
  tableName: string;
  titleKey: string;
  descKey: string;
};

export const GenericReferencePage: React.FC<ReferencePageProps> = ({ tableName, titleKey, descKey }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReferenceData | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [tableName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return data as ReferenceData[];
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ item }: { item: Partial<ReferenceData> }) => {
      if (item.id) {
        const { error } = await supabase.from(tableName).update(item).eq('id', item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(tableName).insert(item);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      setIsModalOpen(false);
      setEditingItem(null);
      toast.success(t('common.saveSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('common.error'));
    },
  });

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from(tableName)
      .update({ is_active: !currentStatus })
      .eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      toast.success(t('common.statusUpdated'));
    }
  };

  const filteredData = data?.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t(titleKey)}</h1>
          <p className="text-sm text-slate-500">{t(descKey)}</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex items-center">
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
                  <TableHead>{t('common.code')}</TableHead>
                  <TableHead>{t('common.name')}</TableHead>
                  <TableHead>{t('common.description')}</TableHead>
                  <TableHead className="text-center">{t('common.status')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData?.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={item.is_active ? 'success' : 'danger'}>
                        {item.is_active ? t('common.active') : t('common.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleStatus(item.id, item.is_active)}>
                        {item.is_active ? <XCircle className="h-4 w-4 text-rose-500" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? t('common.edit') : t('common.create')}>
        <ReferenceForm 
          initialData={editingItem} 
          onSubmit={(data) => mutation.mutate({ item: data })} 
          isLoading={mutation.isPending} 
        />
      </Modal>
    </div>
  );
};

const ReferenceForm: React.FC<{ initialData: ReferenceData | null; onSubmit: (data: Partial<ReferenceData>) => void; isLoading: boolean }> = ({ initialData, onSubmit, isLoading }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    code: initialData?.code || '',
    description: initialData?.description || '',
    is_active: initialData?.is_active ?? true,
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
      <Input 
        label={t('common.name')} 
        required 
        value={formData.name} 
        onChange={e => setFormData({...formData, name: e.target.value})} 
      />
      <Input 
        label={t('common.code')} 
        required 
        value={formData.code} 
        onChange={e => setFormData({...formData, code: e.target.value})} 
      />
      <Input 
        label={t('common.description')} 
        value={formData.description} 
        onChange={e => setFormData({...formData, description: e.target.value})} 
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

export default GenericReferencePage;
