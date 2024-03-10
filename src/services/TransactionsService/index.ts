import { SELECT_CLIENTS, UPDATE_BALANCE } from "database/queries";
import { HttpResponse } from "helpers";
import type { Cliente } from "database/models/Client";
import type { PoolClient } from "pg";
import type { ErrorResponse } from "typings";
import type { TransacaoRequest, TransacaoResponse } from "./protocols";

export async function TransactionsService(
  db: PoolClient,
  id: number | null,
  body: TransacaoRequest
) {
  const { descricao, tipo, valor } = body;

  await db.query("BEGIN");

  const users = await db.query<Cliente>(SELECT_CLIENTS, [Number(id)]);

  const [user] = users.rows;

  const { transacoes, limite, saldo } = user;

  const newBalance = tipo === "c" ? saldo + valor : saldo - valor;

  if (newBalance < -limite) {
    await db.query("ROLLBACK");
    db.release();

    return HttpResponse<ErrorResponse>({ message: "Invalid transaction" }, 422);
  }

  const parsedTransacoes = JSON.parse(transacoes);

  if (parsedTransacoes.length === 10) {
    parsedTransacoes.pop();
  }

  parsedTransacoes.unshift({
    descricao,
    tipo,
    valor,
    realizada_em: new Date()
  });

  await db.query(UPDATE_BALANCE, [
    newBalance,
    JSON.stringify(parsedTransacoes),
    Number(id)
  ]);

  await db.query("COMMIT");

  db.release();

  return HttpResponse<TransacaoResponse>({ limite, saldo: newBalance }, 200);
}
