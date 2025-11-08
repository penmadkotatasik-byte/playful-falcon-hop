import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, MoreVertical, Pencil, Trash2, Radio, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import EditStationDialog from './EditStationDialog';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Station {
  id: number;
  name: string;
  url: string;
  city?: string;
  icon?: string;
  color?: string;
}

interface StationListProps {
  stations: Station[];
  currentStationId: number | null;
  isPlaying: boolean;
  onPlay: (station: Station) => void;
  isAdmin: boolean;
  onDelete: (id: number) => void;
  onUpdate: (station: Station) => void;
  onReorder: (stations: Station[]) => void;
  sortOrder: 'asc' | 'desc';
  onSortToggle: () => void;
}

interface SortableStationProps {
  station: Station;
  isMobile: boolean;
  isCurrentlyPlaying: boolean;
  isAdmin: boolean;
  onPlay: (station: Station) => void;
  renderActions: (station: Station) => React.ReactNode;
}

const SortableStationItem = ({ station, isMobile, isCurrentlyPlaying, isAdmin, onPlay, renderActions }: SortableStationProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: station.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isMobile) {
    return (
      <div ref={setNodeRef} style={style} className={cn("flex items-center justify-between p-3 rounded-lg", isCurrentlyPlaying && "bg-accent")}>
        <div className="flex items-center gap-2 overflow-hidden">
          {isAdmin && (
            <div {...attributes} {...listeners} className="cursor-grab touch-none p-1">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: station.color || '#e2e8f0' }}>
            <Radio className="h-5 w-5 text-white" />
          </div>
          <div className="truncate">
            <span className="font-medium truncate">{station.name}</span>
            {station.city && <p className="text-xs text-muted-foreground truncate">{station.city}</p>}
          </div>
        </div>
        <div className="flex items-center flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={() => onPlay(station)}>
            {isCurrentlyPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          {renderActions(station)}
        </div>
      </div>
    );
  }

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} className={cn(isCurrentlyPlaying && "bg-accent")}>
      {isAdmin && (
        <TableCell {...listeners} className="cursor-grab touch-none w-[40px]">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </TableCell>
      )}
      <TableCell className="w-[80px]">
        <Button variant="ghost" size="icon" onClick={() => onPlay(station)}>
          {isCurrentlyPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: station.color || '#e2e8f0' }}>
            <Radio className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-medium">{station.name}</span>
            {station.city && <p className="text-sm text-muted-foreground">{station.city}</p>}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        {renderActions(station)}
      </TableCell>
    </TableRow>
  );
};

const StationList = ({ stations, currentStationId, isPlaying, onPlay, isAdmin, onDelete, onUpdate, onReorder, sortOrder, onSortToggle }: StationListProps) => {
  const isMobile = useIsMobile();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [stationToEdit, setStationToEdit] = useState<Station | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = stations.findIndex((s) => s.id === active.id);
      const newIndex = stations.findIndex((s) => s.id === over.id);
      onReorder(arrayMove(stations, oldIndex, newIndex));
    }
  };

  const handleEditClick = (station: Station) => {
    setStationToEdit(station);
    setIsEditDialogOpen(true);
  };

  const renderActions = (station: Station) => {
    if (!isAdmin) return null;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleEditClick(station)}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600" onClick={() => onDelete(station.id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Stations</CardTitle>
          {isAdmin && (
            <Button variant="ghost" size="icon" onClick={onSortToggle} aria-label="Sort stations">
              {sortOrder === 'asc' ? <ArrowUp className="h-5 w-5 text-muted-foreground" /> : <ArrowDown className="h-5 w-5 text-muted-foreground" />}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[450px] pr-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={stations.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {isMobile ? (
                  <div className="space-y-2">
                    {stations.map((station) => (
                      <SortableStationItem
                        key={station.id}
                        station={station}
                        isMobile={isMobile}
                        isCurrentlyPlaying={currentStationId === station.id && isPlaying}
                        isAdmin={isAdmin}
                        onPlay={onPlay}
                        renderActions={renderActions}
                      />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {isAdmin && <TableHead className="w-[40px]"></TableHead>}
                        <TableHead className="w-[80px]">Play</TableHead>
                        <TableHead>Station</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stations.map((station) => (
                        <SortableStationItem
                          key={station.id}
                          station={station}
                          isMobile={isMobile}
                          isCurrentlyPlaying={currentStationId === station.id && isPlaying}
                          isAdmin={isAdmin}
                          onPlay={onPlay}
                          renderActions={renderActions}
                        />
                      ))}
                    </TableBody>
                  </Table>
                )}
              </SortableContext>
            </DndContext>
          </ScrollArea>
        </CardContent>
      </Card>
      <EditStationDialog
        station={stationToEdit}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdateStation={onUpdate}
      />
    </>
  );
};

export default StationList;