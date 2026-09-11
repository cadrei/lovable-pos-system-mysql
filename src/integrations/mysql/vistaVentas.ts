import pool from "../../../database/mysqlpool";
import { VistaDetalleVentas, VistaVentas } from "@/types/mysqltypes";

export async function getVistaVentas(desde: string, hasta: string): Promise<VistaVentas[]> {
  console.log(
    `🔵 [vistaVentas.getVistaVentas] Obteniendo ventas de vista v_ventas: desde=${desde}, hasta=${hasta}`,
  );
  try {
    const [rows] = await pool.query<VistaVentas[]>(
      "SELECT idVenta AS id, idVenta, idVenta AS number, fechaHora AS created_at, total, subtotal, valorImpuesto AS tax, descuento AS discount, montoPago AS cost_total, estadoPago AS status, empleado AS user_name FROM v_ventas WHERE fechaHora >= ? AND fechaHora <= ? ORDER BY fechaHora DESC",
      [desde, hasta],
    );
    console.log(
      `✅ [vistaVentas.getVistaVentas] ventas de vista v_ventas obtenidas: ${rows.length}`,
    );
    return rows.map((row) => ({ ...row, created_at: new Date(row.created_at).toISOString() }));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [vistaVentas.getVistaVentas] Error obteniendo ventas de vista v_ventas: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function getVistaDetalleVentas(
  desde: string,
  hasta: string,
): Promise<VistaDetalleVentas[]> {
  console.log(
    `🔵 [vistaVentas.getVistaDetalleVentas] Obteniendo ventas de vista v_ventas_detalle: desde=${desde}, hasta=${hasta}`,
  );
  try {
    const [rows] = await pool.query<VistaDetalleVentas[]>(
      "SELECT nombreCategoria AS description, cantidad AS quantity, total, precioProducto AS unit_cost, fechaHora AS created_at, estadoPago AS status FROM v_ventas_detalle WHERE fechaHora >= ? AND fechaHora <= ? ORDER BY fechaHora DESC",
      [desde, hasta],
    );
    console.log(
      `✅ [vistaVentas.getVistaDetalleVentas] ventas de vista v_ventas_detalle obtenidas: ${rows.length}`,
    );
    return rows.map((row) => ({ ...row, created_at: new Date(row.created_at).toISOString() }));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [vistaVentas.getVistaDetalleVentas] Error obteniendo ventas de vista v_ventas_detalle: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
