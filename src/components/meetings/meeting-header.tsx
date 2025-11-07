import { format } from 'date-fns';
import { Calendar, Users } from 'lucide-react';
import type { Meeting } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function MeetingHeader({ meeting }: { meeting: Meeting }) {
  return (
    <header className="p-6 border-b bg-card space-y-4">
      <h1 className="text-3xl font-bold">{meeting.title}</h1>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(meeting.date), 'EEEE, MMMM d, yyyy @ h:mm a')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Participants</span>
        </div>
        <div className="flex items-center -space-x-2">
          <TooltipProvider delayDuration={0}>
            {meeting.participants.map((p) => (
              <Tooltip key={p.id}>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 border-2 border-card">
                    <AvatarImage src={p.avatarUrl} alt={p.name} data-ai-hint="person portrait"/>
                    <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{p.name}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
