"use client";

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  MoreVertical, 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar,
  Plus,
  Search
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const COLUMNS = [
  { id: 'SAVED', title: 'Saved', color: 'bg-slate-500' },
  { id: 'APPLYING', title: 'Applying', color: 'bg-blue-500' },
  { id: 'APPLIED', title: 'Applied', color: 'bg-indigo-500' },
  { id: 'INTERVIEW', title: 'Interview', color: 'bg-emerald-500' },
  { id: 'OFFER', title: 'Offer', color: 'bg-amber-500' },
];

const INITIAL_DATA: any = {
  SAVED: [
    { id: '1', company: 'Google', title: 'Senior Frontend Engineer', location: 'Remote', salary: '150k - 200k', appliedAt: '2024-05-01' },
    { id: '2', company: 'Meta', title: 'Software Engineer III', location: 'London', salary: '£120k', appliedAt: '2024-05-02' },
  ],
  APPLYING: [],
  APPLIED: [
    { id: '3', company: 'Vercel', title: 'Product Engineer', location: 'Global', salary: 'Competitive', appliedAt: '2024-04-28' },
  ],
  INTERVIEW: [
    { id: '4', company: 'Airbnb', title: 'Staff Engineer', location: 'San Francisco', salary: '$220k', appliedAt: '2024-04-20' },
  ],
  OFFER: [],
};

const KanbanBoard = () => {
  const [data, setData] = useState(INITIAL_DATA);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = [...data[source.droppableId]];
    const destColumn = [...data[destination.droppableId]];
    const [movedItem] = sourceColumn.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceColumn.splice(destination.index, 0, movedItem);
      setData({ ...data, [source.droppableId]: sourceColumn });
    } else {
      destColumn.splice(destination.index, 0, movedItem);
      setData({
        ...data,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      });
    }
  };

  return (
    <div className="space-y-6 overflow-hidden flex flex-col h-full">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search company, position..." 
            className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
          />
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2 rounded-xl">
          <Plus className="w-4 h-4" /> Add Application
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide min-h-[600px]">
          {COLUMNS.map((col) => (
            <div key={col.id} className="shrink-0 w-80">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${col.color}`} />
                  <h3 className="font-bold">{col.title}</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {data[col.id].length}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex flex-col gap-4 p-2 rounded-2xl min-h-[500px] transition-colors ${
                      snapshot.isDraggingOver ? 'bg-primary/5 border border-dashed border-primary/20' : ''
                    }`}
                  >
                    {data[col.id].map((item: any, index: number) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ ...provided.draggableProps.style }}
                            className={`glass-card rounded-2xl p-4 transition-all duration-200 hover:shadow-xl ${
                              snapshot.isDragging ? 'shadow-2xl ring-2 ring-primary/50' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex gap-3">
                                <Avatar className="h-10 w-10 rounded-xl border border-border/50">
                                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                    {item.company.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-bold text-sm leading-none mb-1 group-hover:text-primary transition-colors">{item.company}</h4>
                                  <p className="text-xs text-muted-foreground">{item.title}</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span>{item.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <DollarSign className="w-3 h-3" />
                                <span>{item.salary}</span>
                              </div>
                              
                              <div className="pt-3 border-t border-border/50 flex items-center justify-between mt-4">
                                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span>Applied {item.appliedAt}</span>
                                </div>
                                <div className="flex -space-x-2">
                                  <div className="w-6 h-6 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">AI</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
