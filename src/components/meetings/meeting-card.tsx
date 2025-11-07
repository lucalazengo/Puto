import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import type { Meeting } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type MeetingCardProps = {
  meeting: Meeting;
};

export function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="line-clamp-2">{meeting.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-2">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(meeting.date), "EEE, d 'de' MMM, yyyy 'às' h:mm a", { locale: ptBR })}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
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
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <Users className="h-4 w-4" />
          {meeting.participants.length}
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/meetings/${meeting.id}`}
          className="flex items-center gap-2 text-sm font-semibold text-primary"
        >
          Ver Detalhes <ArrowRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
