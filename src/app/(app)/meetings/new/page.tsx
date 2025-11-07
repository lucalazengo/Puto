import { NewMeetingForm } from '@/components/meetings/new-meeting-form';
import { participants } from '@/lib/data';

export default function NewMeetingPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="p-6 border-b bg-card">
        <h1 className="text-2xl font-bold">Create a New Meeting</h1>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto">
          <NewMeetingForm participants={participants} />
        </div>
      </main>
    </div>
  );
}
