export type StatementResponse = {
  saldo: {
    total: number;
    data_extrato: Date;
    limite: number;
  };
  ultimas_transacoes: {
    valor: number;
    tipo: string;
    descricao: string;
    realizada_em: Date;
  }[];
};
