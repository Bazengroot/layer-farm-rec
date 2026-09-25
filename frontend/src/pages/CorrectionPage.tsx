import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Badge 
} from '@/components/ui/badge';
import { 
  Alert, 
  AlertDescription 
} from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Edit3, 
  RefreshCcw 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CorrectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const { data: rejectedRecords, isLoading } = useQuery({
    queryKey: ['rejectedRecords'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_flock_records')
        .select('*, flocks(flock_code)')
        .eq('status', 'Rejected');
      if (error) throw error;
      return data || [];
    },
  });

  const handleEdit = (recordId: string) => {
    // Navigate to the recording page with the record ID to load the rejected data
    navigate(`/daily-recording?recordId=${recordId}`);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Correction Center</h1>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <RefreshCcw className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          Records rejected by supervisors appear here. Please review the comments and resubmit the corrected data.
        </AlertDescription>
      </Alert>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : rejectedRecords?.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No records requiring correction.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Rejected Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flock</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rejectedRecords?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.flocks?.flock_code}</TableCell>
                    <TableCell>{record.record_date}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">{record.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(record.id)}
                      >
                        <Edit3 className="mr-2 h-4 w-4" /> Correct
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CorrectionPage;
