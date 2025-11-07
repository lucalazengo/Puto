'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { meetings, participants } from './data';
import type { ActionItem, Meeting } from './types';
import { generateSummary } from '@/ai/flows/generate-summary';
import { suggestActionItems as suggestActionItemsFlow } from '@/ai/flows/intelligent-action-item-assignment';
import { realTimeTranscription } from '@/ai/flows/real-time-transcription';

const NewMeetingSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.'),
  date: z.string().min(1, 'A data é obrigatória.'),
  participants: z.string().min(1, 'Pelo menos um participante é obrigatório.'),
  agenda: z.string().min(10, 'A pauta deve ter pelo menos 10 caracteres.'),
});

function findMeeting(id: string) {
  const meeting = meetings.find((m) => m.id === id);
  if (!meeting) {
    throw new Error('Reunião não encontrada');
  }
  return meeting;
}

export async function createMeeting(prevState: any, formData: FormData) {
  const validatedFields = NewMeetingSchema.safeParse({
    title: formData.get('title'),
    date: formData.get('date'),
    participants: formData.get('participants'),
    agenda: formData.get('agenda'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const participantIds = validatedFields.data.participants.split(',');
  const meetingParticipants = participants.filter((p) => participantIds.includes(p.id));

  if (meetingParticipants.length !== participantIds.length) {
    return {
      errors: { participants: ['ID de participante inválido encontrado.'] },
    };
  }

  const newMeeting: Meeting = {
    id: `mtg-${Date.now()}`,
    title: validatedFields.data.title,
    date: new Date(validatedFields.data.date).toISOString(),
    agenda: validatedFields.data.agenda,
    participants: meetingParticipants,
    actionItems: [],
    notes: '',
    summary: '',
  };

  meetings.unshift(newMeeting);
  
  revalidatePath('/dashboard');
  revalidatePath(`/meetings/${newMeeting.id}`);
  redirect(`/meetings/${newMeeting.id}`);
}

export async function updateNotes(meetingId: string, notes: string) {
  try {
    const meeting = findMeeting(meetingId);
    meeting.notes = notes;
    revalidatePath(`/meetings/${meetingId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function transcribeAudio(meetingId: string, audioDataUri: string) {
  try {
    const result = await realTimeTranscription({ audioDataUri });
    const meeting = findMeeting(meetingId);
    meeting.notes = (meeting.notes ? meeting.notes + '\n' : '') + result.transcription;
    revalidatePath(`/meetings/${meetingId}`);
    return { transcript: result.transcription };
  } catch (error) {
    return { error: 'Falha ao transcrever o áudio.' };
  }
}

export async function generateMeetingSummary(meetingId: string) {
  try {
    const meeting = findMeeting(meetingId);
    if (!meeting.notes) {
      return { error: 'Não há anotações para resumir.' };
    }
    const result = await generateSummary({ meetingNotes: meeting.notes });
    meeting.summary = result.summary;
    revalidatePath(`/meetings/${meetingId}`);
    return { summary: result.summary };
  } catch (error) {
    return { error: 'Falha ao gerar o resumo.' };
  }
}

export async function suggestActionItems(meetingId: string) {
  try {
    const meeting = findMeeting(meetingId);
    if (!meeting.notes) {
      return { error: 'Não há anotações para analisar para itens de ação.' };
    }
    const result = await suggestActionItemsFlow({
      meetingTranscript: meeting.notes,
      participants: meeting.participants.map(p => p.name),
    });

    const suggestionsWithParticipants = result.map(item => {
      const assignee = participants.find(p => p.name === item.assignee);
      return { ...item, assigneeId: assignee?.id };
    }).filter(item => item.assigneeId);

    return { suggestions: suggestionsWithParticipants };
  } catch (error) {
    return { error: 'Falha ao sugerir itens de ação.' };
  }
}

export async function addActionItem(meetingId: string, item: Omit<ActionItem, 'id' | 'completed'>) {
    try {
        const meeting = findMeeting(meetingId);
        const newActionItem: ActionItem = {
            ...item,
            id: `ai-${Date.now()}`,
            completed: false,
        };
        meeting.actionItems.push(newActionItem);
        revalidatePath(`/meetings/${meetingId}`);
        return { success: true, item: newActionItem };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function toggleActionItem(meetingId: string, actionItemId: string) {
    try {
        const meeting = findMeeting(meetingId);
        const actionItem = meeting.actionItems.find(ai => ai.id === actionItemId);
        if (actionItem) {
            actionItem.completed = !actionItem.completed;
            revalidatePath(`/meetings/${meetingId}`);
            return { success: true };
        }
        throw new Error("Item de ação não encontrado");
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
