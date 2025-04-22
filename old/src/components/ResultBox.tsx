import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ResultBoxProps {
  data: any
}

const ResultBox: React.FC<ResultBoxProps> = ({ data }) => {
  const [arcData, setArcData] = useState<any>(null)

  function getStatus() {
    fetch('https://arc.taal.com/v1/tx/' + data.txid)
      .then(res => {
        if (res.ok) {
          res.json().then(d => {
            setArcData(d)
          })
        }
      })
  }

  useEffect(() => {
    if (data) {
      getStatus()
    }
  }, [data]);

  if (!data) {
    return <Box sx={{ width: '60%', height: 150, border: '1px dashed #ccc', borderRadius: 2, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="body1" color="textSecondary">No tokens yet.</Typography>
    </Box>;
  }

  return (
    <Box onClick={getStatus} sx={{ position: 'relative', width: '60%', height: 'auto', border: '1px solid #ccc', borderRadius: 2, p: 2, backgroundColor: data.status === 'Submitted' ? '#e6f3e6' : '#f3e6e6' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Immutable Record Details:</Typography>
      <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
        <IconButton size="large" aria-label="refresh">
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Box>
      {data.step && <Typography variant="body2">Step: {data.step}</Typography>}
      {data.data && (
        <>
          {data.data.entryId && <Typography variant="body2">Entry ID: {data.data.entryId}</Typography>}
          {data.data.timestamp && <Typography variant="body2">Timestamp: {data.data.timestamp}</Typography>}
          {Object.entries(data.data).map(([key, value]) => {
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
      {data.txid && arcData && arcData.txStatus === 'MINED' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <IconButton onClick={() => window.open(`https://whatsonchain.com/tx/${data.txid}`, '_blank')}>
            <LinkIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ResultBox;
