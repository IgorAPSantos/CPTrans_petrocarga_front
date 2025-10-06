"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Vaga } from "@/lib/types";
import { MapPin, Clock, Ruler, Truck } from "lucide-react";

export default function JobPostingCard({ vaga }: { vaga: Vaga }) {
  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Vaga {vaga.id}</h1>
            <p className="text-muted-foreground">
              Localização:{" "}
              <span className="text-blue-600">{vaga.localizacao}</span>
            </p>
          </div>

          <Badge variant={vaga.status === "disponível" ? "default" : "secondary"}>
            {vaga.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <Ruler className="text-muted-foreground h-5 w-5" />
            <span>
              Comprimento: <strong>{vaga.comprimento} m</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Truck className="text-muted-foreground h-5 w-5" />
            <span>
              Máx. de eixos: <strong>{vaga.max_eixos}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground h-5 w-5" />
            <span>
              Horário: <strong>{vaga.horario_inicio}h - {vaga.horario_fim}h</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="text-muted-foreground h-5 w-5" />
            <span>
              Endereço ID: <strong>{vaga.endereco_id}</strong>
            </span>
          </div>
        </div>

        <Separator />

        <section>
          <h2 className="mb-4 text-xl font-semibold">Área</h2>
          <p className="text-muted-foreground leading-relaxed">
            {vaga.area}
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
