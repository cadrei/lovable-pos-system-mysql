import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { VentaInsert, VentaSelect } from "@/types/mysqltypes";

export async function getVentas(): Promise<VentaSelect[]> {
  console.log("🔵 [DB] Obteniendo ventas");
  const [rows] = await pool.query<VentaSelect[]>(
    "SELECT ID_VENTA, ID_SUCURSAL, ID_CLIENTE, ID_EMPLEADO, ID_PAGO, ID_TIPO_IMPUESTO, FECHA_HORA, SUBTOTAL, VALOR_IMPUESTO, DESCUENTO, TOTAL, ESTADO, FECHA_CREACION, FECHA_MODIFICACION FROM VENTA ORDER BY FECHA_HORA DESC",
  );
  console.log(`✅ [DB] Ventas retornadas: ${rows.length}`);
  return rows;
}

export async function insertVenta(data: VentaInsert): Promise<number> {
  console.log("🔵 [DB] Insertando venta");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO VENTA (ID_SUCURSAL, ID_CLIENTE, ID_EMPLEADO, ID_PAGO, ID_TIPO_IMPUESTO, FECHA_HORA, SUBTOTAL, VALOR_IMPUESTO, DESCUENTO, TOTAL, ESTADO) VALUES (?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), ?, ?, ?, ?, ?)",
    [
      data.ID_SUCURSAL,
      data.ID_CLIENTE,
      data.ID_EMPLEADO,
      data.ID_PAGO,
      data.ID_TIPO_IMPUESTO,
      data.FECHA_HORA ?? null,
      data.SUBTOTAL,
      data.VALOR_IMPUESTO,
      data.DESCUENTO ?? 0,
      data.TOTAL,
      data.ESTADO ?? "C",
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.insertId;
}

export async function updateVenta(idVenta: number, data: Partial<VentaInsert>): Promise<number> {
  console.log(`🔵 [DB] Actualizando venta ${idVenta}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE VENTA SET ID_SUCURSAL = COALESCE(?, ID_SUCURSAL), ID_CLIENTE = COALESCE(?, ID_CLIENTE), ID_EMPLEADO = COALESCE(?, ID_EMPLEADO), ID_PAGO = COALESCE(?, ID_PAGO), ID_TIPO_IMPUESTO = COALESCE(?, ID_TIPO_IMPUESTO), FECHA_HORA = COALESCE(?, FECHA_HORA), SUBTOTAL = COALESCE(?, SUBTOTAL), VALOR_IMPUESTO = COALESCE(?, VALOR_IMPUESTO), DESCUENTO = COALESCE(?, DESCUENTO), TOTAL = COALESCE(?, TOTAL), ESTADO = COALESCE(?, ESTADO) WHERE ID_VENTA = ?",
    [
      data.ID_SUCURSAL ?? null,
      data.ID_CLIENTE ?? null,
      data.ID_EMPLEADO ?? null,
      data.ID_PAGO ?? null,
      data.ID_TIPO_IMPUESTO ?? null,
      data.FECHA_HORA ?? null,
      data.SUBTOTAL ?? null,
      data.VALOR_IMPUESTO ?? null,
      data.DESCUENTO ?? null,
      data.TOTAL ?? null,
      data.ESTADO ?? null,
      idVenta,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteVenta(idVenta: number): Promise<number> {
  console.log(`🔵 [DB] Eliminando venta ${idVenta}`);
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM VENTA WHERE ID_VENTA = ?", [
    idVenta,
  ]);
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
