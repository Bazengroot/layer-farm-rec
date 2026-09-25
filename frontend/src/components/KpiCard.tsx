import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface KpiCardProps {
  /** Human‑readable title of the KPI, e.g. "Hen‑day Egg Production" */
  title: string;
  /** Numeric value; null indicates missing data */
  value: number | null;
  /** Unit string, e.g. "%" or "days" */
  unit: string;
  /** Formula description shown in a tooltip */
  formula: string;
  /** Optional warning messages, displayed as an icon with tooltip */
  warnings?: string[];
  /** Optional completeness information, e.g. "85% of data present" */
  completeness?: string;
}

/**
 * Reusable card that displays a KPI value together with its unit,
 * formula and optional warnings/completeness information.
 */
const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  formula,
  warnings = [],
  completeness,
}) => {
  const displayValue = value !== null && value !== undefined ? value.toLocaleString() : '—';
  const hasWarning = warnings.length > 0;

  return (
    <Card sx={{ minWidth: 200, m: 1 }} variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" component="div" gutterBottom>
            {title}
          </Typography>
          {hasWarning && (
            <Tooltip title={warnings.join('\n')} arrow>
              <WarningAmberIcon color="warning" />
            </Tooltip>
          )}
        </Box>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'medium', my: 1 }}>
          {displayValue} {unit}
        </Typography>
        {completeness && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Completeness: {completeness}
          </Typography>
        )}
        <Tooltip title={formula} placement="bottom" arrow>
          <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'underline', cursor: 'help' }}>
            Formula
          </Typography>
        </Tooltip>
      </CardContent>
    </Card>
  );
};

export default KpiCard;
