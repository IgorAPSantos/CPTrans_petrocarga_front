"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addVeiculo(prevState: unknown, formData: FormData) {
  {
    /* Extrair dados para validação */
  }
  const cpf = formData.get("cpfProprietarioVeiculo") as string;
  const cnpj = formData.get("cnpjProprietarioVeiculo") as string;

  {
    /* ✅ VALIDAÇÃO: Um dos dois deve ser preenchido */
  }
  if (!cpf && !cnpj) {
    return {
      error: true,
      message: "Preencha o CPF ou CNPJ do proprietário",
      valores: null,
    };
  }

  {
    /* ✅ VALIDAÇÃO: Apenas um deve ser preenchido */
  }
  if (cpf && cnpj) {
    return {
      error: true,
      message: "Preencha apenas CPF ou CNPJ, não ambos",
      valores: null,
    };
  }

  {
    /* Extrair e montar o payload JSON */
  }
  const payload = {
    placa: formData.get("placa") as string,
    marca: formData.get("marca") as string,
    modelo: formData.get("modelo") as string,
    tipo: (formData.get("tipo") as string)?.toUpperCase(),
    comprimento: Number(formData.get("comprimento")),
    dono: {
      cpfProprietarioVeiculo: cpf || null,
      cnpjProprietarioVeiculo: cnpj || null,
    },
  };

  const res = await fetch(
    "https://cptranspetrocargaback-production.up.railway.app/petrocarga/veiculos",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    return {
      error: true,
      message: errorData.message || "Erro ao cadastrar veículo",
      valores: payload,
    };
  }

  revalidatePath("/motoristas/veiculos&reservas");

  {
    /* Retornar sucesso */
  }
  return {
    error: false,
    message: "Veículo cadastrado com sucesso!",
    valores: null,
  };
}

export async function deleteVeiculo(veiculoId: string) {
  const res = await fetch(
    `https://cptranspetrocargaback-production.up.railway.app/petrocarga/veiculos/${veiculoId}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    return {
      error: true,
      message: errorData.message || "Erro ao deletar veículo",
    };
  }

  revalidatePath("/motoristas/veiculos&reservas");
  return {
    error: false,
    message: "Veículo deletado com sucesso!",
  };
}

export async function atualizarVeiculo(prevState: unknown, formData: FormData) {
  {
    /* Certifique-se de enviar o ID no formData */
  }
  const id = formData.get("id") as string;
  const cpf = formData.get("cpfProprietarioVeiculo") as string;
  const cnpj = formData.get("cnpjProprietarioVeiculo") as string;

  {
    /* ✅ VALIDAÇÃO: Um dos dois deve ser preenchido */
  }
  if (!cpf && !cnpj) {
    return {
      error: true,
      message: "Preencha o CPF ou CNPJ do proprietário",
      valores: null,
    };
  }

  {
    /* ✅ VALIDAÇÃO: Apenas um deve ser preenchido */
  }
  if (cpf && cnpj) {
    return {
      error: true,
      message: "Preencha apenas CPF ou CNPJ, não ambos",
      valores: null,
    };
  }

  {
    /* Extrair e montar o payload JSON */
  }
  const payload = {
    placa: formData.get("placa") as string,
    marca: formData.get("marca") as string,
    modelo: formData.get("modelo") as string,
    tipo: (formData.get("tipo") as string)?.toUpperCase(),
    comprimento: Number(formData.get("comprimento")),
    dono: {
      cpfProprietarioVeiculo: cpf || null,
      cnpjProprietarioVeiculo: cnpj || null,
    },
  };

  const res = await fetch(
    `https://cptranspetrocargaback-production.up.railway.app/petrocarga/veiculos/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    return {
      error: true,
      message: errorData.message || "Erro ao atualizar veículo",
      valores: payload,
    };
  }

  revalidatePath("/motoristas/veiculos&reservas");

  {
    /* Redirecionar após sucesso */
  }
  redirect("/motoristas/veiculos&reservas");
}

type Veiculo = {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  tipo: string;
  comprimento: number;
  dono: {
    cpfProprietarioVeiculo: string | null;
    cnpjProprietarioVeiculo: string | null;
  };
};

type VeiculosResponse = {
  error: boolean;
  message: string;
  veiculos: Veiculo[];
};

export async function getVeiculosUsuario(
  usuarioId: string,
  token: string
): Promise<VeiculosResponse> {
  console.log("📌 getVeiculosUsuario chamado");
  console.log("Usuario ID:", usuarioId);
  console.log("Token:", token);

  try {
    const res = await fetch(
      `https://cptranspetrocargaback-production.up.railway.app/petrocarga/veiculos/usuario/${usuarioId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Status da resposta:", res.status);

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Erro no fetch:", errorData);
      return {
        error: true,
        message: errorData.message || "Erro ao buscar veículos do usuário",
        veiculos: [],
      };
    }

    const data: Veiculo[] = await res.json();
    console.log("Dados recebidos:", data);

    return {
      error: false,
      message: "Veículos carregados com sucesso",
      veiculos: data,
    };
  } catch (err) {
    console.error("Erro ao buscar veículos:", err);
    return {
      error: true,
      message:
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao buscar veículos",
      veiculos: [],
    };
  }
}
