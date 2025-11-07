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
            toast({ variant: 'destructive', title: 'Transcription Error', description: result.error });
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
      toast({ title: 'Success', description: 'Notes have been saved.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save notes.' });
    }
  };
  
  const recordButtonDisabled = disabled || isTranscribing;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <CardDescription>
          {disabled ? "You can take notes after the meeting has started." : "Record audio for real-time transcription or type your notes below."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {permissionError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Microphone Access Denied</AlertTitle>
            <AlertDescription>
              Please allow microphone access in your browser settings to use the recording feature.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <Button onClick={handleStartRecording} disabled={recordButtonDisabled}>
              {isTranscribing ? <LoaderCircle className="animate-spin" /> : <Mic />}
              <span>{isTranscribing ? 'Transcribing...' : 'Start Recording'}</span>
            </Button>
          ) : (
            <Button onClick={handleStopRecording} variant="destructive">
              <Square />
              <span>Stop Recording</span>
            </Button>
          )}
        </div>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Meeting notes will appear here..."
          rows={15}
          disabled={disabled}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveNotes} disabled={disabled || notes === meeting.notes}>
          Save Notes
        </Button>
      </CardFooter>
    </Card>
  );
}
