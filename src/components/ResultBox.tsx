import React from 'react';
import { Box, Typography } from '@mui/material';

interface ResultBoxProps {
  step: string;
  status?: string;
  txid?: string;
  timestamp?: string;
}

const ResultBox: React.FC<ResultBoxProps> = ({ step, status, txid, timestamp }) => {
  if (!status) {
    return <Box sx={{ width: 300, height: 150, border: '1px dashed #ccc', borderRadius: 2, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="body1" color="textSecondary">{step} data not yet submitted.</Typography>
    </Box>;
  }

  return (
    <Box sx={{ width: 300, height: 150, border: '1px solid #ccc', borderRadius: 2, p: 2, backgroundColor: status === 'Submitted' ? '#e6f3e6' : '#f3e6e6' }}>
      <Typography variant="h6">{step} Result</Typography>
      {txid && <Typography variant="body2" sx={{ p: 1, width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>txid: {txid}</Typography>}
      {timestamp && <Typography variant="body2">Timestamp: {timestamp}</Typography>}
    </Box>
  );
};

export default ResultBox;
