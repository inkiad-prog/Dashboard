import sql from "mssql";

const config: sql.config = {
  server: process.env.DW_SERVER!,
  port: Number(process.env.DW_PORT ?? 1433),
  database: process.env.DW_DATABASE!,
  user: process.env.DW_USER!,
  password: process.env.DW_PASSWORD!,
  options: {
    // Node's TLS stack rejects raw IP addresses as a TLS SNI hostname (RFC 6066),
    // and this server is addressed by IP, not hostname — so encryption must be
    // disabled at the transport level rather than just trusting the cert.
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 5,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

export function getPool(): Promise<sql.ConnectionPool> {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .catch((err) => {
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
}

export async function query<T = Record<string, unknown>>(
  queryString: string,
  params?: Record<string, sql.ISqlTypeFactory | string | number>
): Promise<T[]> {
  const pool = await getPool();
  const request = pool.request();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
  }
  const result = await request.query(queryString);
  return result.recordset as T[];
}
