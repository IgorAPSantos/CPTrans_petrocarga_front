'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VehicleType } from '@/lib/types/dashboard';
import { Car, Truck } from 'lucide-react';

interface VehicleTypesChartProps {
  data: VehicleType[];
}

export function VehicleTypesChart({ data }: VehicleTypesChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'automovel':
        return <Car className="h-4 w-4" />;
      case 'vuc':
        return <Truck className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Tipos de Veículos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => {
            const percentage = total > 0 ? (item.count / total) * 100 : 0;

            return (
              <div key={item.type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getIcon(item.type)}
                    <span className="text-sm font-medium text-gray-700">
                      {item.type}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {item.count} reservas
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Veículos únicos: {item.uniqueVehicles}</span>
                  <span>{percentage.toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
