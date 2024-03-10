import { HttpResponse } from "helpers";
import { SELECT_CLIENTS } from "../../database/queries";
import type { PoolClient } from "pg";
import type { ErrorResponse } from "typings";
import type { Cliente } from "database/models/Client";
import type { StatementResponse } from "./protocols";

export async function StatementService(db: PoolClient, id: number | null) {
  const users = await db.query<Cliente>(SELECT_CLIENTS, [Number(id)]);

  const [user] = users?.rows;

  const { limite, saldo, transacoes } = user;

  db.release();

  return HttpResponse<StatementResponse>(
    {
      saldo: {
        total: saldo,
        data_extrato: new Date(),
        limite: limite
      },
      ultimas_transacoes: JSON.parse(transacoes as unknown as string)
    },
    200
  );
}
