import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/Card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/Table';
import { 
  Button 
} from '@/components/ui/Button';
import { 
  Input 
} from '@/components/ui/Input';
import { 
  Label 
} from '@/components/ui/label';
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
  Plus, 
  Save, 
  Search, 
  Filter 
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';


interface GradeConfig {
  id: string;
  grade_code: string;
  grade_name: string;
  min_weight: number;
  max_weight: number;
  active: boolean;
}

export const EggGradeConfigPage: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [config, setConfig] = useState({
    grade_code: '',
    grade_name: '',
    min_weight: 0,
    max_weight: 0,
    active: true,
  });

  const { data: grades, isLoading } = useQuery({
    queryKey: ['eggGradeConfigs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('egg_grade_configurations')
        .select('*')
        .order('grade_code', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (newConfig: any) => {
      const { data, error } = await supabase
        .from('egg_grade_configurations')
        .insert([newConfig])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setIsAdding(false);
      setConfig({ grade_code: '', grade_name: '', min_weight: 0, max_weight: 0, active: true });
    },
  });

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Egg Grade Configuration</h1>
          <p className="text-muted-foreground text-sm">Define weight thresholds for egg grading per farm.</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Grade
        </Button>
      </div>

      {isAdding && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Add New Grade</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Grade Code</Label>
              <Input 
                placeholder="e.g. A" 
                value={config.grade_code} 
                onChange={(e) => setConfig({...config, grade_code: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Grade Name</Label>
              <Input 
                placeholder="e.g. Large" 
                value={config.grade_name} 
                onChange={(e) => setConfig({...config, grade_name: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Min Weight (g)</Label>
              <Input 
                type="number" 
                value={config.min_weight} 
                onChange={(e) => setConfig({...config, min_weight: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Max Weight (g)</Label>
              <Input 
                type="number" 
                value={config.max_weight} 
                onChange={(e) => setConfig({...config, max_weight: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => saveMutation.mutate(config)} className="flex-1">
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Grades</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search grades..." className="pl-8 w-64" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Min Weight</TableHead>
                  <TableHead>Max Weight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades?.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-bold">{grade.grade_code}</TableCell>
                    <TableCell>{grade.grade_name}</TableCell>
                    <TableCell>{grade.min_weight}g</TableCell>
                    <TableCell>{grade.max_weight}g</TableCell>
                    <TableCell>
                      <Badge variant={grade.active ? 'default' : 'secondary'}>
                        {grade.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {grades?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No grade configurations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        </Card>
    </div>
  );
};

export default EggGradeConfigPage;

