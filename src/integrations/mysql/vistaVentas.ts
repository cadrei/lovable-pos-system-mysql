import pool from "../../../database/mysqlpool";
import { VistaDetalleVentas, VistaVentas } from "@/types/mysqltypes";

export async function getVistaVentas(desde: string, hasta: string): Promise<VistaVentas[]> {
  console.log("🔵 [DB] Obteniendo ventas para reportes");
  const [rows] = await pool.query<VistaVentas[]>(
    "SELECT idVenta AS id, idVenta, idVenta AS number, fechaHora AS created_at, total, subtotal, valorImpuesto AS tax, descuento AS discount, montoPago AS cost_total, estadoPago AS status, empleado AS user_name FROM v_ventas WHERE fechaHora >= ? AND fechaHora <= ? ORDER BY fechaHora DESC",
    [desde, hasta],
  );
  console.log(`✅ [DB] Ventas de reportes retornadas: ${rows.length}`);
  return rows.map((row) => ({ ...row, created_at: new Date(row.created_at).toISOString() }));
}

export async function getVistaDetalleVentas(
  desde: string,
  hasta: string,
): Promise<VistaDetalleVentas[]> {
  console.log("🔵 [DB] Obteniendo detalle de ventas para reportes");
  const [rows] = await pool.query<VistaDetalleVentas[]>(
    "SELECT nombreCategoria AS description, cantidad AS quantity, total, precioProducto AS unit_cost, fechaHora AS created_at, estadoPago AS status FROM v_ventas_detalle WHERE fechaHora >= ? AND fechaHora <= ? ORDER BY fechaHora DESC",
    [desde, hasta],
  );
  console.log(`✅ [DB] Detalle de ventas de reportes retornado: ${rows.length}`);
  return rows.map((row) => ({ ...row, created_at: new Date(row.created_at).toISOString() }));
}
