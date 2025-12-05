
import DisponibilidadeCalendario from "@/components/gestor/disponibilidade/DisponibilidadeCalendario";

export default function DisponibilidadeVagas() {
  return (
     <div className="flex flex-col items-center">
       <h1 className="text-2xl font-bold p-4">Disponibilidade de Vagas</h1>
 
       <div className="w-full max-w-5xl px-2 md:px-4">
        <DisponibilidadeCalendario/>
       </div>
     </div>
   );
 }
