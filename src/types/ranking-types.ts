export interface AlunoRankingItem {
  posicao: number;
  nome: string;
  quantidadeTampinhas: number;
  quantidadeLacres: number;
  total: number;
  medalha?: string;
  turma?: string;
  escola?: string;
}

export interface AlunoRankingSemanalItem extends AlunoRankingItem {
  dataReferencia?: string;
  periodo?: string;
}

export interface TurmaRankingItem {
  posicao: number;
  nome: string;
  quantidadeTampinhas: number;
  quantidadeLacres: number;
  total: number;
  id?: string;
  turmaId?: string;
  escolaId?: string;
  escolaNome?: string;
}

export interface EscolaRankingItem {
  posicao: number;
  nome: string;
  quantidadeTampinhas: number;
  quantidadeLacres: number;
  total: number;
  id?: string;
  escolaId?: string;
}

export interface TurmaAlunoRankingItem {
  posicao: number;
  nome: string;
  quantidadeTampinhas: number;
  quantidadeLacres: number;
  total: number;
  medalha?: string;
}


export const Medalhas = [
    {
      nome: "Iniciante",
      totalNecessario: 100,
      imagem:
        "https://images.pexels.com/photos/35445396/pexels-photo-35445396.jpeg?auto=compress&cs=tinysrgb&w=400",
      descricao: "Primeiros passos na coleta",
    },
    {
      nome: "Aprendiz Ecológico",
      totalNecessario: 300,
      imagem:
        "https://images.pexels.com/photos/16185426/pexels-photo-16185426.jpeg?auto=compress&cs=tinysrgb&w=400",
      descricao: "Gera consciência ambiental",
    },
    {
      nome: "Discípulo da Coleta",
      totalNecessario: 800,
      imagem:
        "https://images.pexels.com/photos/18151490/pexels-photo-18151490.jpeg?auto=compress&cs=tinysrgb&w=400",
      descricao: "Aumenta o impacto ecológico",
    },
    {
      nome: "Intermediário Verde",
      totalNecessario: 1500,
      imagem:
        "https://images.pexels.com/photos/9637636/pexels-photo-9637636.jpeg?auto=compress&cs=tinysrgb&w=400",
      descricao: "Se destaca pela presença verde",
    },
    {
      nome: "Intermediário Verde +",
      totalNecessario: 2200,
      imagem:
        "https://images.pexels.com/photos/19289098/pexels-photo-19289098.jpeg?auto=compress&cs=tinysrgb&w=400",
      descricao: "Continuidade e dedicação",
    },
    {
      nome: "Grande da Coleta",
      totalNecessario: 3500,
      imagem:
        "https://images.pexels.com/photos/26729471/pexels-photo-26729471.jpeg?auto=compress&cs=tinysrgb&w=400",
      descricao: "Grande contribuição ambiental",
    },
    {
      nome: "Lenda da Reciclagem",
      totalNecessario: 5000,
      imagem:
        "https://images.pexels.com/photos/34276821/pexels-photo-34276821.jpeg?auto=compress&cs=tinysrgb&w=400",
      descricao: "Referência na reciclagem",
    },
    {
      nome: "Highlander Verde",
      totalNecessario: 8000,
      imagem:
        "https://images.pexels.com/photos/17101455/pexels-photo-17101455.jpeg?auto=compress&cs=tinysrgb&w=400",
      descricao: "Nível de impacto excepcional",
    },
    {
      nome: "Mestre Eco",
      totalNecessario: 10000,
      imagem:
        "https://images.pexels.com/photos/18056653/pexels-photo-18056653.jpeg?auto=compress&cs=tinysrgb&w=400",
      descricao: "Maior nível de sustentabilidade",
    },
    {
      nome: "Rei Highlander Mestre Eco",
      totalNecessario: 15000,
      imagem:
        "https://images.pexels.com/photos/16149952/pexels-photo-16149952.jpeg?auto=compress&cs=tinysrgb&w=400",
      descricao: "Épico e inigualável",
    }
  ]