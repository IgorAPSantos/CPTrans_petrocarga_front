import CalendarioReservas from '@/components/gestor/calendario/CalendarioReservasGestor';
export default function Reserva() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold p-4">Gerenciar Reservas</h1>

      <div className="w-full max-w-5xl px-2 md:px-4">
        <CalendarioReservas />
      </div>
    </div>
  );
}
