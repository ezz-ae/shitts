'use server';

import { 
  getPersonalizedRecommendations, 
  PersonalizedRecommendationsInput 
} from '@/ai/flows/personalized-style-recommendations';

export async function fetchRecommendations(input: PersonalizedRecommendationsInput): Promise<string[]> {
  try {
    // The AI flow expects a specific enum type which might not match the client-side string.
    // We can safely cast here as the values are identical.
    const castedInput = {
      ...input,
      swipingHistory: input.swipingHistory.map(h => ({
        ...h,
        action: h.action as 'swipeRight' | 'swipeLeft' | 'swipeUp',
      })),
    };
    const result = await getPersonalizedRecommendations(castedInput);
    return result.recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    // Return an empty array or re-throw to handle it on the client
    return [];
  }
}
