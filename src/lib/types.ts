export type Participant = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type ActionItem = {
  id: string;
  item: string;
  assignee: Participant['id'];
  deadline?: string;
  completed: boolean;
};

export type Meeting = {
  id: string;
  title: string;
  date: string;
  participants: Participant[];
  agenda: string;
  notes?: string;
  summary?: string;

  actionItems: ActionItem[];
};
