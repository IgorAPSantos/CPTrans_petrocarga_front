"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setToken, setUser } = useAuth();

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      // Login normal
      const res = await fetch(
        "https://cptranspetrocargaback-production-ccd6.up.railway.app/petrocarga/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.erro || "Email ou senha incorretos");
        setLoading(false);
        return;
      }

      // Pega token e usuário
      const { token, usuario } = data;

      // Busca motorista pelo usuário logado (se for motorista)
      let motoristaId: string | undefined = undefined;
      if (usuario.permissao === "MOTORISTA") {
        const motoristaRes = await fetch(
          `https://cptranspetrocargaback-production-ccd6.up.railway.app/petrocarga/motorista/${usuario.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (motoristaRes.ok) {
          const motoristaData = await motoristaRes.json();
          motoristaId = motoristaData.id; // esse é o ID que você precisa
        } else {
          console.warn("Motorista não encontrado para este usuário.");
        }
      }

      // Salva no AuthContext
      setToken(token);
      setUser({ ...usuario, motoristaId });

      // Redireciona conforme permissão
      switch (usuario.permissao) {
        case "ADMIN":
          window.location.href = "/gestor/visualizar-vagas";
          break;
        case "GESTOR":
          window.location.href = "/gestor/visualizar-vagas";
          break;
        case "MOTORISTA":
          window.location.href = "/motorista/reservar-vaga";
          break;
        case "AGENTE":
          window.location.href = "/agente/home";
          break;
        default:
          setError("Permissão desconhecida");
          break;
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao tentar entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-more-delayed"></div>
      </div>

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
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

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
                  disabled={loading}
                />
              </div>
            </div>

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
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>

            <Button
              onClick={handleLogin}
              disabled={loading || !email || !senha}
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

            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">ou</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <Link href="/autorizacao/cadastro">
              <Button className="w-full h-12 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                Criar Conta
              </Button>
            </Link>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-blue-900 mb-2">
              💡 Credenciais de teste:
            </p>
            <div className="space-y-1 text-blue-700">
              <p>
                <strong>Gestor:</strong> gestor@teste.com / 123456
              </p>
              <p>
                <strong>Motorista:</strong> motorista@teste.com / 123456
              </p>
              <p>
                <strong>Agente:</strong> agente@teste.com / 123456
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
