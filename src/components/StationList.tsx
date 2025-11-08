import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, MoreVertical, Pencil, Trash2, Radio } from 'lucide-react';
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

interface Station {
  id: number;
  name: string;
  url: string;
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
}

const StationList = ({ stations, currentStationId, isPlaying, onPlay, isAdmin, onDelete, onUpdate }: StationListProps) => {
  const isMobile = useIsMobile();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [stationToEdit, setStationToEdit] = useState<Station | null>(null);

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

  const renderMobileList = () => (
    <div className="space-y-2">
      {stations.map((station) => {
        const isCurrentlyPlaying = currentStationId === station.id && isPlaying;
        return (
          <div key={station.id} className={cn("flex items-center justify-between p-3 rounded-lg", currentStationId === station.id && "bg-accent")}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: station.color || '#e2e8f0' }}>
                <Radio className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium truncate">{station.name}</span>
            </div>
            <div className="flex items-center flex-shrink-0">
              <Button variant="ghost" size="icon" onClick={() => onPlay(station)}>
                {isCurrentlyPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              {renderActions(station)}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderDesktopTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Play</TableHead>
          <TableHead>Station Name</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stations.map((station) => {
          const isCurrentlyPlaying = currentStationId === station.id && isPlaying;
          return (
            <TableRow key={station.id} className={cn(currentStationId === station.id && "bg-accent")}>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => onPlay(station)}>
                  {isCurrentlyPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: station.color || '#e2e8f0' }}>
                    <Radio className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium">{station.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {renderActions(station)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Stations</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[450px] pr-4">
            {isMobile ? renderMobileList() : renderDesktopTable()}
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