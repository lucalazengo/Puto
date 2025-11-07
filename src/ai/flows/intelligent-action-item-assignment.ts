// A Genkit flow for intelligent action item assignment based on meeting discussions.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ActionItemSuggestionInputSchema = z.object({
  meetingTranscript: z
    .string()
    .describe('The transcript of the meeting discussion.'),
  participants: z
    .array(z.string())
    .describe('List of participants in the meeting.'),
});
export type ActionItemSuggestionInput =
  z.infer<typeof ActionItemSuggestionInputSchema>;

const ActionItemSuggestionOutputSchema = z.array(z.object({
  item: z.string().describe('The suggested action item.'),
  assignee: z.string().describe('The suggested assignee for the action item.'),
  deadline: z
    .string()
    .optional()
    .describe('The suggested deadline for the action item.'),
}));
export type ActionItemSuggestionOutput =
  z.infer<typeof ActionItemSuggestionOutputSchema>;

export async function suggestActionItems(
  input: ActionItemSuggestionInput
): Promise<ActionItemSuggestionOutput> {
  return suggestActionItemsFlow(input);
}

const suggestActionItemsPrompt = ai.definePrompt({
  name: 'suggestActionItemsPrompt',
  input: {schema: ActionItemSuggestionInputSchema},
  output: {schema: ActionItemSuggestionOutputSchema},
  prompt: `Based on the following meeting transcript, suggest action items with assignees and deadlines (if applicable). The action items should be specific and actionable. Use the participants list to assign the action items.

Meeting Transcript:
{{meetingTranscript}}

Participants:
{{#each participants}}- {{this}}\n{{/each}}

Format the output as a JSON array of objects with 'item', 'assignee', and optional 'deadline' fields.`,
});

const suggestActionItemsFlow = ai.defineFlow(
  {
    name: 'suggestActionItemsFlow',
    inputSchema: ActionItemSuggestionInputSchema,
    outputSchema: ActionItemSuggestionOutputSchema,
  },
  async input => {
    const {output} = await suggestActionItemsPrompt(input);
    return output!;
  }
);
