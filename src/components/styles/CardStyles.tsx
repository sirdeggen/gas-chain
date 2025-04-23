"use client"
import { SxProps, Theme } from '@mui/material';

// Common styles for card media to maintain consistent aspect ratio
export const cardMediaSx: SxProps<Theme> = {
  aspectRatio: '1.67',
  width: '100%',
  height: 'auto',
  objectFit: 'cover'
};

// Common styles for card container
export const cardContainerSx: SxProps<Theme> = {
  width: '100%',
  height: 'auto',
  borderRadius: 4,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, opacity 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
  }
};

// Disabled card style
export const disabledCardSx: SxProps<Theme> = {
  opacity: 0.7,
  cursor: 'not-allowed',
  '&:hover': {
    transform: 'none',
    boxShadow: 'none'
  }
};

// Typography styles
export const cardTitleSx: SxProps<Theme> = {
  fontSize: 18,
  fontWeight: 500
};

export const cardDescriptionSx: SxProps<Theme> = {
  fontSize: 14
};
