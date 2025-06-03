
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, BarChart3, Shield } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6 flex items-center justify-center gap-3">
            <Clock className="w-12 h-12" />
            Sistema de Ponto
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Gerencie registros de ponto de forma simples e eficiente. 
            Sistema completo para controle de jornada de trabalho.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Registro Rápido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-purple-100">
                Registre entrada, saída e intervalos com poucos cliques. 
                Interface intuitiva e responsiva.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                Gestão de Funcionários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-purple-100">
                Gerencie dados pessoais, funções e locais de trabalho 
                de todos os funcionários.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Relatórios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-purple-100">
                Gere relatórios detalhados e folhas de ponto 
                para controle e análise.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-md mx-auto bg-white">
            <CardHeader>
              <CardTitle className="text-gray-800">Acesse o Sistema</CardTitle>
              <CardDescription>
                Faça login para começar a usar o sistema de ponto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => navigate('/login')}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                <Shield className="w-5 h-5 mr-2" />
                Fazer Login
              </Button>
              
              <div className="text-sm text-gray-600">
                <p className="font-medium">Contas de demonstração:</p>
                <p>👤 Usuário: user@test.com</p>
                <p>👑 Admin: admin@test.com</p>
                <p>🔑 Senha: qualquer</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
