export type TransacaoRequest = {
  valor: number;
  tipo: string;
  descricao: string;
};

export type TransacaoResponse = {
  limite: number;
  saldo: number;
};
