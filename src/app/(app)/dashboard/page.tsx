import { meetings } from '@/lib/data';
import { MeetingCard } from '@/components/meetings/meeting-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  const now = new Date();
  const upcomingMeetings = meetings
    .filter((m) => new Date(m.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastMeetings = meetings
    .filter((m) => new Date(m.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-6 border-b bg-card">
        <h1 className="text-2xl font-bold">Painel</h1>
        <Button asChild>
          <Link href="/meetings/new">
            <PlusCircle />
            Nova Reunião
          </Link>
        </Button>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Próximas Reuniões</h2>
            {upcomingMeetings.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingMeetings.map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma reunião futura agendada.</p>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Reuniões Passadas</h2>
            {pastMeetings.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastMeetings.map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma reunião passada encontrada.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
