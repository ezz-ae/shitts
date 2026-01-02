'use server';

/**
 * @fileOverview Provides personalized style recommendations based on user swiping history.
 *
 * - getPersonalizedRecommendations - A function that returns personalized style recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  swipingHistory: z
    .array(z.object({
      productId: z.string().describe('The ID of the product.'),
      action: z.enum(['swipeRight', 'swipeLeft', 'swipeUp']).describe('The action taken by the user (swipeRight for cart, swipeLeft for reject, swipeUp for more info).'),
    }))
    .describe('The user swiping history.'),
  purchaseHistory: z
    .array(z.string())
    .optional()
    .describe('The list of IDs of products previously purchased by the user.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of product IDs recommended for the user.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are a personal stylist AI. You will analyze the user's swiping history and purchase history to provide personalized style recommendations.

Consider these factors when making recommendations:

- Swipe Right (Cart): Indicates a strong interest in the product.
- Swipe Left (Reject): Indicates a dislike for the product.
- Swipe Up (More Info): Indicates interest but requires more information.
- Purchase History: Indicates past preferences and style choices.

Based on the following swiping history:
{{#each swipingHistory}}
- Product ID: {{this.productId}}, Action: {{this.action}}
{{/each}}

{% if purchaseHistory %}
Based on the following purchase history:
{{#each purchaseHistory}}
- Product ID: {{this}}
{{/each}}
{% endif %}

Recommend a list of product IDs that the user might like:
`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
