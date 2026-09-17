// /database/mysqlpool.ts
import mysql from "mysql2/promise";

declare const process: {
  env: Record<string, string | undefined>;
};

// ─── Configuración desde variables de entorno ────────────────────────────────
const DB_CONFIG = {
  host: process.env["MYSQL_HOST"] || "localhost",
  port: parseInt(process.env["MYSQL_PORT"] || "3306", 10),
  user: process.env["MYSQL_USER"] || "root",
  password: process.env["MYSQL_PASSWORD"] || "",
  database: process.env["MYSQL_DATABASE"] || "naturista",
} as const;

console.log(
  `🔵 [mysqlpool.ts] Configurando Pool MySQL -> host=${DB_CONFIG.host}, port=${DB_CONFIG.port}, user=${DB_CONFIG.user}, database=${DB_CONFIG.database}`,
);

// ─── Creación del Pool ───────────────────────────────────────────────────────
export const pool = mysql.createPool({
  ...DB_CONFIG,

  // Pool
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // Timeouts (evitan que login quede colgado si la red/DB no responde)
  connectTimeout: 10_000, // 10s para establecer conexión
  // idleTimeout: 60_000, // opcional: cierra conexiones inactivas a los 60s

  // Keep-alive: mantiene vivas las conexiones y detecta caídas antes
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,

  // Recomendado si usas fechas: devuélvelas como string para evitar TZ issues
  // dateStrings: true,

  // Recomendado para prepared statements seguros
  // namedPlaceholders: true,
});

// ─── Listeners del Pool ──────────────────────────────────────────────────────
// CRÍTICO: mysql2 NO propaga errores de conexión del Pool por la promesa
// de query(). Solo se emiten aquí. Sin este listener, los errores de
// "connection lost", "ECONNRESET", etc. se pierden silenciosamente.
(pool as unknown as NodeJS.EventEmitter).on("error", (err: unknown) => {
  const e = err as Partial<{
    code: string;
    errno: number;
    sqlState: string;
    sqlMessage: string;
    message: string;
    stack: string;
  }> | null;

  console.error("🔴 [mysqlpool] Error en Pool MySQL:", {
    code: e?.code ?? "UNKNOWN",
    errno: e?.errno ?? 0,
    sqlState: e?.sqlState ?? "",
    sqlMessage: e?.sqlMessage ?? "",
    message: e?.message ?? String(err),
    stack: e?.stack,
    raw: err,
  });
});

pool.on("connection", () => {
  console.log("🟢 [mysqlpool] Nueva conexión establecida con MySQL");
});

pool.on("acquire", () => {
  // Descomenta si quieres ver cada adquisición (puede ser muy verboso)
  // console.log("🟡 [mysqlpool] Conexión adquirida del Pool");
});

pool.on("release", () => {
  // Descomenta si quieres ver cada release (puede ser muy verboso)
  // console.log("🟡 [mysqlpool] Conexión liberada al Pool");
});

// ─── Warm-up (opcional, NO bloquea el arranque) ──────────────────────────────
// Verifica la conexión al iniciar, pero sin tumbar el proceso si falla.
// El Pool seguirá intentando reconectar en cada query.
void (async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log("✅ [mysqlpool] Conexión inicial verificada correctamente");
  } catch (err) {
    const e = err as Partial<{ code: string; message: string }> | null;
    console.error(
      "🔴  [mysqlpool] No se pudo verificar la conexión inicial " +
        `(code=${e?.code ?? "UNKNOWN"}, message=${e?.message ?? String(err)}). ` +
        "El Pool reintentará en cada query.",
    );
    // NO relanzar, NO process.exit: el Pool se auto-recupera.
  }
})();

export default pool;
