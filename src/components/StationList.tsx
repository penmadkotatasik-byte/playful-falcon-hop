import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Station {
  id: number;
  name: string;
  url: string;
  icon?: string;
  color?: string;
}

interface StationListProps {
  stations: Station[];
  onPlay: (station: Station) => void;
}

const StationList = ({ stations, onPlay }: StationListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Stations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {stations.map((station) => (
            <div key={station.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: station.color || '#e2e8f0' }}>
                  {/* We can add an icon here later */}
                </div>
                <span>{station.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => onPlay(station)}>
                  <Play className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StationList;