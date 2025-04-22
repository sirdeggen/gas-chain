import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { DataEntry } from '../../App';

interface LNGExportCardProps {
  data: DataEntry;
  onSubmit: (step: string, data: DataEntry) => void;
}

const LNGExportCard: React.FC<LNGExportCardProps> = ({ data, onSubmit }) => {
  return (
    <Card sx={{ width: '40%', height: 300, borderRadius: 4 }}>
      <CardActionArea onClick={() => onSubmit('LNG Export', data)}>
        <CardMedia
          component="img"
          height="200"
          image="/images/LNG-export-data.png"
          alt="LNG Export"
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
