import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Stack, Drawer } from '@mui/material';
import WellheadCard from './components/WellheadCard';
import GatheringCard from './components/GatheringCard';
import ProcessingCard from './components/ProcessingCard';
import TransmissionCard from './components/TransmissionCard';
import StorageCard from './components/StorageCard';
import LNGExportCard from './components/LNGExportCard';
import ResultBox from './components/ResultBox';
import { WalletClient, Utils, Hash, PushDrop, WalletProtocol, Random } from '@bsv/sdk'

export interface DataEntry {
  entryId: string;
  timestamp: string;
  [key: string]: any;
}

const App: React.FC = () => {
  const [submissions, setSubmissions] = useState<{ step: string; data: DataEntry; status: string; txid?: string }[]>([]);
  const [wellheadQueue, setWellheadQueue] = useState<{ data: DataEntry; timestamp: string }[]>([]);
  const [gatheringQueue, setGatheringQueue] = useState<{ data: DataEntry; timestamp: string }[]>([]);
  const [processingQueue, setProcessingQueue] = useState<{ data: DataEntry; timestamp: string }[]>([]);
  const [transmissionQueue, setTransmissionQueue] = useState<{ data: DataEntry; timestamp: string }[]>([]);
  const [storageQueue, setStorageQueue] = useState<{ data: DataEntry; timestamp: string }[]>([]);
  const [lngExportQueue, setLngExportQueue] = useState<{ data: DataEntry; timestamp: string }[]>([]);


  async function handleSubmitData(step: string, data: DataEntry) {
    try {
      const entryId = Utils.toBase64(Random(8))
      data.entryId = entryId
      data.timestamp = new Date().toISOString()
      // Add 10% random variability to numeric values in the data
      for (const key in data) {
        if (typeof data[key] === 'number') {
            const variance = data[key] * 0.1; // 10% of the value
            const randomFactor = Math.random() * 2 - 1; // Random value between -1 and 1
            data[key] = data[key] + (variance * randomFactor);
        } else if (typeof data[key] === 'object' && data[key] !== null) {
            for (const nestedKey in data[key]) {
                if (typeof data[key][nestedKey] === 'number') {
                    const nestedVariance = data[key][nestedKey] * 0.1;
                    const nestedRandomFactor = Math.random() * 2 - 1;
                    data[key][nestedKey] = data[key][nestedKey] + (nestedVariance * nestedRandomFactor);
                }
            }
        }
      }

      console.log(`Submitting ${step} data...`);
      const wallet = new WalletClient()
      const sha = Hash.sha256(JSON.stringify(data))
      const shasha = Hash.sha256(sha)
      const pushdrop = new PushDrop(wallet)
      const customInstructions = {
        protocolID: [0, 'natural gas data integrity'] as WalletProtocol,
        keyID: Utils.toBase64(sha)
      }
      const lockingScript = await pushdrop.lock([Utils.toArray(step, 'utf8'), shasha], customInstructions.protocolID, customInstructions.keyID, 'self', true, true, 'after')
      const res = await wallet.createAction({
        description: 'record data within an NFT for natural gas supply chain tracking',
        outputs: [{
          lockingScript: lockingScript.toHex(),
          satoshis: 1,
          outputDescription: 'natural gas supply chain token',
          customInstructions: JSON.stringify(customInstructions),
          basket: 'natural gas'
        }]
      })
      console.log({ res })
      await submitDataToBackEndAndSaveAHashToBlockchain(data);
      setSubmissions((prev) => [...prev, { step, data, status: 'Submitted', txid: res.txid }]);
      switch (step) {
        case 'Wellhead':
          setWellheadQueue((prev) => [...prev, { data, timestamp: new Date().toISOString(), txid: res.txid }]);
          break;
        case 'Gathering':
          setGatheringQueue((prev) => [...prev, { data, timestamp: new Date().toISOString(), txid: res.txid }]);
          break;
        case 'Processing':
          setProcessingQueue((prev) => [...prev, { data, timestamp: new Date().toISOString(), txid: res.txid }]);
          break;
        case 'Transmission':
          setTransmissionQueue((prev) => [...prev, { data, timestamp: new Date().toISOString(), txid: res.txid }]);
          break;
        case 'Storage':
          setStorageQueue((prev) => [...prev, { data, timestamp: new Date().toISOString(), txid: res.txid }]);
          break;
        case 'LNG Export':
          setLngExportQueue((prev) => [...prev, { data, timestamp: new Date().toISOString(), txid: res.txid }]);
          break;
      }
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
    const entry = submissions.find((e) => e.step === step);
    if (entry) {
      return {
        status: entry.status,
        txid: entry.txid,
        timestamp: entry.data.timestamp
      };
    }
    return null;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', pt: 15, pb: 40 }}>
      <Typography variant="h4" align="center" color="white" gutterBottom sx={{ fontWeight: 'bold' }}>
        Natural Gas Blockchain Demo
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <WellheadCard data={simulateData.wellhead} onSubmit={handleSubmitData} />
          <ResultBox step="Wellhead" status={getSubmissionResult('Wellhead')?.status} txid={getSubmissionResult('Wellhead')?.txid} timestamp={getSubmissionResult('Wellhead')?.timestamp} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <GatheringCard data={simulateData.gathering} onSubmit={handleSubmitData} />
          <ResultBox step="Gathering" status={getSubmissionResult('Gathering')?.status} txid={getSubmissionResult('Gathering')?.txid} timestamp={getSubmissionResult('Gathering')?.timestamp} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <ProcessingCard data={simulateData.processing} onSubmit={handleSubmitData} />
          <ResultBox step="Processing" status={getSubmissionResult('Processing')?.status} txid={getSubmissionResult('Processing')?.txid} timestamp={getSubmissionResult('Processing')?.timestamp} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <TransmissionCard data={simulateData.transmission} onSubmit={handleSubmitData} />
          <ResultBox step="Transmission" status={getSubmissionResult('Transmission')?.status} txid={getSubmissionResult('Transmission')?.txid} timestamp={getSubmissionResult('Transmission')?.timestamp} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <StorageCard data={simulateData.storage} onSubmit={handleSubmitData} />
          <ResultBox step="Storage" status={getSubmissionResult('Storage')?.status} txid={getSubmissionResult('Storage')?.txid} timestamp={getSubmissionResult('Storage')?.timestamp} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <LNGExportCard data={simulateData.lngExport} onSubmit={handleSubmitData} />
          <ResultBox step="LNG Export" status={getSubmissionResult('LNG Export')?.status} txid={getSubmissionResult('LNG Export')?.txid} timestamp={getSubmissionResult('LNG Export')?.timestamp} />
        </Box>
      </Box>

      {submissions.length > 0 && (
        <Drawer
          anchor="bottom"
          open={true}
          variant="persistent"
          sx={{
            '& .MuiDrawer-paper': {
              height: 'auto',
              maxHeight: '30vh',
              overflowY: 'auto',
            },
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
                <Box sx={{ textAlign: 'left' }}>{entry.step}:</Box>
                <Box sx={{ textAlign: 'right' }}>{entry.data.entryId}</Box>
                <Box sx={{ textAlign: 'right' }}>txid: {entry.txid}</Box>
                <Box sx={{ textAlign: 'right' }}>at {entry.data.timestamp}</Box>
              </Stack>
            ))}
          </Paper>
        </Drawer>
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
