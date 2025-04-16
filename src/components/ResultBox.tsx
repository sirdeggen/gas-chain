import React from 'react';
import { Box, Typography } from '@mui/material';

interface ResultBoxProps {
  step: string;
  status?: string;
  txId?: string;
  timestamp?: string;
}

const ResultBox: React.FC<ResultBoxProps> = ({ step, status, txId, timestamp }) => {
  return (
    <Box sx={{ width: '40%', height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
      <Typography variant="h6">Results: {step}</Typography>
      {status ? (
        <>
          <Typography>Status: {status}</Typography>
          <Typography>Transaction ID: {txId ?? 'N/A'}</Typography>
          <Typography>Timestamp: {timestamp ?? 'N/A'}</Typography>
        </>
      ) : (
        <Typography>No submission yet</Typography>
      )}
    </Box>
  );
};

export default ResultBox;
