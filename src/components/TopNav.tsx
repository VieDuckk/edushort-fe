'use client';

import React from 'react';
import { AnimeHeaderBanner } from './AnimeHeaderBanner';

interface TopNavProps {
  watchedCount?: number;
}

export const TopNav: React.FC<TopNavProps> = ({ watchedCount }) => {
  return <AnimeHeaderBanner watchedCount={watchedCount} />;
};
