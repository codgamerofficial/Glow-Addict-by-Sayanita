import React from 'react';
import AIClient from './AIClient';
import { getAdminAIRecommendations } from '@/actions/admin';
import { adminAIRecommendations as fallbackRecommendations } from '@/data/admin-seed';

export default async function AIPage() {
  const dbRecommendations = await getAdminAIRecommendations();
  const recommendations = dbRecommendations.length > 0 ? dbRecommendations : fallbackRecommendations;
  
  return <AIClient initialRecommendations={recommendations} />;
}
