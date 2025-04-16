import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { DataEntry } from '../App';

interface StorageCardProps {
  data: DataEntry;
  onSubmit: (step: string, data: DataEntry) => void;
}

const StorageCard: React.FC<StorageCardProps> = ({ data, onSubmit }) => {
  return (
    <Card sx={{ width: '60%', height: 300 }}>
      <CardActionArea onClick={() => onSubmit('Storage', data)}>
        <CardMedia
          component="img"
          height="200"
          image="/src/images/storage-facility.png"
          alt="Storage Facility"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Storage Facility Data
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Submit storage facility status and inventory levels
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default StorageCard;
