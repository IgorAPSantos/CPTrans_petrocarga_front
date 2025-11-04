"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { deleteMotorista } from "@/lib/actions/motoristaActions";
import { Motorista} from "@/lib/types/motorista";
import { cn } from "@/lib/utils";
import { UserIcon, Mail, Phone, FileText, Edit, Trash2, Key, Badge, Fingerprint, UserCheck, Barcode, IdCardIcon } from "lucide-react";
import Link from "next/link";
import router from "next/router";
import { useState } from "react";

type PerfilMotoristaProps = {
    motorista: Motorista;
};

export default function PerfilMotorista({ motorista }: PerfilMotoristaProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const { token } = useAuth();

    // Estados para edição
    const [formData, setFormData] = useState({
        email: motorista?.email,
        senha: "",
        novaSenha: "",
        confirmarSenha: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveChanges = () => {
        // Aqui você implementaria a lógica para salvar as alterações
        console.log("Dados a serem salvos:", formData);
        
        // Validações básicas
        if (showChangePassword) {
            if (formData.novaSenha !== formData.confirmarSenha) {
                alert("As senhas não coincidem!");
                return;
            }
            if (formData.novaSenha.length < 6) {
                alert("A nova senha deve ter pelo menos 6 caracteres!");
                return;
            }
        }

        // Simulação de sucesso
        alert("Alterações salvas com sucesso!");
        setIsEditing(false);
        setShowChangePassword(false);
        setFormData(prev => ({ ...prev, senha: "", novaSenha: "", confirmarSenha: "" }));
    };

    const handleExcluir = async () => {
        if (!token) {
            alert("Você precisa estar logado para excluir a vaga.");
            return;
            }
        
            try {
            await deleteMotorista(motorista.id, token);
            setModalAberto(false);
            router.back();
            } catch (err) {
            console.error(err);
            alert("Erro ao excluir vaga.");
            }
        };

    return (
        <main className="container mx-auto px-4 py-4 md:py-8">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="space-y-3 text-center pb-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <UserIcon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        Olá, {motorista?.nome}!
                    </CardTitle>
                    <CardDescription className="text-base">
                        Este é o seu perfil. Aqui você pode ver suas informações e atualizar seus dados conforme necessário.
                    </CardDescription>
                </CardHeader>

                <div className="px-6 pb-6 space-y-6">
                    {/* Informações do Perfil */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nome */}
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <UserIcon className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Nome</p>
                                <p className="text-lg font-semibold text-gray-900">{motorista?.nome}</p>
                            </div>
                        </div>

                        {/* Telefone */}
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <Phone className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Telefone</p>
                                <p className="text-lg font-semibold text-gray-900">{motorista?.telefone}</p>
                            </div>
                        </div>

                        {/* Número da CNH*/}
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <IdCardIcon className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Número da CNH</p>
                                <p className="text-lg font-semibold text-gray-900">{motorista?.numeroCNH}</p>
                            </div>
                        </div>

                        {/* Tipo da CNH */}
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Tipo da CNH</p>
                                <p className="text-lg font-semibold text-gray-900">{motorista?.tipoCNH}</p>
                            </div>
                        </div>

                        {/* CPF*/}
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <Fingerprint className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">CPF</p>
                                <p className="text-lg font-semibold text-gray-900">{motorista?.cpf}</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="text-lg font-semibold text-gray-900">{motorista?.email}</p>
                                
                            </div>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                            <Link
                                href={`/motorista/perfil/editar-perfil`}
                                className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition inline-block"
                            >
                                Editar Perfil
                            </Link>
                                
                            <button
                                onClick={() => setModalAberto(true)}
                                className={cn(
                                    buttonVariants({ variant: "destructive" }),
                                    "flex items-center gap-2"
                                )}
                            >
                                <Trash2 className="w-4 h-4" />
                                Excluir Conta
                            </button>
                    </div>
                </div>
            </Card>

            {modalAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setModalAberto(false)}
                    />
                    <div className="relative bg-white rounded-2xl p-6 w-96 max-w-full shadow-2xl transform transition-all duration-300 scale-95 animate-scaleIn">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Confirmar exclusão
                        </h3>
                        <p className="text-gray-600 mb-6">
                        Tem certeza que deseja excluir esta vaga? Esta ação não pode ser
                        desfeita.
                        </p>
                        <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setModalAberto(false)}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleExcluir}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                        >
                            Excluir
                        </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}