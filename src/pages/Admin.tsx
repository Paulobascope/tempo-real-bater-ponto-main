
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Settings, FileText, Edit, Trash2, Plus, Users } from 'lucide-react';

interface Usuario {
  email: string;
  name: string;
  funcao?: string;
  ctps?: string;
  matricula?: string;
  registro?: string;
  dtAdmissao?: string;
  pis?: string;
  jornada?: string;
  centroCusto?: string;
  descansoSemanal?: string;
}

interface Ponto {
  id: string;
  usuarioEmail: string;
  data: string;
  entrada?: string;
  saidaIntervalo?: string;
  entradaPosIntervalo?: string;
  saida?: string;
  funcao: string;
  local: string;
}

const Admin = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pontosUsuarios, setPontosUsuarios] = useState<{[key: string]: Ponto[]}>({});
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalPontosAberto, setModalPontosAberto] = useState(false);
  const [formPonto, setFormPonto] = useState({
    data: '',
    entrada: '',
    saidaIntervalo: '',
    entradaPosIntervalo: '',
    saida: ''
  });
  const [pontoEditando, setPontoEditando] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    
    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    carregarDados();
  }, [navigate]);

  const carregarDados = () => {
    // Carregar pontos
    const pontos = JSON.parse(localStorage.getItem('pontos') || '[]');
    
    // Agrupar usuários únicos
    const usuariosUnicos = new Map<string, Usuario>();
    const pontosAgrupados: {[key: string]: Ponto[]} = {};

    pontos.forEach((ponto: any) => {
      if (!usuariosUnicos.has(ponto.usuarioEmail)) {
        usuariosUnicos.set(ponto.usuarioEmail, {
          email: ponto.usuarioEmail,
          name: ponto.usuarioEmail.split('@')[0] // Nome padrão baseado no email
        });
      }
      
      if (!pontosAgrupados[ponto.usuarioEmail]) {
        pontosAgrupados[ponto.usuarioEmail] = [];
      }
      pontosAgrupados[ponto.usuarioEmail].push(ponto);
    });

    // Carregar dados adicionais dos usuários do localStorage
    const dadosUsuarios = JSON.parse(localStorage.getItem('dadosUsuarios') || '{}');
    usuariosUnicos.forEach((usuario, email) => {
      if (dadosUsuarios[email]) {
        Object.assign(usuario, dadosUsuarios[email]);
      }
    });

    setUsuarios(Array.from(usuariosUnicos.values()));
    setPontosUsuarios(pontosAgrupados);
  };

  const salvarDadosUsuario = (dadosAtualizados: Usuario) => {
    const dadosExistentes = JSON.parse(localStorage.getItem('dadosUsuarios') || '{}');
    dadosExistentes[dadosAtualizados.email] = dadosAtualizados;
    localStorage.setItem('dadosUsuarios', JSON.stringify(dadosExistentes));
    
    carregarDados();
    setModalEditarAberto(false);
    
    toast({
      title: "Sucesso!",
      description: "Dados do funcionário atualizados."
    });
  };

  const adicionarPonto = () => {
    if (!usuarioSelecionado || !formPonto.data) {
      toast({
        title: "Erro",
        description: "Preencha pelo menos a data.",
        variant: "destructive"
      });
      return;
    }

    const pontos = JSON.parse(localStorage.getItem('pontos') || '[]');
    const novoPonto = {
      id: Date.now().toString(),
      usuarioEmail: usuarioSelecionado.email,
      usuarioId: usuarioSelecionado.email,
      ...formPonto,
      funcao: 'Manual',
      local: 'Admin',
      timestamp: new Date().getTime()
    };

    if (pontoEditando) {
      const index = pontos.findIndex((p: any) => p.id === pontoEditando);
      if (index !== -1) {
        pontos[index] = { ...pontos[index], ...formPonto };
      }
      setPontoEditando(null);
    } else {
      pontos.push(novoPonto);
    }

    localStorage.setItem('pontos', JSON.stringify(pontos));
    setFormPonto({ data: '', entrada: '', saidaIntervalo: '', entradaPosIntervalo: '', saida: '' });
    carregarDados();
    
    toast({
      title: "Sucesso!",
      description: pontoEditando ? "Ponto atualizado." : "Ponto adicionado."
    });
  };

  const excluirPonto = (pontoId: string) => {
    if (confirm('Deseja realmente excluir este ponto?')) {
      const pontos = JSON.parse(localStorage.getItem('pontos') || '[]');
      const pontosAtualizados = pontos.filter((p: any) => p.id !== pontoId);
      localStorage.setItem('pontos', JSON.stringify(pontosAtualizados));
      carregarDados();
      
      toast({
        title: "Ponto excluído",
        description: "O registro foi removido."
      });
    }
  };

  const editarPonto = (ponto: Ponto) => {
    setFormPonto({
      data: ponto.data,
      entrada: ponto.entrada || '',
      saidaIntervalo: ponto.saidaIntervalo || '',
      entradaPosIntervalo: ponto.entradaPosIntervalo || '',
      saida: ponto.saida || ''
    });
    setPontoEditando(ponto.id);
  };

  const gerarRelatorio = () => {
    toast({
      title: "Relatório",
      description: "Funcionalidade de relatório em desenvolvimento."
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-700 text-white p-4 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8" />
            Painel Admin - Folha de Ponto
          </h1>
          <Button onClick={handleLogout} variant="secondary">
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Botões de Ação */}
        <div className="flex gap-4">
          <Button onClick={gerarRelatorio} className="bg-green-600 hover:bg-green-700">
            <FileText className="w-4 h-4 mr-2" />
            Gerar Relatórios
          </Button>
        </div>

        {/* Lista de Funcionários */}
        <Card>
          <CardHeader>
            <CardTitle>Funcionários com Pontos Registrados</CardTitle>
            <CardDescription>
              Gerencie os dados dos funcionários e seus registros de ponto
            </CardDescription>
          </CardHeader>
          <CardContent>
            {usuarios.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum funcionário com pontos registrados.
              </p>
            ) : (
              <div className="space-y-4">
                {usuarios.map((usuario) => (
                  <div key={usuario.email} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50">
                    <div>
                      <h3 className="font-semibold">{usuario.name}</h3>
                      <p className="text-sm text-gray-600">{usuario.email}</p>
                      <p className="text-sm text-gray-500">
                        Pontos: {pontosUsuarios[usuario.email]?.length || 0}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={modalEditarAberto && usuarioSelecionado?.email === usuario.email}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setUsuarioSelecionado(usuario);
                              setModalEditarAberto(true);
                            }}
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            Editar Informações
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Editar Dados do Funcionário</DialogTitle>
                            <DialogDescription>
                              Atualize as informações pessoais do funcionário
                            </DialogDescription>
                          </DialogHeader>
                          {usuarioSelecionado && (
                            <div className="space-y-4">
                              <div>
                                <Label>Email</Label>
                                <Input value={usuarioSelecionado.email} disabled />
                              </div>
                              <div>
                                <Label>Nome</Label>
                                <Input
                                  value={usuarioSelecionado.name}
                                  onChange={(e) => setUsuarioSelecionado({...usuarioSelecionado, name: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label>Função</Label>
                                <Input
                                  value={usuarioSelecionado.funcao || ''}
                                  onChange={(e) => setUsuarioSelecionado({...usuarioSelecionado, funcao: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label>CTPS</Label>
                                <Input
                                  value={usuarioSelecionado.ctps || ''}
                                  onChange={(e) => setUsuarioSelecionado({...usuarioSelecionado, ctps: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label>Matrícula</Label>
                                <Input
                                  value={usuarioSelecionado.matricula || ''}
                                  onChange={(e) => setUsuarioSelecionado({...usuarioSelecionado, matricula: e.target.value})}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setModalEditarAberto(false)}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  onClick={() => salvarDadosUsuario(usuarioSelecionado)}
                                >
                                  Salvar
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Dialog open={modalPontosAberto && usuarioSelecionado?.email === usuario.email}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => {
                              setUsuarioSelecionado(usuario);
                              setModalPontosAberto(true);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Gerenciar Pontos
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Pontos do Usuário: {usuario.name}</DialogTitle>
                            <DialogDescription>
                              Gerencie os registros de ponto do funcionário
                            </DialogDescription>
                          </DialogHeader>
                          
                          {/* Tabela de Pontos */}
                          <div className="mb-6">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Data</TableHead>
                                  <TableHead>Entrada</TableHead>
                                  <TableHead>Saída Intervalo</TableHead>
                                  <TableHead>Entrada Pós</TableHead>
                                  <TableHead>Saída</TableHead>
                                  <TableHead>Ações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {pontosUsuarios[usuario.email]?.map((ponto) => (
                                  <TableRow key={ponto.id}>
                                    <TableCell>{ponto.data}</TableCell>
                                    <TableCell>{ponto.entrada || '-'}</TableCell>
                                    <TableCell>{ponto.saidaIntervalo || '-'}</TableCell>
                                    <TableCell>{ponto.entradaPosIntervalo || '-'}</TableCell>
                                    <TableCell>{ponto.saida || '-'}</TableCell>
                                    <TableCell className="space-x-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => editarPonto(ponto)}
                                      >
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => excluirPonto(ponto.id)}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                )) || (
                                  <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                      Nenhum ponto registrado
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>

                          {/* Formulário Adicionar/Editar Ponto */}
                          <div className="space-y-4">
                            <h3 className="font-semibold">
                              {pontoEditando ? 'Editar Ponto' : 'Adicionar Novo Ponto'}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                              <Input
                                type="date"
                                value={formPonto.data}
                                onChange={(e) => setFormPonto({...formPonto, data: e.target.value})}
                                placeholder="Data"
                              />
                              <Input
                                type="time"
                                value={formPonto.entrada}
                                onChange={(e) => setFormPonto({...formPonto, entrada: e.target.value})}
                                placeholder="Entrada"
                              />
                              <Input
                                type="time"
                                value={formPonto.saidaIntervalo}
                                onChange={(e) => setFormPonto({...formPonto, saidaIntervalo: e.target.value})}
                                placeholder="Saída Intervalo"
                              />
                              <Input
                                type="time"
                                value={formPonto.entradaPosIntervalo}
                                onChange={(e) => setFormPonto({...formPonto, entradaPosIntervalo: e.target.value})}
                                placeholder="Entrada Pós"
                              />
                              <Input
                                type="time"
                                value={formPonto.saida}
                                onChange={(e) => setFormPonto({...formPonto, saida: e.target.value})}
                                placeholder="Saída"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={adicionarPonto}>
                                <Plus className="w-4 h-4 mr-1" />
                                {pontoEditando ? 'Atualizar' : 'Adicionar'}
                              </Button>
                              {pontoEditando && (
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setPontoEditando(null);
                                    setFormPonto({ data: '', entrada: '', saidaIntervalo: '', entradaPosIntervalo: '', saida: '' });
                                  }}
                                >
                                  Cancelar
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              onClick={() => setModalPontosAberto(false)}
                            >
                              Fechar
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
