import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { DataEntry } from '../../app/page';

interface WellheadCardProps {
  data: DataEntry;
  onSubmit: (step: string, data: DataEntry) => void;
}

const WellheadCard: React.FC<WellheadCardProps> = ({ data, onSubmit }) => {
  return (
    <Card sx={{ width: '100%', height: 'auto', borderRadius: 4 }}>
      <CardActionArea onClick={() => onSubmit('Wellhead', data)}>
        <CardMedia
          component="img"
          image="/images/wellhead.png"
          alt="Wellhead"
          sx={{ width: '100%', height: 'auto', aspectRatio: '1.67' }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: 18 }}>
            Wellhead
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 14 }}>
            Submit data from wellhead measurements including flow rate and composition
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default WellheadCard;
