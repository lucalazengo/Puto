import { meetings, participants as allParticipants } from '@/lib/data';
import { notFound } from 'next/navigation';
import { MeetingHeader } from '@/components/meetings/meeting-header';
import { NotesSection } from '@/components/meetings/notes-section';
import { ActionItemsSection } from '@/components/meetings/action-items-section';
import { SummarySection } from '@/components/meetings/summary-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function MeetingPage({ params }: { params: { id: string } }) {
  const meeting = meetings.find((m) => m.id === params.id);

  if (!meeting) {
    notFound();
  }

  const isUpcoming = new Date(meeting.date) > new Date();

  return (
    <div className="flex flex-col h-full">
      <MeetingHeader meeting={meeting} />
      <div className="flex-1 grid md:grid-cols-3 gap-6 p-6 overflow-hidden">
        <ScrollArea className="md:col-span-2 h-full">
            <div className="pr-6 space-y-6">
                <NotesSection meeting={meeting} disabled={isUpcoming} />
                <ActionItemsSection meeting={meeting} allParticipants={allParticipants} disabled={isUpcoming} />
            </div>
        </ScrollArea>
        <aside className="space-y-6 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>Agenda</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{meeting.agenda}</p>
            </CardContent>
          </Card>
          <Separator />
          <SummarySection meeting={meeting} disabled={isUpcoming} />
        </aside>
      </div>
    </div>
  );
}
