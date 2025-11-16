"use client";

import EditarMotorista from "@/components/motorista/editar/edicao-perfil";
import { Motorista } from "@/lib/types/motorista";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/hooks/useAuth";
import { useEffect, useState } from "react";
import { getMotoristaByUserId } from "@/lib/actions/motoristaActions";

export default function EditarMotoristaPage() {
    const { user } = useAuth();
    const params = useParams() as { id: string };

    const [motorista, setMotorista] = useState<Motorista | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!user?.id) {
            setError("Usuário não autenticado.");
            setLoading(false);
            return;
        }
        const userId = user.id;
        if (!userId) return;

        async function fetchMotorista() {
            setLoading(true);
            setError("");

        try {
            const result = await getMotoristaByUserId(userId);

            if (result.error) {
            setError(result.motorista);
            setMotorista(null);
            } else {
                const m = result.motorista;
                if (!m) {
                    setError("Motorista não encontrado.");
                } else {
                    setMotorista(m);
                }
            }
        } catch (err) {
            console.error("Erro ao buscar perfil do motorista:", err);
            setError("Erro ao buscar perfil do motorista.");
        } finally {
            setLoading(false);
        }
        }

        fetchMotorista();
    }, [user?.id, params.id]);

    if (loading) {
        return (
        <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
            <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
            <span className="text-gray-600">Carregando perfil...</span>
        </div>
        );
    }

    if (error) {
        return (
        <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-red-600 text-center gap-2">
            <p>{error}</p>
            <Link
            href="/motorista/perfil"
            className="text-blue-600 underline"
            >
            Voltar para perfil
            </Link>
        </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl p-6">
        <div className="mb-6">
            <Link
            href="/motorista/perfil"
            className="text-muted-foreground hover:text-foreground inline-flex items-center"
            >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para perfil
            </Link>
        </div>

        {motorista && <EditarMotorista motorista={motorista} />}
        </div>
    );
}