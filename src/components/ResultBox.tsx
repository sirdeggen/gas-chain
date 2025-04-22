import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import RefreshIcon from '@mui/icons-material/Refresh';
import { QueueEntry } from '../app/page';

interface ResultBoxProps {
  entry: QueueEntry,
}

interface ArcResponse {
  txStatus: string;
}

const ResultBox: React.FC<ResultBoxProps> = ({ entry }) => {
  const [arcData, setArcData] = useState<ArcResponse | null>(null)

  function getStatus() {
    fetch('https://arc.taal.com/v1/tx/' + entry.txid)
      .then(res => {
        if (res.ok) {
          res.json().then(d => {
            setArcData(d)
          })
        }
      })
  }

  useEffect(() => {
    if (entry) {
      getStatus()
    }
  }, [entry, getStatus]);

  if (!entry) {
    return <Box sx={{ width: '60%', height: 150, border: '1px dashed #ccc', borderRadius: 2, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="body1" color="textSecondary">No tokens yet.</Typography>
    </Box>;
  }

  return (
    <Box onClick={getStatus} sx={{ position: 'relative', width: '60%', height: 'auto', border: '1px solid #ccc', borderRadius: 2, p: 2, backgroundColor: entry.txid ? '#e6f3e6' : '#f3e6e6' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Immutable Record Details:</Typography>
      <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
        <IconButton size="large" aria-label="refresh">
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Box>
      {entry.step && <Typography variant="body2">Step: {entry.step}</Typography>}
      {entry.data && (
        <>
          {entry.data.entryId && <Typography variant="body2">Entry ID: {entry.data.entryId}</Typography>}
          {entry.data.timestamp && <Typography variant="body2">Timestamp: {entry.data.timestamp}</Typography>}
          {Object.entries(entry.data).map(([key, value]) => {
            if (key !== 'entryId' && key !== 'timestamp') {
              if (typeof value === 'object' && value !== null) {
                return Object.entries(value as object).map(([nestedKey, nestedValue]) => (
                  <Typography key={`${key}-${nestedKey}`} variant="body2">
                    {key}.{nestedKey}: {String(nestedValue)}
                  </Typography>
                ));
              } else {
                return (
                  <Typography key={key} variant="body2">
                    {key}: {String(value)}
                  </Typography>
                );
              }
            }
            return null;
          })}
        </>
      )}
      {arcData && <Typography variant="body2">Hash of Record on BSV Blockchain: {arcData.txStatus}</Typography>}
      {entry.txid && arcData && arcData.txStatus === 'MINED' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <IconButton onClick={() => window.open(`https://whatsonchain.com/tx/${entry.txid}`, '_blank')}>
            <LinkIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ResultBox;
