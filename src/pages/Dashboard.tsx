
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Clock, LogOut, MapPin, User } from 'lucide-react';

interface PontoRegistro {
  id: string;
  data: string;
  diaSemana: string;
  local: string;
  funcao: string;
  entrada?: string;
  saidaIntervalo?: string;
  entradaPosIntervalo?: string;
  saida?: string;
  intervalo?: number;
  tipo?: 'folga' | 'normal';
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    funcao: '',
    local: '',
    intervalo: ''
  });
  const [pontos, setPontos] = useState<PontoRegistro[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role === 'admin') {
      navigate('/admin');
      return;
    }
    
    setUser(parsedUser);
    carregarPontos();
  }, [navigate]);

  const carregarPontos = () => {
    const pontosStorage = localStorage.getItem('pontos') || '[]';
    const todosPontos = JSON.parse(pontosStorage);
    const pontosUsuario = todosPontos.filter((p: any) => p.usuarioEmail === user?.email);
    setPontos(pontosUsuario);
  };

  const getDataEDiaBrasil = () => {
    const now = new Date();
    const data = now.toISOString().split('T')[0];
    const diaSemana = now.toLocaleDateString('pt-BR', { weekday: 'long' });
    return { data, diaSemana };
  };

  const gerarHorariosAleatorios = () => {
    const minutos = [0, 1, 2, 3, 4, 5];
    const minutoAleatorio = minutos[Math.floor(Math.random() * minutos.length)];
    
    const entrada = `15:${minutoAleatorio.toString().padStart(2, '0')}`;
    const saida = `23:${minutoAleatorio.toString().padStart(2, '0')}`;
    
    return { entrada, saida };
  };

  const somarMinutos = (hora: string, minutosASomar: number) => {
    const [h, m] = hora.split(':').map(Number);
    let totalMinutos = h * 60 + m + minutosASomar;
    const horas = Math.floor(totalMinutos / 60) % 24;
    const minutos = totalMinutos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.funcao || !formData.local || !formData.intervalo) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const { data, diaSemana } = getDataEDiaBrasil();
    const { entrada, saida } = gerarHorariosAleatorios();
    
    const novoPonto: PontoRegistro = {
      id: Date.now().toString(),
      data,
      diaSemana,
      local: formData.local,
      funcao: formData.funcao,
      entrada,
      saidaIntervalo: formData.intervalo,
      entradaPosIntervalo: somarMinutos(formData.intervalo, 40),
      saida,
      intervalo: 40,
      tipo: 'normal'
    };

    // Adicionar ao localStorage
    const pontosExistentes = JSON.parse(localStorage.getItem('pontos') || '[]');
    pontosExistentes.push({
      ...novoPonto,
      usuarioEmail: user.email,
      usuarioId: user.email
    });
    localStorage.setItem('pontos', JSON.stringify(pontosExistentes));

    toast({
      title: "Sucesso!",
      description: "Ponto registrado com sucesso."
    });

    setFormData({ funcao: '', local: '', intervalo: '' });
    carregarPontos();
  };

  const registrarFolga = () => {
    const { data, diaSemana } = getDataEDiaBrasil();
    
    const folga: PontoRegistro = {
      id: Date.now().toString(),
      data,
      diaSemana,
      local: '',
      funcao: 'Folga',
      tipo: 'folga'
    };

    const pontosExistentes = JSON.parse(localStorage.getItem('pontos') || '[]');
    pontosExistentes.push({
      ...folga,
      usuarioEmail: user.email,
      usuarioId: user.email
    });
    localStorage.setItem('pontos', JSON.stringify(pontosExistentes));

    toast({
      title: "Folga registrada!",
      description: "Sua folga foi registrada para hoje."
    });

    carregarPontos();
  };

  const excluirPonto = (id: string) => {
    if (confirm('Deseja realmente excluir este ponto?')) {
      const pontosExistentes = JSON.parse(localStorage.getItem('pontos') || '[]');
      const pontosAtualizados = pontosExistentes.filter((p: any) => p.id !== id);
      localStorage.setItem('pontos', JSON.stringify(pontosAtualizados));
      carregarPontos();
      
      toast({
        title: "Ponto excluído",
        description: "O registro foi removido com sucesso."
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 p-6">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-white text-3xl font-bold flex items-center gap-2">
          <User className="w-8 h-8" />
          Olá, {user.name}!
        </h1>
        <Button 
          onClick={handleLogout}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </header>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Formulário de Registro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Registrar Ponto
            </CardTitle>
            <CardDescription>
              Preencha os dados para registrar seu ponto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="funcao">Função</Label>
                  <Select value={formData.funcao} onValueChange={(value) => setFormData({...formData, funcao: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Atendente">Atendente</SelectItem>
                      <SelectItem value="Produção">Produção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="local">Local</Label>
                  <Select value={formData.local} onValueChange={(value) => setFormData({...formData, local: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o local" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lago">🌊 Lago</SelectItem>
                      <SelectItem value="Delivery">🚚 Delivery</SelectItem>
                      <SelectItem value="Praça">🌳 Praça</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="intervalo">Início do Intervalo</Label>
                  <Input
                    id="intervalo"
                    type="time"
                    value={formData.intervalo}
                    onChange={(e) => setFormData({...formData, intervalo: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Registrar Ponto
                </Button>
                <Button type="button" onClick={registrarFolga} className="bg-green-500 hover:bg-green-600">
                  Registrar Folga
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tabela de Pontos */}
        <Card>
          <CardHeader>
            <CardTitle>Pontos Registrados</CardTitle>
            <CardDescription>
              Histórico dos seus registros de ponto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Dia</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Saída Intervalo</TableHead>
                    <TableHead>Entrada Pós Intervalo</TableHead>
                    <TableHead>Saída</TableHead>
                    <TableHead>Intervalo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pontos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                        Nenhum ponto registrado ainda
                      </TableCell>
                    </TableRow>
                  ) : (
                    pontos.map((ponto) => (
                      <TableRow key={ponto.id} className={ponto.tipo === 'folga' ? 'bg-green-50' : ''}>
                        <TableCell>{ponto.data}</TableCell>
                        <TableCell>{ponto.diaSemana}</TableCell>
                        <TableCell>{ponto.tipo === 'folga' ? '-' : ponto.local}</TableCell>
                        <TableCell className={ponto.tipo === 'folga' ? 'font-bold text-green-600' : ''}>
                          {ponto.funcao}
                        </TableCell>
                        <TableCell>{ponto.entrada || '-'}</TableCell>
                        <TableCell>{ponto.saidaIntervalo || '-'}</TableCell>
                        <TableCell>{ponto.entradaPosIntervalo || '-'}</TableCell>
                        <TableCell>{ponto.saida || '-'}</TableCell>
                        <TableCell>{ponto.intervalo || '-'}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => excluirPonto(ponto.id)}
                          >
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
