import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { DataEntry } from '../App';

interface WellheadCardProps {
  data: DataEntry;
  onSubmit: (step: string, data: DataEntry) => void;
}

const WellheadCard: React.FC<WellheadCardProps> = ({ data, onSubmit }) => {
  return (
    <Card sx={{ width: '60%', height: 300 }}>
      <CardActionArea onClick={() => onSubmit('Wellhead', data)}>
        <CardMedia
          component="img"
          height="200"
          image="/src/images/wellhead.png"
          alt="Wellhead"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Wellhead Data Entry
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Submit data from wellhead measurements including flow rate and composition
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default WellheadCard;
