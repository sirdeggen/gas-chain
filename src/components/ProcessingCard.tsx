import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { DataEntry } from '../App';

interface ProcessingCardProps {
  data: DataEntry;
  onSubmit: (step: string, data: DataEntry) => void;
}

const ProcessingCard: React.FC<ProcessingCardProps> = ({ data, onSubmit }) => {
  return (
    <Card sx={{ width: '60%', height: 300 }}>
      <CardActionArea onClick={() => onSubmit('Processing', data)}>
        <CardMedia
          component="img"
          height="200"
          image="/src/images/processing-plant.png"
          alt="Processing Plant"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Processing Plant Data
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Submit data from processing facilities about input/output volumes
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProcessingCard;
