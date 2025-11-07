'use client';

import { useState, useEffect } from 'react';
import { Sparkles, LoaderCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateMeetingSummary } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { Meeting } from '@/lib/types';

export function SummarySection({ meeting, disabled }: { meeting: Meeting, disabled?: boolean }) {
  const [summary, setSummary] = useState(meeting.summary || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSummary(meeting.summary || '');
  }, [meeting.summary]);

  const handleGenerate = async () => {
    setIsLoading(true);
    const result = await generateMeetingSummary(meeting.id);
    setIsLoading(false);
    if (result.summary) {
      setSummary(result.summary);
      toast({ title: 'Resumo Gerado', description: 'O resumo da reunião foi criado.' });
    } else {
      toast({ variant: 'destructive', title: 'Erro', description: result.error });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo</CardTitle>
        <CardDescription>Uma visão geral da reunião.</CardDescription>
      </CardHeader>
      <CardContent>
        {summary ? (
          <p className="text-sm text-muted-foreground">{summary}</p>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-6">
            {isLoading ? 'Gerando resumo...' : (
                disabled ? 'O resumo pode ser gerado após a reunião.' : 'Nenhum resumo gerado ainda.'
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleGenerate} disabled={disabled || isLoading}>
          {isLoading ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
          {summary ? 'Gerar Novamente' : 'Gerar'}
        </Button>
      </CardFooter>
    </Card>
  );
}
