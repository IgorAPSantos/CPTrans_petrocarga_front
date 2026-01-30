'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationStat } from '@/lib/types/dashboard';
import { MapPin, Building, DoorOpen } from 'lucide-react';

interface LocationStatsProps {
  title: string;
  data: LocationStat[];
  icon: 'district' | 'origin' | 'entry-origin';
}

export function LocationStats({ title, data, icon }: LocationStatsProps) {
  const getIconComponent = () => {
    switch (icon) {
      case 'district':
        return Building;
      case 'origin':
        return MapPin;
      case 'entry-origin':
        return DoorOpen;
      default:
        return MapPin;
    }
  };

  const IconComponent = getIconComponent();
  const sortedData = [...data].sort(
    (a, b) => b.reservationCount - a.reservationCount,
  );

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <IconComponent className="h-5 w-5 text-gray-600" />
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedData.map((item) => (
            <div
              key={`${item.type}-${item.name}`}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-blue-600">
                  {item.reservationCount}
                </span>
                <span className="text-xs text-gray-500">reservas</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
