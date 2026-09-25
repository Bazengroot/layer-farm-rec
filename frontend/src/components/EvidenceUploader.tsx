// frontend/src/components/EvidenceUploader.tsx

import React, { useState, useEffect } from 'react';
import { fetchEvidence, registerEvidence } from '../api/workflowApi';

interface EvidenceUploaderProps {
  entityType: string;
  entityId: string;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({ entityType, entityId }) => {
  const [attachments, setAttachments] = useState<any[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const loadEvidence = () => {
    fetchEvidence(entityType, entityId)
      .then(setAttachments)
      .catch(console.error);
  };

  useEffect(() => {
    if (entityId) loadEvidence();
  }, [entityType, entityId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File size check: Max 10 MB
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds maximum allowed limit of 10 MB.');
      return;
    }

    setUploading(true);
    setProgress(30);

    try {
      // Simulate progress & register attachment metadata
      setTimeout(async () => {
        setProgress(70);
        await registerEvidence({
          entity_type: entityType,
          entity_id: entityId,
          file_path: `private/${entityType}/${entityId}/${Date.now()}_${file.name}`,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type || 'application/octet-stream',
          uploaded_by: '00000000-0000-0000-0000-000000000000',
        });
        setProgress(100);
        setUploading(false);
        loadEvidence();
      }, 500);
    } catch (err) {
      console.error(err);
      alert('Failed to upload evidence attachment');
      setUploading(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-gray-50 space-y-3">
      <h4 className="font-bold text-sm">Evidence Attachments (Private & Audit Secured)</h4>

      <div className="flex items-center space-x-3">
        <input
          type="file"
          className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        {uploading && (
          <div className="text-xs text-blue-600 font-medium animate-pulse">
            Uploading... ({progress}%)
          </div>
        )}
      </div>

      {attachments.length > 0 ? (
        <ul className="divide-y border rounded bg-white text-xs">
          {attachments.map((item) => (
            <li key={item.id} className="p-2 flex justify-between items-center">
              <div>
                <span className="font-medium">{item.file_name}</span>
                <span className="text-gray-400 ml-2">({(item.file_size / 1024).toFixed(1)} KB)</span>
              </div>
              <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">
                {item.mime_type}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-400">No evidence attached yet.</p>
      )}
    </div>
  );
};

export default EvidenceUploader;
