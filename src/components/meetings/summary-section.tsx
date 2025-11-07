'use client';

import { useState, useEffect } from 'react';
import { Sparkles, LoaderCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      toast({ title: 'Summary Generated', description: 'The meeting summary has been created.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>A brief overview of the meeting.</CardDescription>
      </CardHeader>
      <CardContent>
        {summary ? (
          <p className="text-sm text-muted-foreground">{summary}</p>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-6">
            {isLoading ? 'Generating summary...' : (
                disabled ? 'Summary can be generated after the meeting.' : 'No summary generated yet.'
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleGenerate} disabled={disabled || isLoading}>
          {isLoading ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
          {summary ? 'Regenerate' : 'Generate'}
        </Button>
      </CardFooter>
    </Card>
  );
}
