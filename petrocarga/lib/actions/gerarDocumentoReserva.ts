import { jsPDF } from "jspdf";
import { getDocumentoReserva } from "./reservaActions";

export async function gerarDocumentoReserva(reservaId: string) {
  const dados = await getDocumentoReserva(reservaId);

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Documento da Reserva", 20, 20);

  doc.setFontSize(12);
  doc.text(`ID da Reserva: ${dados.id}`, 20, 40);
  doc.text(`Logradouro: ${dados.logradouro}`, 20, 50);
  doc.text(`Bairro: ${dados.bairro}`, 20, 60);
  doc.text(`Cidade de Origem: ${dados.cidadeOrigem}`, 20, 70);
  doc.text(`Motorista: ${dados.motoristaNome}`, 20, 80);
  doc.text(`Veículo: ${dados.veiculoModelo} - ${dados.veiculoPlaca}`, 20, 90);

  doc.text(
    `Período: ${new Date(dados.inicio).toLocaleString("pt-BR")} até ${new Date(
      dados.fim
    ).toLocaleString("pt-BR")}`,
    20,
    100
  );

  doc.text(`Status: ${dados.status}`, 20, 110);

  doc.save(`reserva-${dados.id}.pdf`);
}
