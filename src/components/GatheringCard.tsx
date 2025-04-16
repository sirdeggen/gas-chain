import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { DataEntry } from '../App';

interface GatheringCardProps {
  data: DataEntry;
  onSubmit: (step: string, data: DataEntry) => void;
}

const GatheringCard: React.FC<GatheringCardProps> = ({ data, onSubmit }) => {
  return (
    <Card sx={{ width: '60%', height: 300 }}>
      <CardActionArea onClick={() => onSubmit('Gathering', data)}>
        <CardMedia
          component="img"
          height="200"
          image="/src/images/gathering-pipeline.png"
          alt="Gathering Pipeline"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Gathering Pipeline Custody
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Submit data for gathering pipeline transfer and custody changes
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default GatheringCard;
