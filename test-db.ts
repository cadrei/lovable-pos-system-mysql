import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "10.13.178.38",
  port: 3306,
  user: "adminTienda",
  password: "admin.Tienda.2026_ñ?!",
  database: "Naturista",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Probar conexión
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Conexión a MySQL establecida");
    connection.release();
  })
  .catch((error) => {
    console.error("❌ Error conectando a MySQL:", error.message);
  });

export default pool;

async function main() {
  try {
    // Consulta simple para validar conexión
    const [rows] = await (
      pool as unknown as {
        query: (sql: string) => Promise<[unknown, unknown]>;
      }
    ).query("SELECT NOW() AS fecha");

    console.log("✅ Conexión exitosa a MySQL");
    console.log("Resultado de la consulta:", rows);
  } catch (err) {
    console.error("❌ Error al conectar con MySQL:", err);
  } finally {
    // Cierra el pool para evitar procesos colgados
    await pool.end();
  }
}
main();
