import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Leaf, Mail, Lock, Recycle } from 'lucide-react';
import { AuthService } from '@/services/auth.service';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senha) {
      setError('Preencha todos os campos');
      return;
    }
    if (senha.length < 6) {
      setError('A senha deve conter pelo menos 6 caracteres');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await AuthService.login({ email, senha });
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message ?? err.response?.data ?? err.message;
        setError(typeof message === 'string' ? message : 'Email ou senha inválidos');
      } else {
        setError('Email ou senha inválidos');
      }
    } finally {
      setLoading(false);
    }
  };


  const iconContent = (
    <>
      <div className="flex justify-center mb-6 md:hidden">
        <div className="bg-green-500 rounded-full p-4">
          <Leaf className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Movimento Verde</h1>
        <p className="text-gray-400 mt-1 text-sm">Faça login para continuar</p>
      </div>
    </>
  );

  const formContent = (
    <>
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Mail className="h-4 w-4" />
            </span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="seu@email.com"
              autoComplete="email"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 border-transparent focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-200 outline-none transition text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Lock className="h-4 w-4" />
            </span>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => { setSenha(e.target.value); setError(null); }}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 border-transparent focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-200 outline-none transition text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

      </form>
    </>
  );

  return (
    <>
      {/* Mobile: card centralizado com fundo gradiente */}
      <div className="md:hidden min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="w-full max-w-sm mx-auto">
            {iconContent}
            {formContent}
          </div>
        </div>
      </div>

      {/* Desktop: split layout */}
      <div className="hidden md:flex min-h-screen">
        {/* Lado esquerdo — imagem com overlay verde */}
        <div className="w-1/2 relative bg-green-600 flex flex-col items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&auto=format&fit=crop"
            alt="Natureza"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 text-center px-12">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 rounded-full p-5">
                <Recycle className="h-14 w-14 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Movimento Verde
            </h2>
            <p className="text-green-100 mt-3 text-md">
              Sistema de Gerenciamento de <br />Arrecadação de Materiais Recicláveis
            </p>
          </div>
        </div>

        {/* Lado direito — boas-vindas + formulário */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-white px-16">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-green-600">Bem-vindo(a)!</h2>
              <p className="text-gray-400 mt-2 text-sm">
                Cada ação conta. Gerencie suas arrecadações e contribua para um mundo mais sustentável.
              </p>
            </div>
            <div className="w-full max-w-sm mx-auto">
              {formContent}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;