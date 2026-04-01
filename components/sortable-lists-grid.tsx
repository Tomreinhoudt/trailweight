"use client";

import { useState, useCallback, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableListCard } from "./sortable-list-card";
import { reorderLists } from "@/actions/lists";
import type { GearList } from "@/lib/types";

export function SortableListsGrid({ initialLists }: { initialLists: GearList[] }) {
  const [lists, setLists] = useState(initialLists);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      if (!over || active.id === over.id) return;

      setLists((prev) => {
        const oldIndex = prev.findIndex((l) => l.id === active.id);
        const newIndex = prev.findIndex((l) => l.id === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);
        startTransition(async () => {
          await reorderLists(reordered.map((l) => l.id));
        });
        return reordered;
      });
    },
    []
  );

  const activeList = activeId ? lists.find((l) => l.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(e) => setActiveId(e.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={lists.map((l) => l.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <SortableListCard key={list.id} list={list} />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeList && (
          <div className="opacity-90 shadow-2xl rotate-1 scale-105">
            <SortableListCard list={activeList} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
