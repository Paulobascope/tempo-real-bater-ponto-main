
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulando autenticação - substitua por sua lógica real
    setTimeout(() => {
      if (formData.email && formData.password) {
        // Simulando diferentes tipos de usuário
        const isAdmin = formData.email.includes('admin');
        localStorage.setItem('user', JSON.stringify({
          email: formData.email,
          name: formData.name || formData.email.split('@')[0],
          role: isAdmin ? 'admin' : 'user'
        }));
        
        toast({
          title: isLogin ? "Login realizado!" : "Cadastro realizado!",
          description: isLogin ? "Bem-vindo de volta!" : "Conta criada com sucesso!"
        });

        navigate(isAdmin ? '/admin' : '/dashboard');
      } else {
        toast({
          title: "Erro",
          description: "Por favor, preencha todos os campos.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Entrar no Sistema' : 'Cadastrar Usuário'}
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Faça login para acessar o sistema' : 'Crie sua conta para começar'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="mt-1"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1"
                autoComplete="username"
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="mt-1"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
            </Button>
          </form>

          <p className="text-center text-gray-700 mt-4">
            {isLogin ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-700 font-semibold hover:underline"
            >
              {isLogin ? 'Cadastre-se' : 'Entrar'}
            </button>
          </p>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
            <p className="font-medium text-blue-800">Contas de teste:</p>
            <p className="text-blue-600">Usuário: user@test.com</p>
            <p className="text-blue-600">Admin: admin@test.com</p>
            <p className="text-blue-600">Senha: qualquer</p>
          </div>
        </CardContent>
      </Card>
      
    </div>
    
  );
};

export default Login;
