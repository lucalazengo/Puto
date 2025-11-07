import type { Meeting, Participant } from './types';

export const participants: Participant[] = [
  { id: 'user-1', name: 'Alex Johnson', avatarUrl: 'https://picsum.photos/seed/user1/40/40' },
  { id: 'user-2', name: 'Maria Garcia', avatarUrl: 'https://picsum.photos/seed/user2/40/40' },
  { id: 'user-3', name: 'James Smith', avatarUrl: 'https://picsum.photos/seed/user3/40/40' },
  { id: 'user-4', name: 'Priya Patel', avatarUrl: 'https://picsum.photos/seed/user4/40/40' },
  { id: 'user-5', name: 'Kenji Tanaka', avatarUrl: 'https://picsum.photos/seed/user5/40/40' },
];

export const meetings: Meeting[] = [
  {
    id: 'mtg-1',
    title: 'Q3 Project Kick-off',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    participants: [participants[0], participants[1], participants[2]],
    agenda: '1. Review Q2 Performance\n2. Outline Q3 Goals\n3. Define Project Scope\n4. Assign Initial Tasks',
    notes: 'Meeting started with a review of Q2 successes. Q3 goals were set, focusing on market expansion. The new project scope was detailed, and initial tasks were assigned to team members.',
    summary: 'The Q3 Project Kick-off successfully established the direction for the upcoming quarter. Key discussion points included analyzing Q2 performance, setting ambitious but achievable goals for Q3, and clearly defining the scope of our new project. Initial tasks have been distributed to get the project underway.',
    actionItems: [
      { id: 'ai-1', item: 'Finalize Q3 budget proposal', assignee: 'user-1', deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), completed: false },
      { id: 'ai-2', item: 'Develop initial design mockups', assignee: 'user-2', deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), completed: false },
    ],
  },
  {
    id: 'mtg-2',
    title: 'Marketing Strategy Session',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    participants: [participants[0], participants[3], participants[4]],
    agenda: '1. Analyze competitor campaigns\n2. Brainstorm new marketing channels\n3. Plan social media calendar',
    notes: '',
    summary: '',
    actionItems: [],
  },
  {
    id: 'mtg-3',
    title: 'User Feedback Review',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    participants: [participants[1], participants[2], participants[4]],
    agenda: '1. Discuss latest user survey results\n2. Identify key pain points\n3. Prioritize feature requests',
    notes: '',
    summary: '',
    actionItems: [],
  },
];
