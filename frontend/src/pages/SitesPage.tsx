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

type Site = {
  id: string;
  farm_id: string;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
};

export const SitesPage: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);

  const { data: sites, isLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return data as Site[];
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ site }: { site: Partial<Site> }) => {
      if (site.id) {
        const { error } = await supabase.from('sites').update(site).eq('id', site.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('sites').insert(site);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      setIsModalOpen(false);
      setEditingSite(null);
      toast.success(t('common.saveSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('common.error'));
    },
  });

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('sites')
      .update({ is_active: !currentStatus })
      .eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success(t('common.statusUpdated'));
    }
  };

  const filteredSites = sites?.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    site.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('master_data.sites')}</h1>
          <p className="text-sm text-slate-500">{t('master_data.sitesDesc')}</p>
        </div>
        <Button onClick={() => { setEditingSite(null); setIsModalOpen(true); }} className="flex items-center">
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
                  <TableHead className="text-center">{t('common.status')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites?.map(site => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">{site.code}</TableCell>
                    <TableCell>{site.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={site.is_active ? 'success' : 'danger'}>
                        {site.is_active ? t('common.active') : t('common.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingSite(site); setIsModalOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleStatus(site.id, site.is_active)}>
                        {site.is_active ? <XCircle className="h-4 w-4 text-rose-500" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSite ? t('common.edit') : t('common.create')}>
        <SiteForm 
          initialData={editingSite} 
          onSubmit={(data) => mutation.mutate({ site: data })} 
          isLoading={mutation.isPending} 
        />
      </Modal>
    </div>
  );
};

const SiteForm: React.FC<{ initialData: Site | null; onSubmit: (data: Partial<Site>) => void; isLoading: boolean }> = ({ initialData, onSubmit, isLoading }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    code: initialData?.code || '',
    farm_id: initialData?.farm_id || '',
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
        label={t('common.farmId')} 
        required 
        value={formData.farm_id} 
        onChange={e => setFormData({...formData, farm_id: e.target.value})} 
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

export default SitesPage;
