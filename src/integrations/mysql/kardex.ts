import pool from "../../../database/mysqlpool";
import { KardexRow } from "@/types/mysqltypes";
import type { RowDataPacket } from "mysql2";

export async function getKardex(limit: number = 80, sucursalId: string): Promise<KardexRow[]> {
  console.log(`🔵 [DB] Obteniendo kardex para la sucursal ${sucursalId}, límite ${limit}`);
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
  console.log(`✅ [DB] Ventas retornadas Kardex: ${rows.length}`);
  return rows;
}
