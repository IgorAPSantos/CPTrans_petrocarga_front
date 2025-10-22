"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setLoading(true);
        setError("");

        // Simula autenticação
        setTimeout(() => {
        if (email === "gestor@teste.com" && senha === "123456") {
            alert("Login como Gestor - Redirecionando para /gestor/dashboard");
            setLoading(false);
        } else if (email === "usuario@teste.com" && senha === "123456") {
            alert("Login como Usuário - Redirecionando para /usuario/home");
            setLoading(false);
        } else {
            setError("Email ou senha incorretos");
            setLoading(false);
        }
        }, 1500);
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
        {/* Background decorativo com blur */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-delayed"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-more-delayed"></div>
        </div>

        {/* Modal de Login */}
        <Card className="w-full max-w-md relative z-10 shadow-2xl backdrop-blur-sm bg-white/90 border-0">
            <CardHeader className="space-y-3 text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Bem-vindo
            </CardTitle>
            <CardDescription className="text-base">
                Entre com suas credenciais para acessar o sistema
            </CardDescription>
            </CardHeader>

            <CardContent>
            <div className="space-y-5">
                {/* Mensagem de erro */}
                {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start gap-2 animate-shake">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{error}</span>
                </div>
                )}

                {/* Campo Email */}
                <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    required
                    />
                </div>
                </div>

                {/* Campo Senha */}
                <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Senha
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <Input
                    type={showPassword ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    required
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                    </button>
                </div>
                </div>

                {/* Link Esqueci senha */}
                <div className="flex items-center justify-end">
                <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                    Esqueceu a senha?
                </button>
                </div>

                
                {/* Botão Entrar */}
                <Button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70"
                >
                    {loading ? (
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Entrando...</span>
                    </div>
                    ) : (
                    "Entrar"
                    )}
                </Button>

                {/* Divisor */}
                <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-sm text-gray-500">ou</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Botão Cadastro */}
                <Link href="/cadastro" className="block w-full">
                    <Button
                    className="w-full h-12 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-1000 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                    Criar Conta
                    </Button>
                </Link>
                
            </div>

            {/* Divisor 2 */}
            <div className="mt-6 mb-4 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">testes</span>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Credenciais de teste */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="font-semibold text-blue-900 mb-2">💡 Credenciais de teste:</p>
                <div className="space-y-1 text-blue-700">
                <p><strong>Gestor:</strong> gestor@teste.com / 123456</p>
                <p><strong>Motorista:</strong> motorista@teste.com / 123456</p>
                <p><strong>Agente:</strong> agente@teste.com / 123456</p>
                </div>
            </div>
            </CardContent>
        </Card>
        </div>
    );
}