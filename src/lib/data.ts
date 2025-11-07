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
    title: 'Reunião de Lançamento do Projeto Q3',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    participants: [participants[0], participants[1], participants[2]],
    agenda: '1. Revisão do Desempenho do Q2\n2. Delinear Metas do Q3\n3. Definir Escopo do Projeto\n4. Atribuir Tarefas Iniciais',
    notes: 'A reunião começou com uma revisão dos sucessos do Q2. As metas do Q3 foram definidas, com foco na expansão do mercado. O escopo do novo projeto foi detalhado e as tarefas iniciais foram atribuídas aos membros da equipe.',
    summary: 'A Reunião de Lançamento do Projeto Q3 estabeleceu com sucesso a direção para o próximo trimestre. Os principais pontos de discussão incluíram a análise do desempenho do Q2, o estabelecimento de metas ambiciosas, mas alcançáveis para o Q3, e a definição clara do escopo do nosso novo projeto. As tarefas iniciais foram distribuídas para dar início ao projeto.',
    actionItems: [
      { id: 'ai-1', item: 'Finalizar proposta de orçamento do Q3', assignee: 'user-1', deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), completed: false },
      { id: 'ai-2', item: 'Desenvolver mockups de design iniciais', assignee: 'user-2', deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), completed: false },
    ],
  },
  {
    id: 'mtg-2',
    title: 'Sessão de Estratégia de Marketing',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    participants: [participants[0], participants[3], participants[4]],
    agenda: '1. Analisar campanhas da concorrência\n2. Brainstorm de novos canais de marketing\n3. Planejar calendário de mídias sociais',
    notes: '',
    summary: '',
    actionItems: [],
  },
  {
    id: 'mtg-3',
    title: 'Revisão de Feedback do Usuário',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    participants: [participants[1], participants[2], participants[4]],
    agenda: '1. Discutir os resultados da última pesquisa de usuários\n2. Identificar principais pontos problemáticos\n3. Priorizar solicitações de recursos',
    notes: '',
    summary: '',
    actionItems: [],
  },
];
