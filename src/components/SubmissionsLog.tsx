"use client"
import { Drawer, Paper, Typography, Stack, Box } from '@mui/material';
import { Submission } from '../app/page';

const SubmissionsLog: React.FC<{ submissions: Submission[] }> = ({ submissions }) => {
  if (submissions.length === 0) {
    return null
  }

  return (
    <Drawer
      anchor="bottom"
      open={true}
      variant="persistent"
      sx={{
        '& .MuiDrawer-paper': {
          height: 'auto',
          maxHeight: '30vh',
          overflowY: 'auto',
        }
      }}
    >
      <Paper sx={{ p: 2, m: 1, maxHeight: '20vh', overflowY: 'auto' }}>
        <Typography variant="h6">Submission Log</Typography>
        {submissions.toSorted((a, b) => new Date(b.data.timestamp).getTime() - new Date(a.data.timestamp).getTime()).map((entry) => (
          <Stack
                sx={{ height: 40, borderBottom: '1px solid #ccc', p: 1 }}
                direction="row"
                key={entry.txid}
                spacing={3}
                justifyContent="space-between"
                className='log-entry'
              >
                <Box sx={{ textAlign: 'left' }}><Typography variant="body1">{entry.step}:</Typography></Box>
                <Box sx={{ textAlign: 'right' }}><Typography variant="body1">txid: {entry.txid}</Typography></Box>
                <Box sx={{ textAlign: 'right' }}><Typography variant="body1">{new Date(entry.data.timestamp).toLocaleString()}</Typography></Box>
              </Stack>
            ))}
        </Paper>
      </Drawer>
  )
}

export default SubmissionsLog