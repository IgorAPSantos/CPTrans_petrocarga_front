import VagaItem from "@/components/cards/vagas-item";
import { Vaga } from "@/lib/types";
import { useState, useEffect } from "react";

export function ListaVagas(){
     const [vagas, setVagas] = useState<Vaga[]>([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
    fetch("/api/vagas").then((res) => res.json())
    .then((data) => {
      setVagas(data);
      setLoading(false);
    });
  }, []);
    return(
        <div>
            <h1 className="text-lg font-bold text-center">Lista de Vagas</h1>
            
                {loading ? (
                  <p className="text-center text-gray-500">Carregando vagas...</p>
                ) : (
                  <div className="space-y-2">
                    {vagas.map((vaga) => (
                      <VagaItem key={vaga.id} vaga={vaga} />
                    ))}
                  </div>
                )}
        </div>
    )
}