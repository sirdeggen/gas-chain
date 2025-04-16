import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { DataEntry } from '../App';

interface LNGExportCardProps {
  data: DataEntry;
  onSubmit: (step: string, data: DataEntry) => void;
}

const LNGExportCard: React.FC<LNGExportCardProps> = ({ data, onSubmit }) => {
  return (
    <Card sx={{ width: '60%', height: 300 }}>
      <CardActionArea onClick={() => onSubmit('LNG Export', data)}>
        <CardMedia
          component="img"
          height="200"
          image="/src/images/LNG-export-data.png"
          alt="LNG Export"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            LNG Export Data
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Submit LNG export terminal data and shipment details
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default LNGExportCard;
