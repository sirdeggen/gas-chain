import React, { useState } from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import WellheadCard from './components/WellheadCard';
import GatheringCard from './components/GatheringCard';
import ProcessingCard from './components/ProcessingCard';
import TransmissionCard from './components/TransmissionCard';
import StorageCard from './components/StorageCard';
import LNGExportCard from './components/LNGExportCard';
import ResultBox from './components/ResultBox';

export interface DataEntry {
  entryId: string;
  timestamp: string;
  [key: string]: any;
}

const App: React.FC = () => {
  const [submissions, setSubmissions] = useState<{ step: string; data: DataEntry; status: string; txId?: string }[]>([]);

  async function handleSubmitData(step: string, data: DataEntry) {
    try {
      console.log(`Submitting ${step} data...`);
      await submitDataToBackEndAndSaveAHashToBlockchain(data);
      const txId = `TX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      setSubmissions((prev) => [...prev, { step, data, status: 'Submitted', txId }]);
    } catch (error) {
      console.error('Error submitting data:', error);
      setSubmissions((prev) => [...prev, { step, data, status: 'Error' }]);
    }
  }

  const simulateData = {
    wellhead: {
      entryId: 'whd-001234567',
      timestamp: new Date().toISOString(),
      location: { latitude: 31.9686, longitude: -99.9018 },
      wellInfo: { wellId: 'TX-WELL-087654', operator: 'TexStar Energy LLC' },
      measurements: {
        flowRateMcfh: 1050.75,
        pressurePsi: 1450,
        temperatureF: 95.3,
        composition: {
          methanePct: 89.5,
          ethanePct: 4.1,
          propanePct: 1.8,
          co2Pct: 0.6,
          nitrogenPct: 4.0
        }
      },
      signature: 'f4a9b5e1cd7...digitalSignature'
    },
    gathering: {
      entryId: 'ctp-987654321',
      timestamp: new Date().toISOString(),
      transferLocation: 'Gathering Point A32',
      operatorFrom: 'TexStar Energy LLC',
      operatorTo: 'BlueLine Pipelines Inc.',
      volumeTransferredMcf: 24500.50,
      pressurePsi: 1350,
      energyContentBTUcf: 1035,
      composition: {
        methanePct: 90.1,
        ethanePct: 4.0,
        propanePct: 1.7,
        co2Pct: 0.5,
        nitrogenPct: 3.7
      },
      signature: '8c7e2fd31ab...digitalSignature'
    },
    processing: {
      entryId: 'ppd-112233445',
      timestamp: new Date().toISOString(),
      processingFacility: { facilityId: 'Eagle Ford Processing Plant #4', operator: 'Eagle Gas Processors Ltd.' },
      inputVolumeMcf: 120000,
      outputVolumeMcf: 115800,
      processingLossPct: 3.5,
      energyContentOutBTUcf: 1040,
      compositionOut: {
        methanePct: 92.8,
        ethanePct: 3.5,
        propanePct: 1.5,
        co2Pct: 0.4,
        nitrogenPct: 1.8
      },
      signature: 'bc5dfaa4c32...digitalSignature'
    },
    transmission: {
      entryId: 'tpd-556677889',
      timestamp: new Date().toISOString(),
      pipelineSegment: { segmentId: 'TransP-Section-18B', operator: 'Interstate Transmission Co.' },
      measurements: { flowRateMcfh: 25500, pressurePsi: 950, temperatureF: 78.4 },
      composition: {
        methanePct: 92.7,
        ethanePct: 3.6,
        propanePct: 1.4,
        co2Pct: 0.3,
        nitrogenPct: 2.0
      },
      signature: 'd9eaf1cc3ef...digitalSignature'
    },
    storage: {
      entryId: 'sfd-998877665',
      timestamp: new Date().toISOString(),
      storageFacility: { facilityId: 'Gulf Coast Storage Hub 12', operator: 'Southern Storage Partners' },
      operation: 'injection',
      volumeMcf: 75000,
      storagePressurePsi: 1700,
      inventoryLevelPct: 68.2,
      composition: {
        methanePct: 92.6,
        ethanePct: 3.7,
        propanePct: 1.3,
        co2Pct: 0.3,
        nitrogenPct: 2.1
      },
      signature: 'e7bc55de123...digitalSignature'
    },
    lngExport: {
      entryId: 'lng-443322110',
      timestamp: new Date().toISOString(),
      lngTerminal: { terminalId: 'Freeport LNG Export Terminal', operator: 'Freeport LNG LLC' },
      vessel: { vesselId: 'LNG Tanker Neptune Star', destinationPort: 'Rotterdam, Netherlands' },
      exportVolumeMcf: 300000,
      energyContentBTUcf: 1045,
      composition: {
        methanePct: 92.9,
        ethanePct: 3.5,
        propanePct: 1.4,
        co2Pct: 0.2,
        nitrogenPct: 2.0
      },
      signature: 'a3ef77bda44...digitalSignature'
    }
  };

  const getSubmissionResult = (step: string) => {
    const submission = submissions.find(s => s.step === step);
    if (!submission) return null;
    return {
      status: submission.status,
      txId: submission.txId || 'N/A',
      timestamp: submission.data.timestamp
    };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Natural Gas Blockchain Demo
      </Typography>
      <Grid container spacing={3} direction="column">
        <Grid xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
            <WellheadCard data={simulateData.wellhead} onSubmit={handleSubmitData} />
            <ResultBox step="Wellhead" status={getSubmissionResult('Wellhead')?.status} txId={getSubmissionResult('Wellhead')?.txId} timestamp={getSubmissionResult('Wellhead')?.timestamp} />
          </Box>
        </Grid>
        <Grid xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
            <GatheringCard data={simulateData.gathering} onSubmit={handleSubmitData} />
            <ResultBox step="Gathering" status={getSubmissionResult('Gathering')?.status} txId={getSubmissionResult('Gathering')?.txId} timestamp={getSubmissionResult('Gathering')?.timestamp} />
          </Box>
        </Grid>
        <Grid xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
            <ProcessingCard data={simulateData.processing} onSubmit={handleSubmitData} />
            <ResultBox step="Processing" status={getSubmissionResult('Processing')?.status} txId={getSubmissionResult('Processing')?.txId} timestamp={getSubmissionResult('Processing')?.timestamp} />
          </Box>
        </Grid>
        <Grid xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
            <TransmissionCard data={simulateData.transmission} onSubmit={handleSubmitData} />
            <ResultBox step="Transmission" status={getSubmissionResult('Transmission')?.status} txId={getSubmissionResult('Transmission')?.txId} timestamp={getSubmissionResult('Transmission')?.timestamp} />
          </Box>
        </Grid>
        <Grid xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
            <StorageCard data={simulateData.storage} onSubmit={handleSubmitData} />
            <ResultBox step="Storage" status={getSubmissionResult('Storage')?.status} txId={getSubmissionResult('Storage')?.txId} timestamp={getSubmissionResult('Storage')?.timestamp} />
          </Box>
        </Grid>
        <Grid xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
            <LNGExportCard data={simulateData.lngExport} onSubmit={handleSubmitData} />
            <ResultBox step="LNG Export" status={getSubmissionResult('LNG Export')?.status} txId={getSubmissionResult('LNG Export')?.txId} timestamp={getSubmissionResult('LNG Export')?.timestamp} />
          </Box>
        </Grid>
      </Grid>

      {submissions.length > 0 && (
        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6">Submission Log</Typography>
          {submissions.map((entry, idx) => (
            <Typography key={idx}>
              {entry.step}: {entry.status} {entry.txId ? `- TX ID: ${entry.txId}` : ''} at {entry.data.timestamp}
            </Typography>
          ))}
        </Paper>
      )}
    </Container>
  );
};

export default App;

// Placeholder functions
async function submitDataToBackEndAndSaveAHashToBlockchain(data: any) {
  // Simulate async blockchain transaction call
  return new Promise((resolve) => setTimeout(resolve, 500));
}

async function retrieveRecordFromDatabaseAndTimestampProofFromBlockchain(id: string) {
  // Simulate async retrieval and proof verification call
  return new Promise((resolve) => setTimeout(resolve, 500));
}
