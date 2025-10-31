import Calendario from "@/components/gestor/disponibilidade/Calendario";

export default function DisponibilidadeVagas() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Gerenciamento de Disponibilidade de Vagas
        </h1>
        <p className="text-gray-600 mb-6">
          Clique no dia desejado para adicionar ou visualizar as
          disponibilidades de vagas.
        </p>

        <div className="bg-white shadow-md rounded-lg p-4">
          <Calendario />
        </div>
      </div>
    </div>
  );
}
