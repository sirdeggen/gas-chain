import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { DataEntry } from '../App';

interface TransmissionCardProps {
  data: DataEntry;
  onSubmit: (step: string, data: DataEntry) => void;
}

const TransmissionCard: React.FC<TransmissionCardProps> = ({ data, onSubmit }) => {
  return (
    <Card sx={{ width: '40%', height: 300, borderRadius: 4 }}>
      <CardActionArea onClick={() => onSubmit('Transmission', data)}>
        <CardMedia
          component="img"
          height="200"
          image="/src/images/transmission-pipeline.png"
          alt="Transmission Pipeline"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: 18 }}>
            Transmission Pipeline
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 14 }}>
            Submit transmission pipeline measurements and flow data
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TransmissionCard;
