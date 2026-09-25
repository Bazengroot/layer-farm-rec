// frontend/src/components/MedicationFilter.tsx

import React, { useEffect, useState } from 'react';
import { TextField, MenuItem } from '@mui/material';
import { fetchWithAuth } from '../api/healthApi'; // using generic fetch helper if exists

/**
 * Dual dropdown filter for medication data: Farm and Warehouse.
 * Calls the supplied onChange callback with the selected values.
 */
interface Props {
  orgId: string;
  onChange: (filters: { farmId?: string; warehouseId?: string }) => void;
}

export const MedicationFilter: React.FC<Props> = ({ orgId, onChange }) => {
  const [farms, setFarms] = useState<Array<{ id: string; name: string }>>([]);
  const [warehouses, setWarehouses] = useState<Array<{ id: string; name: string; farm_id: string }>>([]);
  const [selectedFarm, setSelectedFarm] = useState<string>('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');

  // Fetch farms on mount
  useEffect(() => {
    const loadFarms = async () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${baseUrl}/farms?orgId=${orgId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token') || ''}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFarms(data);
      }
    };
    loadFarms();
  }, [orgId]);

  // Fetch warehouses when a farm is selected
  useEffect(() => {
    if (!selectedFarm) {
      setWarehouses([]);
      setSelectedWarehouse('');
      onChange({});
      return;
    }
    const loadWarehouses = async () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${baseUrl}/warehouses?orgId=${orgId}&farmId=${selectedFarm}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token') || ''}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWarehouses(data);
        onChange({ farmId: selectedFarm });
      }
    };
    loadWarehouses();
  }, [selectedFarm, orgId, onChange]);

  // Notify when warehouse changes
  useEffect(() => {
    if (selectedWarehouse) {
      onChange({ farmId: selectedFarm, warehouseId: selectedWarehouse });
    } else if (selectedFarm) {
      onChange({ farmId: selectedFarm });
    }
  }, [selectedWarehouse, selectedFarm, onChange]);

  return (
    <div className="flex space-x-4 mb-2">
      <TextField
        select
        label="Farm"
        value={selectedFarm}
        onChange={(e) => setSelectedFarm(e.target.value)}
        size="small"
        sx={{ minWidth: 150 }}
      >
        <MenuItem value="">All Farms</MenuItem>
        {farms.map((f) => (
          <MenuItem key={f.id} value={f.id}>
            {f.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Warehouse"
        value={selectedWarehouse}
        onChange={(e) => setSelectedWarehouse(e.target.value)}
        size="small"
        sx={{ minWidth: 150 }}
        disabled={!selectedFarm}
      >
        <MenuItem value="">All Warehouses</MenuItem>
        {warehouses.map((w) => (
          <MenuItem key={w.id} value={w.id}>
            {w.name}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};
