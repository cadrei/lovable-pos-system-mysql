import mysql from "mysql2/promise";

declare const process: {
  env: Record<string, string | undefined>;
};
console.log(
  `🔵 [mysqlpool.ts] Conectando a MySQL -> 
    host=${process.env["MYSQL_HOST"]}, 
    port=${process.env["MYSQL_PORT"]}, 
    user=${process.env["MYSQL_USER"]}, 
    database=${process.env["MYSQL_DATABASE"]}`,
);

const pool = mysql.createPool({
  host: process.env["MYSQL_HOST"] || "localhost",
  port: parseInt(process.env["MYSQL_PORT"] || "3306"),
  user: process.env["MYSQL_USER"] || "root",
  password: process.env["MYSQL_PASSWORD"] || "",
  database: process.env["MYSQL_DATABASE"] || "naturista",
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
    console.error(
      `❌ Error conectando a MySQL: ${error.message} (host=${process.env["MYSQL_HOST"]}, port=${process.env["MYSQL_PORT"]}, user=${process.env["MYSQL_USER"]}, database=${process.env["MYSQL_DATABASE"]})`,
    );
  });

export default pool;
