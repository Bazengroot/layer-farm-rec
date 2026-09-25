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
  Badge 
} from '@/components/ui/Badge';
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Loader2 
} from 'lucide-react';

interface ApprovalItem {
  id: string;
  record_date: string;
  flock_id: string;
  status: string;
  recorder_profile_id: string;
}

export const ApprovalDashboard: React.FC = () => {
  const { data: pendingRecords, isLoading } = useQuery({
    queryKey: ['pendingApprovals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_flock_records')
        .select('*, flocks(flock_code)')
        .eq('status', 'Submitted');
      if (error) throw error;
      return data || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ recordId }: { recordId: string }) => {
      // 1. Update record status to Approved
      const { error: updateError } = await supabase
        .from('daily_flock_records')
        .update({ status: 'Approved' })
        .eq('id', recordId);
      
      if (updateError) throw updateError;

      // 2. Log the approval action
      const { data: profile } = await supabase.auth.getUser();
      const profileId = profile?.user?.id;

      await supabase.from('daily_record_approvals').insert({
        daily_flock_record_id: recordId,
        approver_profile_id: profileId,
        decision: 'Approved',
      });
    },
    onSuccess: () => {
      // Invalidate queries to refresh list
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ recordId, reason }: { recordId: string; reason: string }) => {
      const { error: updateError } = await supabase
        .from('daily_flock_records')
        .update({ status: 'Rejected' })
        .eq('id', recordId);
      
      if (updateError) throw updateError;

      const { data: profile } = await supabase.auth.getUser();
      const profileId = profile?.user?.id;

      await supabase.from('daily_record_approvals').insert({
        daily_flock_record_id: recordId,
        approver_profile_id: profileId,
        decision: 'Rejected',
        comments: reason,
      });
    },
  });

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Approval Dashboard</h1>
        <Badge variant="outline">Pending Review</Badge>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && pendingRecords?.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No records pending approval.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {pendingRecords?.map((record) => (
          <Card key={record.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium">
                  <span className="text-muted-foreground">Flock: </span>
                  {record.flocks?.flock_code}
                </div>
                <div className="text-sm font-medium">
                  <span className="text-muted-foreground">Date: </span>
                  {record.record_date}
                </div>
                <Badge variant="secondary">{record.status}</Badge>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    const reason = prompt('Reason for rejection:');
                    if (reason) rejectMutation.mutate({ recordId: record.id, reason });
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => approveMutation.mutate({ recordId: record.id })}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApprovalDashboard;
