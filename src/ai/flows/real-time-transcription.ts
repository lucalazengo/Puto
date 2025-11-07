'use server';
/**
 * @fileOverview Implements real-time transcription of spoken words during a meeting.
 *
 * - realTimeTranscription - A function to transcribe spoken words in real-time.
 * - RealTimeTranscriptionInput - The input type for the realTimeTranscription function.
 * - RealTimeTranscriptionOutput - The return type for the realTimeTranscription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RealTimeTranscriptionInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio data URI containing the spoken words to transcribe. Must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RealTimeTranscriptionInput = z.infer<typeof RealTimeTranscriptionInputSchema>;

const RealTimeTranscriptionOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the audio data.'),
});
export type RealTimeTranscriptionOutput = z.infer<typeof RealTimeTranscriptionOutputSchema>;

export async function realTimeTranscription(input: RealTimeTranscriptionInput): Promise<RealTimeTranscriptionOutput> {
  return realTimeTranscriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'realTimeTranscriptionPrompt',
  input: {schema: RealTimeTranscriptionInputSchema},
  output: {schema: RealTimeTranscriptionOutputSchema},
  prompt: `Transcribe the following audio data to text:

Audio: {{media url=audioDataUri}}`,
});

const realTimeTranscriptionFlow = ai.defineFlow(
  {
    name: 'realTimeTranscriptionFlow',
    inputSchema: RealTimeTranscriptionInputSchema,
    outputSchema: RealTimeTranscriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
