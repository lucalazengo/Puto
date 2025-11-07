'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createMeeting } from '@/lib/actions';
import type { Participant } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';

const NewMeetingSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.'),
  date: z.string().min(1, 'A data é obrigatória.'),
  agenda: z.string().min(10, 'A pauta deve ter pelo menos 10 caracteres.'),
  participantIds: z.array(z.string()).min(1, 'Pelo menos um participante é obrigatório.'),
});

type NewMeetingFormValues = z.infer<typeof NewMeetingSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Criando...' : 'Criar Reunião'}
    </Button>
  );
}

export function NewMeetingForm({ participants }: { participants: Participant[] }) {
  const [state, formAction] = useFormState(createMeeting, { errors: {} });
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewMeetingFormValues>({
    resolver: zodResolver(NewMeetingSchema),
    defaultValues: {
      title: '',
      date: '',
      agenda: '',
      participantIds: [],
    },
  });

  const selectedParticipantIds = watch('participantIds');
  
  useEffect(() => {
    if (state?.errors) {
      const errorMessages = Object.values(state.errors).flat().join('\n');
      if(errorMessages) {
        toast({
          variant: "destructive",
          title: "Erro ao criar reunião",
          description: errorMessages,
        });
      }
    }
  }, [state, toast]);

  return (
    <form
      action={handleSubmit(data => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('date', data.date);
        formData.append('agenda', data.agenda);
        formData.append('participants', data.participantIds.join(','));
        formAction(formData);
      })}
    >
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Reunião</Label>
            <Input id="title" {...register('title')} placeholder="ex: Sessão de Planejamento Q4" />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Data e Hora</Label>
            <Input id="date" type="datetime-local" {...register('date')} />
            {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Participantes</Label>
            <div className="p-4 border rounded-md grid grid-cols-2 gap-4">
              {participants.map(p => (
                <div key={p.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`participant-${p.id}`}
                    checked={selectedParticipantIds.includes(p.id)}
                    onCheckedChange={checked => {
                      const currentIds = selectedParticipantIds;
                      const newIds = checked
                        ? [...currentIds, p.id]
                        : currentIds.filter(id => id !== p.id);
                      setValue('participantIds', newIds, { shouldValidate: true });
                    }}
                  />
                  <Label htmlFor={`participant-${p.id}`} className="font-normal">{p.name}</Label>
                </div>
              ))}
            </div>
             {errors.participantIds && <p className="text-sm text-destructive">{errors.participantIds.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="agenda">Pauta</Label>
            <Textarea
              id="agenda"
              {...register('agenda')}
              placeholder="1. Comentários iniciais..."
              rows={5}
            />
            {errors.agenda && <p className="text-sm text-destructive">{errors.agenda.message}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
