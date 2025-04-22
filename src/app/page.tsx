"use client"
import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Stack, Drawer } from '@mui/material';
import WellheadCard from '../components/stages/WellheadCard';
import GatheringCard from '../components/stages/GatheringCard';
import ProcessingCard from '../components/stages/ProcessingCard';
import TransmissionCard from '../components/stages/TransmissionCard';
import StorageCard from '../components/stages/StorageCard';
import LNGExportCard from '../components/stages/LNGExportCard';
import ResultBox from '../components/ResultBox';
import { WalletClient, Utils, Hash, PushDrop, WalletProtocol, Random, Transaction, ARC, WalletWireTransceiver, HTTPWalletWire } from '@bsv/sdk'

export interface DataEntry {
  entryId: string;
  timestamp: string;
  [key: string]: any;
}

const App: React.FC = () => {
  const [submissions, setSubmissions] = useState<{ step: string; data: DataEntry; txid: string, arc: any }[]>([]);
  const [wellheadQueue, setWellheadQueue] = useState<{ data: DataEntry; txid: string }[]>([]);
  const [gatheringQueue, setGatheringQueue] = useState<{ data: DataEntry; txid: string }[]>([]);
  const [processingQueue, setProcessingQueue] = useState<{ data: DataEntry; txid: string }[]>([]);
  const [transmissionQueue, setTransmissionQueue] = useState<{ data: DataEntry; txid: string }[]>([]);
  const [storageQueue, setStorageQueue] = useState<{ data: DataEntry; txid: string }[]>([]);
  const [lngExportQueue, setLngExportQueue] = useState<{ data: DataEntry; txid: string }[]>([]);

  async function handleSubmitData(step: string, data: DataEntry) {
    try {
      const entryId = Utils.toBase64(Random(8))
      data.entryId = entryId
      data.timestamp = new Date().toISOString()
      data = simulatedData(data)

      const { txid, arc } = await createTokenOnBSV(data, step)

      setSubmissions((prev) => [...prev, { step, data, txid, arc }])
      switch (step) {
        case 'Wellhead':
          setWellheadQueue((prev) => [...prev, { data, txid }])
          break
        case 'Gathering':
          setGatheringQueue((prev) => [...prev, { data, txid }])
          break
        case 'Processing':
          setProcessingQueue((prev) => [...prev, { data, txid }])
          break
        case 'Transmission':
          setTransmissionQueue((prev) => [...prev, { data, txid }])
          break
        case 'Storage':
          setStorageQueue((prev) => [...prev, { data, txid }])
          break
        case 'LNG Export':
          setLngExportQueue((prev) => [...prev, { data, txid }])
          break
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  }

  /**
   * Simulates data by adding 10% random variability to numeric values in the example data
   * @param data The example data to be varied
   * @returns The simulated data
   */
  function simulatedData(data: DataEntry): DataEntry {
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
    return data
  }

  /**
   * Uses the BSV Blockchain to create a token capturing the data as a hash, timestamping it, 
   * and assigning ownership to the token which represents the volume of gas.
   * 
   * @param data The data to be stored
   * @param step The step of the process
   * @returns The transaction ID and broadcast response
   */
  async function createTokenOnBSV(data: DataEntry, step: string): Promise<{ txid: string, arc: any }> {
    
    // Initialize the wallet client with the remote signer to emulate IoT Device signing off on its data.
    const iotSigner = new WalletWireTransceiver(new HTTPWalletWire('https://natural-chain.vercel.app', 'https://natural-chain.vercel.app/api'))

    // Initialize the wallet client with the remote signer
    const wallet = new WalletClient(iotSigner)

    // Create a hash of the data
    const sha = Hash.sha256(JSON.stringify(data))
    const shasha = Hash.sha256(sha)

    // Create a new pushdrop token
    const pushdrop = new PushDrop(wallet)
    const customInstructions = {
        protocolID: [0, 'natural gas data integrity'] as WalletProtocol,
        keyID: Utils.toBase64(sha)
    }

    // Create a locking script for the pushdrop token
    const lockingScript = await pushdrop.lock([Utils.toArray(step, 'utf8'), shasha], customInstructions.protocolID, customInstructions.keyID, 'self', true, true, 'after')
    
    // Spend the current state of the token to create an immutable chain of custody
    // const unlockingScript = pushdrop.redeem()
    // const inputs: CreateActionInput[] = [{
    //   unlockingScript: pushdrop.unlock(),
    //   satoshis: 1,
    //   outputDescription: 'natural gas supply chain token',
    //   customInstructions: JSON.stringify(customInstructions),
    //   basket: 'natural gas'
    // }]

    const res = await wallet.createAction({
      description: 'record data within an NFT for natural gas supply chain tracking',
      // inputs,
      outputs: [{
        lockingScript: lockingScript.toHex(),
        satoshis: 1,
        outputDescription: 'natural gas supply chain token',
        customInstructions: JSON.stringify(customInstructions),
        basket: 'natural gas'
      }]
    })
    const tx = Transaction.fromAtomicBEEF(res.tx as number[])
    const arc = await tx.broadcast(new ARC('https://arc.taal.com', {
      headers: {
        'X-WaitFor': 'SEEN_ON_NETWORK'
      }
    }))
    console.log({ arc })
    return { txid: res.txid as string, arc }
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', pt: 10, pb: 40 }}>
      <Typography variant="h4" align="center" color="white" gutterBottom sx={{ py: 5,fontWeight: 'bold', textShadow: '2px 1px 2px black' }}>
        Natural Gas Blockchain Demo
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <WellheadCard data={simulateData.wellhead} onSubmit={handleSubmitData} />
          <ResultBox data={wellheadQueue[wellheadQueue.length - 1]} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <GatheringCard data={simulateData.gathering} onSubmit={handleSubmitData} />
          <ResultBox data={gatheringQueue[gatheringQueue.length - 1]} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <ProcessingCard data={simulateData.processing} onSubmit={handleSubmitData} />
          <ResultBox data={processingQueue[processingQueue.length - 1]} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <TransmissionCard data={simulateData.transmission} onSubmit={handleSubmitData} />
          <ResultBox data={transmissionQueue[transmissionQueue.length - 1]} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <StorageCard data={simulateData.storage} onSubmit={handleSubmitData} />
          <ResultBox data={storageQueue[storageQueue.length - 1]} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <LNGExportCard data={simulateData.lngExport} onSubmit={handleSubmitData} />
          <ResultBox data={lngExportQueue[lngExportQueue.length - 1]} />
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
                <Box sx={{ textAlign: 'right' }}>txid: {entry.txid}</Box>
                <Box sx={{ textAlign: 'right' }}>{new Date(entry.data.timestamp).toLocaleString()}</Box>
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
