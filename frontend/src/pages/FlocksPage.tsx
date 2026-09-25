import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Plus, Search, Edit, CheckCircle, XCircle, Loader2, Bird } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';

type Flock = {
  id: string;
  organization_id: string;
  farm_id: string;
  site_id: string;
  house_id: string;
  flock_code: string;
  flock_name: string;
  breed: string;
  strain: string;
  placement_date: string;
  placement_age_weeks: number;
  initial_population: number;
  current_population: number;
  flock_status: 'Planned' | 'Active' | 'Closed' | 'Transferred';
  production_cycle: 'Pullet' | 'Layer';
  created_at: string;
};

export const FlocksPage: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlock, setEditingFlock] = useState<Flock | null>(null);

  const { data: flocks, isLoading } = useQuery({
    queryKey: ['flocks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flocks')
        .select('*, houses(name, code)')
        .order('placement_date', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ flock }: { flock: Partial<Flock> }) => {
      if (flock.id) {
        const { error } = await supabase.from('flocks').update(flock).eq('id', flock.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('flocks').insert(flock);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flocks'] });
      setIsModalOpen(false);
      setEditingFlock(null);
      toast.success(t('common.saveSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('common.error'));
    },
  });

  const closeFlock = async (id: string) => {
    const { error } = await supabase
      .from('flocks')
      .update({ flock_status: 'Closed' })
      .eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ['flocks'] });
      toast.success(t('common.statusUpdated'));
    }
  };

  const filteredFlocks = flocks?.filter(flock => 
    flock.flock_code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    flock.flock_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Bird className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('master_data.flocks')}</h1>
            <p className="text-sm text-slate-500">{t('master_data.flocksDesc')}</p>
          </div>
        </div>
        <Button onClick={() => { setEditingFlock(null); setIsModalOpen(true); }} className="flex items-center">
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
                  <TableHead>{t('common.house')}</TableHead>
                  <TableHead>{t('common.population')}</TableHead>
                  <TableHead className="text-center">{t('common.status')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFlocks?.map(flock => (
                  <TableRow key={flock.id}>
                    <TableCell className="font-medium">{flock.flock_code}</TableCell>
                    <TableCell>{flock.flock_name || '-'}</TableCell>
                    <TableCell>{flock.houses?.name || '-'}</TableCell>
                    <TableCell>{flock.current_population.toLocaleString()} / {flock.initial_population.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={flock.flock_status === 'Active' ? 'success' : flock.flock_status === 'Closed' ? 'danger' : 'outline'}>
                        {flock.flock_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingFlock(flock); setIsModalOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {flock.flock_status === 'Active' && (
                        <Button variant="ghost" size="sm" onClick={() => closeFlock(flock.id)}>
                          <XCircle className="h-4 w-4 text-rose-500" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingFlock ? t('common.edit') : t('common.create')}>
        <FlockForm 
          initialData={editingFlock} 
          onSubmit={(data) => mutation.mutate({ flock: data })} 
          isLoading={mutation.isPending} 
        />
      </Modal>
    </div>
  );
};

const FlockForm: React.FC<{ initialData: Flock | null; onSubmit: (data: Partial<Flock>) => void; isLoading: boolean }> = ({ initialData, onSubmit, isLoading }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    flock_code: initialData?.flock_code || '',
    flock_name: initialData?.flock_name || '',
    breed: initialData?.breed || '',
    strain: initialData?.strain || '',
    placement_date: initialData?.placement_date || new Date().toISOString().split('T')[0],
    placement_age_weeks: initialData?.placement_age_weeks ?? 16,
    initial_population: initialData?.initial_population ?? 0,
    current_population: initialData?.current_population ?? 0,
    house_id: initialData?.house_id || '',
    organization_id: initialData?.organization_id || '',
    farm_id: initialData?.farm_id || '',
    site_id: initialData?.site_id || '',
    flock_status: initialData?.flock_status || 'Planned',
    production_cycle: initialData?.production_cycle || 'Pullet',
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label={t('common.code')} 
          required 
          value={formData.flock_code} 
          onChange={e => setFormData({...formData, flock_code: e.target.value})} 
        />
        <Input 
          label={t('common.name')} 
          value={formData.flock_name} 
          onChange={e => setFormData({...formData, flock_name: e.target.value})} 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label={t('common.breed')} 
          value={formData.breed} 
          onChange={e => setFormData({...formData, breed: e.target.value})} 
        />
        <Input 
          label={t('common.strain')} 
          value={formData.strain} 
          onChange={e => setFormData({...formData, strain: e.target.value})} 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label={t('common.placementDate')} 
          type="date" 
          required 
          value={formData.placement_date} 
          onChange={e => setFormData({...formData, placement_date: e.target.value})} 
        />
        <Input 
          label={t('common.placementAge')} 
          type="number" 
          required 
          value={formData.placement_age_weeks} 
          onChange={e => setFormData({...formData, placement_age_weeks: parseInt(e.target.value) || 0})} 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label={t('common.initialPopulation')} 
          type="number" 
          required 
          value={formData.initial_population} 
          onChange={e => setFormData({...formData, initial_population: parseInt(e.target.value) || 0})} 
        />
        <Input 
          label={t('common.currentPopulation')} 
          type="number" 
          required 
          value={formData.current_population} 
          onChange={e => setFormData({...formData, current_population: parseInt(e.target.value) || 0})} 
        />
      </div>
      <Input 
        label={t('common.houseId')} 
        required 
        value={formData.house_id} 
        onChange={e => setFormData({...formData, house_id: e.target.value})} 
      />
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label={t('common.status')} 
          value={formData.flock_status} 
          onChange={e => setFormData({...formData, flock_status: e.target.value as any})} 
        />
        <Input 
          label={t('common.cycle')} 
          value={formData.production_cycle} 
          onChange={e => setFormData({...formData, production_cycle: e.target.value as any})} 
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {t('common.save')}
      </Button>
    </form>
  );
};

export default FlocksPage;
