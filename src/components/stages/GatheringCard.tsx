import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { DataEntry } from '../../app/page';

interface GatheringCardProps {
  data: DataEntry;
  onSubmit: (step: string, data: DataEntry) => void;
}

const GatheringCard: React.FC<GatheringCardProps> = ({ data, onSubmit }) => {
  return (
    <Card sx={{ width: '100%', height: 'auto', borderRadius: 4 }}>
      <CardActionArea onClick={() => onSubmit('Gathering', data)}>
        <CardMedia
          component="img"
          image="/images/gathering-pipeline.png"
          alt="Gathering Pipeline"
          sx={{ width: '100%', height: 'auto', aspectRatio: '1.67' }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: 18 }}>
            Gathering Pipeline Custody
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 14 }}>
            Submit data for gathering pipeline transfer and custody changes
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default GatheringCard;
