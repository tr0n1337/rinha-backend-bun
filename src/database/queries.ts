export const SELECT_CLIENTS = "SELECT * FROM clientes WHERE id = $1 FOR UPDATE";

export const UPDATE_BALANCE =
  "UPDATE clientes SET saldo = $1, transacoes = $2 WHERE id = $3";
