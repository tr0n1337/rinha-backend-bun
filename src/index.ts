import { Pool } from "pg";
import { Elysia, t } from "elysia";
import { StatementService, TransactionsService } from "services";

const pool = new Pool({
  connectionString: "postgres://postgres:postgres@db:5432/rinhabackend",
  max: 1
});

const app = new Elysia();
app.onError(({ code, error, set }) => {
  switch (code) {
    case "VALIDATION":
      set.status = 422;

      return {
        message: error?.validator.Errors(error.value).First().message
      };

    case "NOT_FOUND":
      return { message: error?.message };

    default:
      break;
  }
});

app.get(
  "/clientes/:id/extrato",
  async ({ params: { id }, set }) => {
    if (id > 5) {
      set.status = 404;

      return "User not found";
    }

    const db = await pool.connect();
    const { body, status } = await StatementService(db, id);

    set.status = status;

    return body;
  },
  {
    params: t.Object({
      id: t.Numeric({
        error: "Invalid params"
      })
    })
  }
);

app.post(
  "/clientes/:id/transacoes",
  async ({ params: { id }, body: { descricao, tipo, valor }, set }) => {
    if (id > 5) {
      set.status = 404;

      return "User not found";
    }

    const db = await pool.connect();
    const { body, status } = await TransactionsService(db, id, {
      descricao,
      tipo,
      valor
    });

    set.status = status;

    return body;
  },
  {
    params: t.Object({
      id: t.Numeric({
        error: "Invalid params"
      })
    }),
    body: t.Object(
      {
        valor: t.Integer({ multipleOf: 1, error: "Invalid value" }),
        tipo: t.String({
          pattern: "^(d|c)$",
          error: "Invalid type"
        }),
        descricao: t.String({
          maxLength: 10,
          minLength: 1,
          error: "Invalid description"
        })
      },
      { error: "Invalid body" }
    )
  }
);
app.listen(8000);
