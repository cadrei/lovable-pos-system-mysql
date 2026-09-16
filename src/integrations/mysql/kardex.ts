import pool from "../../../database/mysqlpool";
import { KardexRow } from "@/types/mysqltypes";
import type { RowDataPacket } from "mysql2";

export async function getKardex(limit: number = 80, sucursalId: string): Promise<KardexRow[]> {
  try {
    console.log("🔵 [kardex.getKardex] Obteniendo kardex de vista v_ventas_detalle con: ", {
      limit,
      sucursalId,
    });
    const [rows] = await pool.query<(KardexRow & RowDataPacket)[]>(
      `
    SELECT 
      idVenta,
      fechaHora,
      idProducto,
      nombreProducto,
      precioProducto,
      nombreCategoria,
      cliente,
      cantidad
    FROM v_ventas_detalle
    WHERE fechaHora <= NOW()
      AND idSucursal = ?
    ORDER BY fechaHora DESC
    LIMIT ?
    `,
      [sucursalId, limit],
    );
    console.log("✅ [kardex.getKardex] Kardex obtenido: ", {
      limit,
      sucursalId,
      count: rows.length,
    });
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ [kardex.getKardex] Error al obtener kardex: ", {
      limit,
      sucursalId,
      message,
    });
    throw new Error(`[kardex.getKardex] ${message}`);
  }
}
