'use client';

import { useState } from 'react';
import { Lightbulb, Plus, LoaderCircle, User, Calendar, CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { suggestActionItems, addActionItem, toggleActionItem } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { Meeting, Participant, ActionItem } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { format, parseISO } from 'date-fns';

type SuggestedItem = {
    item: string;
    assignee: string;
    deadline?: string;
    assigneeId?: string;
}

export function ActionItemsSection({ meeting, allParticipants, disabled }: { meeting: Meeting; allParticipants: Participant[], disabled?: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedItem[]>([]);
  const { toast } = useToast();

  const handleSuggest = async () => {
    setIsLoading(true);
    const result = await suggestActionItems(meeting.id);
    setIsLoading(false);
    if (result.suggestions) {
      if(result.suggestions.length === 0) {
        toast({ title: 'Nenhuma Sugestão', description: 'A IA não conseguiu encontrar itens de ação claros nas anotações.' });
        return;
      }
      setSuggestions(result.suggestions);
      setShowSuggestions(true);
    } else {
      toast({ variant: 'destructive', title: 'Erro', description: result.error });
    }
  };

  const handleAddSuggestion = async (suggestion: SuggestedItem) => {
    if (!suggestion.assigneeId) return;
    
    const newActionItemData = {
        item: suggestion.item,
        assignee: suggestion.assigneeId,
        deadline: suggestion.deadline ? new Date(suggestion.deadline).toISOString() : undefined,
    }
    
    const result = await addActionItem(meeting.id, newActionItemData);
    if(result.success) {
        toast({title: "Item de Ação Adicionado", description: `"${result.item?.item}" foi adicionado.`});
        setSuggestions(prev => prev.filter(s => s.item !== suggestion.item));
    } else {
        toast({variant: 'destructive', title: 'Erro', description: result.error});
    }
  }

  const handleToggle = async (actionItemId: string) => {
    await toggleActionItem(meeting.id, actionItemId);
  }

  const getParticipant = (id: string) => allParticipants.find(p => p.id === id);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Itens de Ação</CardTitle>
                <CardDescription>Tarefas atribuídas durante a reunião.</CardDescription>
            </div>
            <Button onClick={handleSuggest} size="sm" disabled={disabled || isLoading}>
              {isLoading ? <LoaderCircle className="animate-spin" /> : <Lightbulb />}
              Sugerir Itens
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {meeting.actionItems.length > 0 ? (
            <ul className="space-y-4">
              {meeting.actionItems.map((item, index) => (
                <li key={item.id}>
                  <div className="flex items-start gap-4">
                    <Checkbox id={item.id} checked={item.completed} onCheckedChange={() => handleToggle(item.id)} className="mt-1" disabled={disabled}/>
                    <div className="flex-1 grid gap-1">
                      <label htmlFor={item.id} className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.item}
                      </label>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{getParticipant(item.assignee)?.name || 'Desconhecido'}</span>
                        </div>
                        {item.deadline && (
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Prazo {format(parseISO(item.deadline), "d 'de' MMM, yyyy")}</span>
                            </div>
                        )}
                      </div>
                    </div>
                    {item.completed ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-muted-foreground/50"/>}
                  </div>
                  {index < meeting.actionItems.length - 1 && <Separator className="mt-4" />}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum item de ação atribuído ainda.</p>
          )}
        </CardContent>
        <CardFooter>
             {/* Futuro: <Button variant="outline" disabled={disabled}><Plus/> Adicionar Manualmente</Button> */}
        </CardFooter>
      </Card>
      
      <Dialog open={showSuggestions} onOpenChange={setShowSuggestions}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Itens de Ação Sugeridos</DialogTitle>
            <DialogDescription>
              A IA sugeriu estes itens de ação com base nas anotações da reunião. Adicione os que você deseja manter.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto p-1">
            <ul className="space-y-4">
                {suggestions.map((s, i) => (
                    <li key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-1 space-y-1">
                            <p className="font-medium">{s.item}</p>
                            <p className="text-sm text-muted-foreground">Responsável: {s.assignee}</p>
                            {s.deadline && <p className="text-sm text-muted-foreground">Prazo: {s.deadline}</p>}
                        </div>
                        <Button size="sm" onClick={() => handleAddSuggestion(s)} disabled={!s.assigneeId}>
                            <Plus className="h-4 w-4 mr-2"/> Adicionar
                        </Button>
                    </li>
                ))}
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuggestions(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
