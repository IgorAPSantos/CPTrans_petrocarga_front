// app/gestor/enviar-notificacoes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/hooks/useAuth';
import { getMotoristas } from '@/lib/actions/motoristaActions';
import { getAgentes } from '@/lib/actions/agenteAction';
import { getGestores } from '@/lib/actions/gestorActions';
import {
  Notificacao,
  NotificacaoPorPermissao,
} from '@/lib/actions/notificacaoAction';
import { Motorista } from '@/lib/types/motorista';
import { Agente } from '@/lib/types/agente';
import { Gestor } from '@/lib/types/gestor';
import { Loader2, Send, Users, Bell, Filter, Check, X } from 'lucide-react';

export default function EnviarNotificacoesPage() {
  const { user } = useAuth();
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [gestores, setGestores] = useState<Gestor[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros simplificados
  const [filtroTipo, setFiltroTipo] = useState<
    'TODOS' | 'MOTORISTAS' | 'AGENTES' | 'GESTORES' | 'GRUPO'
  >('TODOS');
  const [grupoSelecionado, setGrupoSelecionado] = useState<
    'MOTORISTA' | 'AGENTE' | 'GESTOR'
  >('MOTORISTA');

  // Formulário
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipo, setTipo] = useState<
    'RESERVA' | 'VAGA' | 'VEICULO' | 'MOTORISTA' | 'SISTEMA'
  >('SISTEMA');

  // Seleção de usuários
  const [usuariosSelecionados, setUsuariosSelecionados] = useState<string[]>(
    [],
  );
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{
    enviadas: number;
    erros: number;
  } | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Busca motoristas e agentes sempre
        const [motoristasRes, agentesRes] = await Promise.all([
          getMotoristas(),
          getAgentes(),
        ]);

        // Inicializa gestores como vazio
        let gestoresArray: Gestor[] = [];

        // Somente admin pode buscar gestores
        if (user.permissao === 'ADMIN') {
          const gestoresRes = await getGestores();
          if (!gestoresRes.error && gestoresRes.gestores) {
            gestoresArray = gestoresRes.gestores;
          }
        }

        if (!motoristasRes.error) setMotoristas(motoristasRes.motoristas || []);
        if (!agentesRes.error) setAgentes(agentesRes.agentes || []);
        setGestores(gestoresArray);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Verifica se usuário é admin (pode enviar para gestores)
  const isAdmin = user?.permissao === 'ADMIN';

  const usuariosFiltrados = () => {
    switch (filtroTipo) {
      case 'MOTORISTAS':
        return motoristas.map((m) => ({
          id: m.usuario.id,
          nome: m.usuario.nome,
          email: m.usuario.email,
          tipo: 'MOTORISTA' as const,
        }));
      case 'AGENTES':
        return agentes.map((a) => ({
          id: a.usuario.id,
          nome: a.usuario.nome,
          email: a.usuario.email,
          tipo: 'AGENTE' as const,
        }));
      case 'GESTORES':
        return gestores.map((g) => ({
          id: g.id,
          nome: g.nome,
          email: g.email,
          tipo: 'GESTOR' as const,
        }));
      default:
        return [
          ...motoristas.map((m) => ({
            id: m.usuario.id,
            nome: m.usuario.nome,
            email: m.usuario.email,
            tipo: 'MOTORISTA' as const,
          })),
          ...agentes.map((a) => ({
            id: a.usuario.id,
            nome: a.usuario.nome,
            email: a.usuario.email,
            tipo: 'AGENTE' as const,
          })),
          ...gestores.map((g) => ({
            id: g.id,
            nome: g.nome,
            email: g.email,
            tipo: 'GESTOR' as const,
          })),
        ];
    }
  };

  const toggleUsuario = (id: string) => {
    setUsuariosSelecionados((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id],
    );
  };

  const selecionarTodos = () => {
    const ids = usuariosFiltrados().map((u) => u.id);
    setUsuariosSelecionados(ids);
  };

  const deselecionarTodos = () => {
    setUsuariosSelecionados([]);
  };

  const handleEnvioIndividual = async () => {
    if (
      !titulo.trim() ||
      !mensagem.trim() ||
      usuariosSelecionados.length === 0
    ) {
      alert('Preencha título, mensagem e selecione pelo menos um destinatário');
      return;
    }

    setEnviando(true);
    setResultado(null);

    let enviadas = 0;
    let erros = 0;

    try {
      // Envia notificação para cada usuário selecionado
      for (const usuarioId of usuariosSelecionados) {
        const formData = new FormData();
        formData.append('usuarioId', usuarioId);
        formData.append('titulo', titulo);
        formData.append('mensagem', mensagem);
        formData.append('tipo', tipo);
        formData.append(
          'metada',
          JSON.stringify({
            remetente: {
              id: user?.id,
              nome: user?.nome,
              permissao: user?.permissao,
            },
            enviadoEm: new Date().toISOString(),
            tipoEnvio: 'INDIVIDUAL',
          }),
        );

        const result = await Notificacao(formData);

        if (result.error) {
          console.error(`Erro para usuário ${usuarioId}:`, result.message);
          erros++;
        } else {
          enviadas++;
        }
      }

      setResultado({ enviadas, erros });

      // Limpa o formulário se tudo foi enviado com sucesso
      if (erros === 0) {
        setTitulo('');
        setMensagem('');
        setUsuariosSelecionados([]);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar notificações');
    } finally {
      setEnviando(false);
    }
  };

  const handleEnvioGrupo = async () => {
    if (!titulo.trim() || !mensagem.trim()) {
      alert('Preencha título e mensagem');
      return;
    }

    setEnviando(true);
    setResultado(null);

    try {
      const formData = new FormData();
      formData.append('permissao', grupoSelecionado);
      formData.append('titulo', titulo);
      formData.append('mensagem', mensagem);
      formData.append('tipo', tipo);
      formData.append(
        'metada',
        JSON.stringify({
          remetente: {
            id: user?.id,
            nome: user?.nome,
            permissao: user?.permissao,
          },
          enviadoEm: new Date().toISOString(),
          tipoEnvio: 'GRUPO',
        }),
      );

      const result = await NotificacaoPorPermissao(formData);

      if (result.error) {
        setResultado({ enviadas: 0, erros: 1 });
        alert(`Erro: ${result.message}`);
      } else {
        setResultado({ enviadas: 1, erros: 0 }); // 1 grupo enviado
        setTitulo('');
        setMensagem('');
      }
    } catch (err) {
      console.error(err);
      setResultado({ enviadas: 0, erros: 1 });
      alert('Erro ao enviar notificação para o grupo');
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Bell className="h-8 w-8 text-blue-600" />
          Enviar Notificações
        </h1>
        <p className="text-gray-600">
          Envie notificações para usuários individuais ou grupos inteiros
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Conteúdo da Notificação
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Nova reserva disponível"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem *
                </label>
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  rows={4}
                  placeholder="Digite sua mensagem aqui..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="SISTEMA">Sistema</option>
                  <option value="RESERVA">Reserva</option>
                  <option value="VAGA">Vaga</option>
                  <option value="VEICULO">Veículo</option>
                  <option value="MOTORISTA">Motorista</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filtros e Seleção */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Destinatários
            </h2>

            <div className="space-y-4 mb-6">
              {/* Modo de envio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Escolha o modo de envio:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFiltroTipo('GRUPO')}
                    className={`p-3 border rounded-lg transition-colors flex flex-col items-center justify-center gap-2 ${
                      filtroTipo === 'GRUPO'
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      Enviar para Grupo
                    </span>
                    <span className="text-xs text-gray-500 text-center">
                      Todos os usuários de um tipo
                    </span>
                  </button>

                  <button
                    onClick={() => setFiltroTipo('TODOS')}
                    className={`p-3 border rounded-lg transition-colors flex flex-col items-center justify-center gap-2 ${
                      filtroTipo !== 'GRUPO'
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      Selecionar Individualmente
                    </span>
                    <span className="text-xs text-gray-500 text-center">
                      Escolha usuários específicos
                    </span>
                  </button>
                </div>
              </div>

              {/* Se for modo GRUPO */}
              {filtroTipo === 'GRUPO' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione o grupo:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <button
                      onClick={() => setGrupoSelecionado('MOTORISTA')}
                      className={`p-3 border rounded-lg transition-colors flex flex-col items-center gap-1 ${
                        grupoSelecionado === 'MOTORISTA'
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">Motoristas</span>
                      <span className="text-xs text-gray-500">
                        {motoristas.length} usuários
                      </span>
                    </button>

                    <button
                      onClick={() => setGrupoSelecionado('AGENTE')}
                      className={`p-3 border rounded-lg transition-colors flex flex-col items-center gap-1 ${
                        grupoSelecionado === 'AGENTE'
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">Agentes</span>
                      <span className="text-xs text-gray-500">
                        {agentes.length} usuários
                      </span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => setGrupoSelecionado('GESTOR')}
                        className={`p-3 border rounded-lg transition-colors flex flex-col items-center gap-1 ${
                          grupoSelecionado === 'GESTOR'
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">Gestores</span>
                        <span className="text-xs text-gray-500">
                          {gestores.length} usuários
                        </span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Se for modo INDIVIDUAL */}
              {filtroTipo !== 'GRUPO' && (
                <>
                  {/* Filtro de tipo de usuário */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filtrar por tipo:
                    </label>
                    <select
                      value={filtroTipo}
                      onChange={(e) => setFiltroTipo(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="TODOS">Todos os usuários</option>
                      <option value="MOTORISTAS">Apenas motoristas</option>
                      <option value="AGENTES">Apenas agentes</option>
                      {isAdmin && (
                        <option value="GESTORES">Apenas gestores</option>
                      )}
                    </select>
                  </div>

                  {/* Controles de seleção */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {usuariosFiltrados().length} usuário(s) encontrado(s)
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={selecionarTodos}
                        className="text-sm px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg"
                      >
                        Selecionar todos
                      </button>
                      <button
                        type="button"
                        onClick={deselecionarTodos}
                        className="text-sm px-3 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        Limpar
                      </button>
                    </div>
                  </div>

                  {/* Lista de usuários */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                    {usuariosFiltrados().map((usuario) => (
                      <div
                        key={usuario.id}
                        className={`px-4 py-3 border-b border-gray-100 flex items-center gap-3 hover:bg-gray-50 cursor-pointer ${
                          usuariosSelecionados.includes(usuario.id)
                            ? 'bg-blue-50'
                            : ''
                        }`}
                        onClick={() => toggleUsuario(usuario.id)}
                      >
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center ${
                            usuariosSelecionados.includes(usuario.id)
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {usuariosSelecionados.includes(usuario.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {usuario.nome}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span className="truncate">{usuario.email}</span>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                usuario.tipo === 'MOTORISTA'
                                  ? 'bg-blue-100 text-blue-800'
                                  : usuario.tipo === 'AGENTE'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {usuario.tipo}
                            </span>
                          </div>
                        </div>
                        {usuariosSelecionados.includes(usuario.id) && (
                          <div className="text-blue-500">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Botão de envio (depende do modo) */}
            {filtroTipo === 'GRUPO' ? (
              <button
                onClick={handleEnvioGrupo}
                disabled={enviando || !titulo.trim() || !mensagem.trim()}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {enviando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando para o grupo...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar para todos os {grupoSelecionado.toLowerCase()}s (
                    {grupoSelecionado === 'MOTORISTA'
                      ? motoristas.length
                      : grupoSelecionado === 'AGENTE'
                        ? agentes.length
                        : gestores.length}{' '}
                    usuários)
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleEnvioIndividual}
                disabled={
                  enviando ||
                  !titulo.trim() ||
                  !mensagem.trim() ||
                  usuariosSelecionados.length === 0
                }
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {enviando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar para {usuariosSelecionados.length} usuário(s)
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Painel lateral */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo</h3>

            <div className="space-y-4">
              {/* Estatísticas */}
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Motoristas
                    </span>
                    <span className="font-bold text-blue-700">
                      {motoristas.length}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Agentes
                    </span>
                    <span className="font-bold text-green-700">
                      {agentes.length}
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Gestores
                        </span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      </div>
                      <span className="font-bold text-purple-700">
                        {gestores.length}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Resultado do envio */}
              {resultado && (
                <div
                  className={`p-4 rounded-lg border ${
                    resultado.erros > 0
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : 'bg-green-50 border-green-200 text-green-800'
                  }`}
                >
                  <div className="flex items-center gap-2 font-medium mb-1">
                    {resultado.erros > 0 ? (
                      <>
                        <X className="h-4 w-4" />
                        Envio parcial
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Sucesso!
                      </>
                    )}
                  </div>
                  <div className="text-sm">
                    {filtroTipo === 'GRUPO' ? (
                      <p>Notificação enviada para o grupo</p>
                    ) : (
                      <>
                        <p>
                          <strong>{resultado.enviadas}</strong> notificação(ões)
                          enviada(s)
                        </p>
                        {resultado.erros > 0 && (
                          <p className="mt-1">
                            <strong>{resultado.erros}</strong> erro(s)
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Dicas */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Dicas:</h4>
                <ul className="text-sm text-gray-600 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span>
                      Use <strong>Enviar para Grupo</strong> para comunicados
                      gerais
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span>
                      Use <strong>Selecionar Individualmente</strong> para
                      mensagens específicas
                    </span>
                  </li>
                  {isAdmin && (
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>
                        <strong>Apenas admin</strong> pode enviar para gestores
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
