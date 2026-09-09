import pool from "../../../database/mysqlpool";
import type { RowDataPacket } from "mysql2";
import { ProductoRow, VentaRow } from "@/types/mysqltypes";

export async function getPanelData(sucursalId: string) {
  try {
    const desde = new Date(Date.now() - 30 * 86400000);
    const desdeMysql = desde.toISOString().slice(0, 10);
    console.log("🔵 [DB] Ejecutando consultas de Panel...");
    console.log("🔵 [DB] Obteniendo ventas con fechaHora >= ", desdeMysql);
    const [ventas] = await pool.query<(VentaRow & RowDataPacket)[]>(
      //"SELECT * FROM v_ventas WHERE fechaHora >= ? AND fechaHora <= NOW() AND idSucursal = ? ORDER BY fechaHora DESC",
      "SELECT * FROM v_ventas WHERE fechaHora >= ? AND fechaHora <= NOW() ORDER BY fechaHora DESC",
      [desdeMysql, sucursalId],
    );
    const [productos] = await pool.query<(ProductoRow & RowDataPacket)[]>(
      "SELECT * FROM v_productos WHERE idSucursal = ?", //Filtrado por sucursal
      [sucursalId],
    );
    console.log(`✅ [DB] Ventas retornadas: ${ventas.length}`);
    console.log(`✅ [DB] Productos retornados: ${productos.length}`);
    return { ventas, productos };
  } catch (error) {
    console.error("❌ [DB] Error en Panel:", error);
    throw error;
  }
}
