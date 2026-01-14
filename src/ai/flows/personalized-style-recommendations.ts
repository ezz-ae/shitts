'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  swipingHistory: z
    .array(z.object({
      productId: z.string().describe('The ID of the product.'),
      action: z.enum(['swipeRight', 'swipeLeft', 'swipeUp']).describe('The action taken by the user.'),
      name: z.string().optional(),
      category: z.string().optional(),
      description: z.string().optional(),
    }))
    .describe('The user swiping history with product details.'),
  purchaseHistory: z
    .array(z.string())
    .optional()
    .describe('The list of IDs of products previously purchased or added to cart.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of product IDs recommended for the user.'),
  stylePersona: z.string().describe('A brief description of the user\'s current style persona based on their swipes.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an elite Personal Stylist AI for "StyleSwipe", a premium 5-minute daily fashion curation app.
Your goal is to analyze the user's swiping behavior to deeply understand their "Style DNA".

INSTRUCTIONS:
1. **Identify Patterns**: Look beyond product IDs. If a user swipes LEFT (rejects) multiple items with similar traits (e.g., "typography", "bright neon", "oversized"), assume they dislike that specific trait for now.
2. **Prioritize Cart/Right Swipes**: Items swiped RIGHT are the core of their style profile. Find products with similar silhouettes, fabrics, or vibes.
3. **Daily Curation**: The user only sees a few items a day. Every recommendation must be high-impact.
4. **Style Persona**: Create a short, catchy 2-3 word name for their current style (e.g., "Minimalist Urbanite", "Vintage Romantic", "Modern Grunge").

Swiping History:
{{#each swipingHistory}}
- {{this.name}} ({{this.category}}): {{this.action}}. Description: {{this.description}}
{{/each}}

Purchase/Cart History IDs: {{purchaseHistory}}

Return 10 personalized product IDs and the Style Persona.
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
