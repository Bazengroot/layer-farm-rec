// frontend/src/components/OfflineSyncManager.tsx

import React, { useState, useEffect } from 'react';
import { syncOfflineQueue } from '../api/mobileApi';

export const OfflineSyncManager: React.FC = () => {
  const LOCAL_QUEUE_KEY = 'lfrms_offline_queue';

  const [queue, setQueue] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load local queue
    const saved = localStorage.getItem(LOCAL_QUEUE_KEY);
    if (saved) {
      try {
        setQueue(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = async () => {
    if (queue.length === 0) return;
    setIsSyncing(true);

    try {
      const itemsToSync = queue.map((q) => ({
        userId: '00000000-0000-0000-0000-000000000000',
        clientTxId: q.client_tx_id,
        entityType: 'daily_health',
        payload: q,
      }));

      const res = await syncOfflineQueue(itemsToSync);
      if (res.results) {
        // Clear synced items
        localStorage.removeItem(LOCAL_QUEUE_KEY);
        setQueue([]);
        alert('Offline records synced successfully!');
      }
    } catch (err) {
      console.error('Sync failed', err);
      alert('Sync failed. Retrying when connection stabilizes.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-3 bg-gray-50 border rounded-lg space-y-2 text-xs">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-bold">{isOnline ? 'Online Mode' : 'Offline Mode (Local Storage)'}</span>
        </div>
        <span className="text-gray-500 font-mono">{queue.length} Pending Records</span>
      </div>

      {queue.length > 0 && (
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-amber-700 font-medium">Pending Sync Queue Present</span>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleManualSync}
            disabled={isSyncing || !isOnline}
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OfflineSyncManager;
