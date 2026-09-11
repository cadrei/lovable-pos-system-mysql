import pool from "../../../database/mysqlpool";
import type { RowDataPacket } from "mysql2";
import { ProductoRow, VentaRow } from "@/types/mysqltypes";

export async function getPanelData(
  sucursalId: string,
): Promise<{ ventas: (VentaRow & RowDataPacket)[]; productos: (ProductoRow & RowDataPacket)[] }> {
  try {
    const desde = new Date(Date.now() - 30 * 86400000);
    const desdeMysql = desde.toISOString().slice(0, 10);
    console.log("🔵 [panel.getPanelData] Ejecutando consultas de Panel con:", {
      sucursalId,
      desdeMysql,
    });
    const [ventas] = await pool.query<(VentaRow & RowDataPacket)[]>(
      //"SELECT * FROM v_ventas WHERE fechaHora >= ? AND fechaHora <= NOW() AND idSucursal = ? ORDER BY fechaHora DESC",
      "SELECT * FROM v_ventas WHERE fechaHora >= ? AND fechaHora <= NOW() ORDER BY fechaHora DESC",
      [desdeMysql, sucursalId],
    );
    const [productos] = await pool.query<(ProductoRow & RowDataPacket)[]>(
      "SELECT * FROM v_productos WHERE idSucursal = ?", //Filtrado por sucursal
      [sucursalId],
    );
    console.log("✅ [panel.getPanelData] Datos retornados de Panel: ", {
      sucursalId,
      ventas: ventas.length,
      productos: productos.length,
    });
    return { ventas, productos };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ [panel.getPanelData] Error al ejecutar consultas de Panel con: ", {
      sucursalId,
      message,
    });
    throw new Error(`[panel.getPanelData] ${message}`);
  }
}
