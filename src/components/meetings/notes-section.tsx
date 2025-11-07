'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, LoaderCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { updateNotes, transcribeAudio } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { Meeting } from '@/lib/types';

export function NotesSection({ meeting, disabled }: { meeting: Meeting, disabled?: boolean }) {
  const [notes, setNotes] = useState(meeting.notes || '');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setNotes(meeting.notes || '');
  }, [meeting.notes]);

  const handleStartRecording = async () => {
    setPermissionError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          setIsTranscribing(true);
          const result = await transcribeAudio(meeting.id, base64Audio);
          setIsTranscribing(false);
          if (result.transcript) {
            setNotes(prev => (prev ? prev + '\n' : '') + result.transcript);
          } else if (result.error) {
            toast({ variant: 'destructive', title: 'Erro de Transcrição', description: result.error });
          }
        };
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setPermissionError(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSaveNotes = async () => {
    const result = await updateNotes(meeting.id, notes);
    if (result.success) {
      toast({ title: 'Sucesso', description: 'As anotações foram salvas.' });
    } else {
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao salvar as anotações.' });
    }
  };
  
  const recordButtonDisabled = disabled || isTranscribing;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anotações</CardTitle>
        <CardDescription>
          {disabled ? "Você pode fazer anotações depois que a reunião começar." : "Grave áudio para transcrição em tempo real ou digite suas anotações abaixo."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {permissionError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Acesso ao Microfone Negado</AlertTitle>
            <AlertDescription>
              Por favor, permita o acesso ao microfone nas configurações do seu navegador para usar o recurso de gravação.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <Button onClick={handleStartRecording} disabled={recordButtonDisabled}>
              {isTranscribing ? <LoaderCircle className="animate-spin" /> : <Mic />}
              <span>{isTranscribing ? 'Transcrevendo...' : 'Iniciar Gravação'}</span>
            </Button>
          ) : (
            <Button onClick={handleStopRecording} variant="destructive">
              <Square />
              <span>Parar Gravação</span>
            </Button>
          )}
        </div>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="As anotações da reunião aparecerão aqui..."
          rows={15}
          disabled={disabled}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveNotes} disabled={disabled || notes === meeting.notes}>
          Salvar Anotações
        </Button>
      </CardFooter>
    </Card>
  );
}
