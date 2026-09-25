import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/Card';
import { 
  Input 
} from '@/components/ui/Input';
import { 
  Label 
} from '@/components/ui/label';
import { 
  Button 
} from '@/components/ui/Button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Alert, 
  AlertDescription 
} from '@/components/ui/Alert';
import { 
  Loader2, 
  Save, 
  Send, 
  Calendar 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DailyRecordForm {
  recordDate: string;
  flockId: string;
  openingPopulation: number;
  mortality: number;
  culling: number;
  transferIn: number;
  transferOut: number;
  closingPopulation: number;
  totalEggs: number;
  goodEggs: number;
  brokenEggs: number;
  dirtyEggs: number;
  feedConsumed: number;
  waterConsumed: number;
}

export const DailyRecordingPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState({
    farmId: '',
    siteId: '',
    houseId: '',
    flockId: '',
  });
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState<DailyRecordForm>({
    recordDate: new Date().toISOString().split('T')[0],
    flockId: '',
    openingPopulation: 0,
    mortality: 0,
    culling: 0,
    transferIn: 0,
    transferOut: 0,
    closingPopulation: 0,
    totalEggs: 0,
    goodEggs: 0,
    brokenEggs: 0,
    dirtyEggs: 0,
    feedConsumed: 0,
    waterConsumed: 0,
  });

  // Fetch flocks based on selected house
  const { data: flocks, isLoading: loadingFlocks } = useQuery({
    queryKey: ['flocks', context.houseId],
    queryFn: async () => {
      if (!context.houseId) return [];
      const { data, error } = await supabase
        .from('flocks')
        .select('*')
        .eq('house_id', context.houseId)
        .eq('status', 'Active');
      if (error) throw error;
      return data || [];
    },
    enabled: !!context.houseId,
  });

  // Fetch previous day's closing population
  const { data: prevRecord, isLoading: loadingPrevRecord } = useQuery({
    queryKey: ['prevRecord', context.flockId, recordDate],
    queryFn: async () => {
      if (!context.flockId || !recordDate) return null;
      
      // Calculate previous date
      const date = new Date(recordDate);
      date.setDate(date.getDate() - 1);
      const prevDate = date.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_population_records')
        .select('closing_population, daily_flock_records!inner(flock_id, record_date, status)')
        .eq('daily_flock_records.flock_id', context.flockId)
        .eq('daily_flock_records.record_date', prevDate)
        .eq('daily_flock_records.status', 'Approved')
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows found"
      return data;
    },
    enabled: !!context.flockId && !!recordDate,
  });

  // Load existing record if recordId is provided in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recordId = params.get('recordId');
    
    if (recordId) {
      const loadRecord = async () => {
        setLoading(true);
        try {
          const { data: master, error: mErr } = await supabase
            .from('daily_flock_records')
            .select('*')
            .eq('id', recordId)
            .single();
          
          if (mErr) throw mErr;

          const { data: pop, error: pErr } = await supabase
            .from('daily_population_records')
            .select('*')
            .eq('daily_flock_record_id', recordId)
            .single();

          const { data: eggs, error: eErr } = await supabase
            .from('egg_production_records')
            .select('*')
            .eq('daily_flock_record_id', recordId)
            .single();

          if (pop && eggs) {
            setContext(prev => ({ ...prev, flockId: master.flock_id }));
            setFormData(prev => ({
              ...prev,
              flockId: master.flock_id,
              recordDate: master.record_date,
              openingPopulation: pop.opening_population,
              mortality: pop.mortality,
              culling: pop.culling,
              transferIn: pop.transfer_in,
              transferOut: pop.transfer_out,
              closingPopulation: pop.closing_population,
              totalEggs: eggs.total_eggs,
              goodEggs: eggs.classification?.good || 0,
              brokenEggs: eggs.broken_eggs,
              dirtyEggs: eggs.dirty_eggs,
            }));
          }
        } catch (err) {
          console.error('Error loading record:', err);
        } finally {
          setLoading(false);
        }
      };
      loadRecord();
    }
  }, [navigate]);

  // Calculate closing population automatically
  useEffect(() => {
    const closing = formData.openingPopulation + formData.transferIn - formData.transferOut - formData.mortality - formData.culling;
    setFormData(prev => ({ ...prev, closingPopulation: Math.max(0, closing) }));
  }, [formData.openingPopulation, formData.transferIn, formData.transferOut, formData.mortality, formData.culling]);

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      // 1. Create/Update the master record
      const { data: masterRecord, error: masterError } = await supabase
        .from('daily_flock_records')
        .upsert({
          organization_id: context.farmId, // Simplified for now, should be fetched from farm
          farm_id: context.farmId,
          site_id: context.siteId,
          house_id: context.houseId,
          flock_id: formData.flockId,
          record_date: recordDate,
          status: 'Draft',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'flock_id, record_date, shift_id' })
        .select()
        .single();

      if (masterError) throw masterError;

      // 2. Save Population Data
      await supabase.from('daily_population_records').upsert({
        daily_flock_record_id: masterRecord.id,
        opening_population: formData.openingPopulation,
        mortality: formData.mortality,
        culling: formData.culling,
        transfer_in: formData.transferIn,
        transfer_out: formData.transferOut,
        closing_population: formData.closingPopulation,
      });

      // 3. Save Egg Production Data
      await supabase.from('egg_production_records').upsert({
        daily_flock_record_id: masterRecord.id,
        total_eggs: formData.totalEggs,
        broken_eggs: formData.brokenEggs,
        dirty_eggs: formData.dirtyEggs,
        classification: {
          good: formData.goodEggs,
          other: formData.totalEggs - (formData.goodEggs + formData.brokenEggs + formData.dirtyEggs)
        },
      });

      // 4. Save Resource Data
      await supabase.from('feed_consumption_records').upsert({
        daily_flock_record_id: masterRecord.id,
        consumed: formData.feedConsumed,
        unit: 'kg',
      });

      await supabase.from('water_consumption_records').upsert({
        daily_flock_record_id: masterRecord.id,
        liters: formData.waterConsumed,
      });

      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please check console.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Ensure the record is saved as a draft first
      await handleSaveDraft();

      // 2. Call the server-side validation and submission RPC
      const { data, error } = await supabase.rpc('submit_daily_record', {
        p_record_id: formData.flockId, // This should be the actual record ID from the upsert
        p_recorder_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;

      alert('Record submitted for approval!');
    } catch (error: any) {
      console.error('Error submitting record:', error);
      alert(`Submission failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Daily Flock Recording</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            <Send className="mr-2 h-4 w-4" /> Submit Record
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recording Context</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="date" 
                className="pl-8" 
                value={recordDate} 
                onChange={(e) => setRecordDate(e.target.value)} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Flock</Label>
            <Select 
              value={context.flockId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const val = e.target.value;
                setContext(prev => ({ ...prev, flockId: val }));
                setFormData(prev => ({ ...prev, flockId: val }));
              }}
            >
              <option value="">Select Flock</option>
              {flocks?.map(flock => (
                <option key={flock.id} value={flock.id}>
                  {flock.flock_code}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="p-2 bg-muted rounded text-sm font-medium text-center">
              Draft
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Population</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Opening Pop</Label>
                <Input 
                  type="number" 
                  value={formData.openingPopulation} 
                  onChange={(e) => setFormData({...formData, openingPopulation: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Closing Pop</Label>
                <Input 
                  type="number" 
                  className="bg-muted" 
                  value={formData.closingPopulation} 
                  readOnly 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mortality</Label>
                <Input 
                  type="number" 
                  value={formData.mortality} 
                  onChange={(e) => setFormData({...formData, mortality: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Culling</Label>
                <Input 
                  type="number" 
                  value={formData.culling} 
                  onChange={(e) => setFormData({...formData, culling: parseInt(e.target.value) || 0})} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Transfer In</Label>
                <Input 
                  type="number" 
                  value={formData.transferIn} 
                  onChange={(e) => setFormData({...formData, transferIn: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Transfer Out</Label>
                <Input 
                  type="number" 
                  value={formData.transferOut} 
                  onChange={(e) => setFormData({...formData, transferOut: parseInt(e.target.value) || 0})} 
                />
              </div>
            </div>
            {formData.mortality + formData.culling + formData.transferOut > formData.openingPopulation + formData.transferIn && (
              <Alert variant="destructive">
                <AlertDescription>
                  Losses exceed available population!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Egg Production</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Total Eggs</Label>
              <Input 
                type="number" 
                value={formData.totalEggs} 
                onChange={(e) => setFormData({...formData, totalEggs: parseInt(e.target.value) || 0})} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Good Eggs</Label>
                <Input 
                  type="number" 
                  value={formData.goodEggs} 
                  onChange={(e) => setFormData({...formData, goodEggs: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Broken Eggs</Label>
                <Input 
                  type="number" 
                  value={formData.brokenEggs} 
                  onChange={(e) => setFormData({...formData, brokenEggs: parseInt(e.target.value) || 0})} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dirty Eggs</Label>
                <Input 
                  type="number" 
                  value={formData.dirtyEggs} 
                  onChange={(e) => setFormData({...formData, dirtyEggs: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Other/Rejected</Label>
                <Input 
                  type="number" 
                  value={formData.totalEggs - (formData.goodEggs + formData.brokenEggs + formData.dirtyEggs)} 
                  readOnly 
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Feed Consumed (kg)</Label>
              <Input 
                type="number" 
                value={formData.feedConsumed} 
                onChange={(e) => setFormData({...formData, feedConsumed: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Water Consumed (L)</Label>
              <Input 
                type="number" 
                value={formData.waterConsumed} 
                onChange={(e) => setFormData({...formData, waterConsumed: parseFloat(e.target.value) || 0})} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Environment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Temp Min (°C)</Label>
                <Input type="number" placeholder="0.0" />
              </div>
              <div className="space-y-2">
                <Label>Temp Max (°C)</Label>
                <Input type="number" placeholder="0.0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Humidity (%)</Label>
              <Input type="number" placeholder="0.0" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyRecordingPage;
