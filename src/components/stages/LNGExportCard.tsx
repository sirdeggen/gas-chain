import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { DataEntry } from '../../app/page';

interface LNGExportCardProps {
  data: DataEntry;
  onSubmit: (step: string, data: DataEntry) => void;
}

const LNGExportCard: React.FC<LNGExportCardProps> = ({ data, onSubmit }) => {
  return (
    <Card sx={{ width: '100%', height: 'auto', borderRadius: 4 }}>
      <CardActionArea onClick={() => onSubmit('LNG Export', data)}>
        <CardMedia
          component="img"
          image="/images/LNG-export-data.png"
          alt="LNG Export"
          sx={{ width: '100%', height: 'auto', aspectRatio: '1.67' }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: 18 }}>
            LNG Export
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 14 }}>
            Submit LNG export terminal data and shipment details
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default LNGExportCard;
