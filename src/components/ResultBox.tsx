"use client"
import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import RefreshIcon from '@mui/icons-material/Refresh';
import { QueueEntry } from '../app/page';

interface ResultBoxProps {
  entry: QueueEntry,
}

interface ArcResponse {
  txStatus: string
}

const ResultBox: React.FC<ResultBoxProps> = ({ entry: startingData }) => {
  const [arcData, setArcData] = useState<ArcResponse | null>(null)

  const getStatus = async () => {
    const res = await (await fetch('https://arc.taal.com/v1/tx/' + startingData.txid)).json()
    setArcData(res)
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const flatJSON = (obj: any, parentKey = '') => {
    const result: any = {}
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(result, flatJSON(obj[key], parentKey + (parentKey ? '.' : '') + key))
      } else {
        result[parentKey + (parentKey ? '.' : '') + key] = obj[key]
      }
    }
    return result
  }

  const entry = flatJSON(startingData)

  if (!startingData) {
    return <Box sx={{ my: 3,
      height: 150, border: '1px dashed #ccc', borderRadius: 2, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
      sm: { width: '100%' }, 
      md: { width: '60%' } }}>
      <Typography variant="body1" color="textSecondary">No tokens yet.</Typography>
    </Box>
  }

  return (
    <Box onClick={getStatus} sx={{ overflow: 'hidden', my:3, sm: { width: '60%' }, md: {width: '60%' }, position: 'relative', height: 'auto', border: '1px solid #ccc', borderRadius: 0, p: 2, backgroundColor: entry.txid ? '#e6f3e6' : '#f3e6e6' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Immutable Record Details:</Typography>
      <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
        <IconButton size="large" aria-label="refresh">
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Box>
      {entry && (
        <>
          {entry.entryId && <Typography variant="body2">Entry ID: {entry.entryId}</Typography>}
          {entry.timestamp && <Typography variant="body2">Timestamp: {entry.timestamp}</Typography>}
          {Object.entries(entry).map(([key, value]) => (
            <Typography key={key} variant="body2">
              {key}: {String(value)}
            </Typography>
          ))}
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
  )
}

export default ResultBox
