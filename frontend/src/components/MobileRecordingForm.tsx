// frontend/src/components/MobileRecordingForm.tsx

import React, { useState, useEffect } from 'react';

interface MobileRecordingFormProps {
  onSubmitRecord?: (data: any) => void;
}

export const MobileRecordingForm: React.FC<MobileRecordingFormProps> = ({ onSubmitRecord }) => {
  const DRAFT_KEY = 'lfrms_mobile_recording_draft';

  const [flockId, setFlockId] = useState<string>('');
  const [recordDate, setRecordDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [mortality, setMortality] = useState<number | ''>('');
  const [goodEggs, setGoodEggs] = useState<number | ''>('');
  const [crackedEggs, setCrackedEggs] = useState<number | ''>('');
  const [feedKg, setFeedKg] = useState<number | ''>('');
  const [waterLiters, setWaterLiters] = useState<number | ''>('');
  const [tempCelsius, setTempCelsius] = useState<number | ''>('');
  const [saveStatus, setSaveStatus] = useState<string>('Ready');

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.flockId) setFlockId(draft.flockId);
        if (draft.mortality !== undefined) setMortality(draft.mortality);
        if (draft.goodEggs !== undefined) setGoodEggs(draft.goodEggs);
        if (draft.feedKg !== undefined) setFeedKg(draft.feedKg);
        setSaveStatus('Draft Restored');
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  }, []);

  // Auto-save draft on form change
  const saveDraft = () => {
    const draft = { flockId, recordDate, mortality, goodEggs, crackedEggs, feedKg, waterLiters, tempCelsius };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setSaveStatus('Draft Saved Locally');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flockId) {
      alert('Please select a flock.');
      return;
    }

    const payload = {
      client_tx_id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      flockId,
      recordDate,
      mortality: mortality === '' ? 0 : Number(mortality),
      goodEggs: goodEggs === '' ? 0 : Number(goodEggs),
      crackedEggs: crackedEggs === '' ? 0 : Number(crackedEggs),
      feedKg: feedKg === '' ? 0 : Number(feedKg),
      waterLiters: waterLiters === '' ? 0 : Number(waterLiters),
      tempCelsius: tempCelsius === '' ? 0 : Number(tempCelsius),
    };

    if (onSubmitRecord) {
      onSubmitRecord(payload);
    }

    // Clear draft
    localStorage.removeItem(DRAFT_KEY);
    setMortality('');
    setGoodEggs('');
    setCrackedEggs('');
    setFeedKg('');
    setWaterLiters('');
    setTempCelsius('');
    setSaveStatus('Submitted Successfully');
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white border rounded-xl shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-bold">Mobile In-House Recording</h2>
        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-mono">
          {saveStatus}
        </span>
      </div>

      <form onSubmit={handleSubmit} onChange={saveDraft} className="space-y-4">
        {/* Flock Selector */}
        <div>
          <label className="block text-sm font-semibold mb-1">Flock</label>
          <select
            className="w-full h-12 text-base border-2 border-gray-300 rounded-lg px-3 bg-white focus:border-blue-600"
            value={flockId}
            onChange={(e) => setFlockId(e.target.value)}
            required
          >
            <option value="">-- Select House Flock --</option>
            <option value="flock-h1">House 1 - Flock A-1</option>
            <option value="flock-h2">House 2 - Flock B-2</option>
            <option value="flock-h3">House 3 - Flock C-3</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold mb-1">Record Date</label>
          <input
            type="date"
            className="w-full h-12 text-base border-2 border-gray-300 rounded-lg px-3 bg-white"
            value={recordDate}
            onChange={(e) => setRecordDate(e.target.value)}
          />
        </div>

        {/* Keypad Numeric Inputs (Min 44px Touch Targets) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Mortality (Birds)</label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              className="w-full h-14 text-xl font-bold border-2 border-gray-300 rounded-lg px-3 text-center"
              value={mortality}
              onChange={(e) => setMortality(e.target.value === '' ? '' : parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Good Eggs (Pcs)</label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              className="w-full h-14 text-xl font-bold border-2 border-gray-300 rounded-lg px-3 text-center text-blue-600"
              value={goodEggs}
              onChange={(e) => setGoodEggs(e.target.value === '' ? '' : parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Feed Consumed (kg)</label>
            <input
              type="number"
              inputMode="numeric"
              step="0.1"
              placeholder="0.0"
              className="w-full h-14 text-xl font-bold border-2 border-gray-300 rounded-lg px-3 text-center text-green-700"
              value={feedKg}
              onChange={(e) => setFeedKg(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Water Used (L)</label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              className="w-full h-14 text-xl font-bold border-2 border-gray-300 rounded-lg px-3 text-center text-cyan-700"
              value={waterLiters}
              onChange={(e) => setWaterLiters(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </div>
        </div>

        {/* Submit & Save Action */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-14 text-lg font-bold bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 active:scale-95 transition-all"
          >
            Save & Submit Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default MobileRecordingForm;
