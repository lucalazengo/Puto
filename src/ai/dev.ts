import { config } from 'dotenv';
config();

import '@/ai/flows/real-time-transcription.ts';
import '@/ai/flows/generate-summary.ts';
import '@/ai/flows/intelligent-action-item-assignment.ts';