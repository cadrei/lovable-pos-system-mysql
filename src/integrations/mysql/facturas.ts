import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { FacturaInsert, FacturaSelect } from "@/types/mysqltypes";

export async function getFacturas(): Promise<FacturaSelect[]> {
  console.log("🔵 [DB] Obteniendo facturas");
  const [rows] = await pool.query<FacturaSelect[]>(
    "SELECT ID_FACTURA, ID_VENTA, NUMERO_FACTURA, NUM_AUTORIZACION, CLAVE_ACCESO, FECHA_EMISION, ID_FORMA_PAGO, SUBTOTAL15, SUBTOTAL0, SUBTOTAL_NO_IVA, SUBTOTAL_EXENTO_IVA, SUBTOTAL_SIN_IMPUESTOS, DESCUENTO, ICE, IVA, IRBPNR, PROPINA, TOTAL, ESTADO FROM FACTURA ORDER BY FECHA_EMISION DESC",
  );
  console.log(`✅ [DB] Facturas retornadas: ${rows.length}`);
  return rows;
}

export async function insertFactura(data: FacturaInsert): Promise<number> {
  console.log("🔵 [DB] Insertando factura");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO FACTURA (ID_VENTA, NUMERO_FACTURA, NUM_AUTORIZACION, CLAVE_ACCESO, FECHA_EMISION, ID_FORMA_PAGO, SUBTOTAL15, SUBTOTAL0, SUBTOTAL_NO_IVA, SUBTOTAL_EXENTO_IVA, SUBTOTAL_SIN_IMPUESTOS, DESCUENTO, ICE, IVA, IRBPNR, PROPINA, TOTAL, ESTADO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      data.ID_VENTA,
      data.NUMERO_FACTURA,
      data.NUM_AUTORIZACION,
      data.CLAVE_ACCESO,
      data.FECHA_EMISION,
      data.ID_FORMA_PAGO,
      data.SUBTOTAL15 ?? 0,
      data.SUBTOTAL0 ?? 0,
      data.SUBTOTAL_NO_IVA ?? 0,
      data.SUBTOTAL_EXENTO_IVA ?? 0,
      data.SUBTOTAL_SIN_IMPUESTOS ?? 0,
      data.DESCUENTO ?? 0,
      data.ICE ?? 0,
      data.IVA ?? 0,
      data.IRBPNR ?? 0,
      data.PROPINA ?? 0,
      data.TOTAL,
      data.ESTADO ?? "A",
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.insertId;
}

export async function updateFactura(id: number, data: Partial<FacturaInsert>): Promise<number> {
  console.log(`🔵 [DB] Actualizando factura ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE FACTURA SET ID_VENTA = COALESCE(?, ID_VENTA), NUMERO_FACTURA = COALESCE(?, NUMERO_FACTURA), NUM_AUTORIZACION = COALESCE(?, NUM_AUTORIZACION), CLAVE_ACCESO = COALESCE(?, CLAVE_ACCESO), FECHA_EMISION = COALESCE(?, FECHA_EMISION), ID_FORMA_PAGO = COALESCE(?, ID_FORMA_PAGO), SUBTOTAL15 = COALESCE(?, SUBTOTAL15), SUBTOTAL0 = COALESCE(?, SUBTOTAL0), SUBTOTAL_NO_IVA = COALESCE(?, SUBTOTAL_NO_IVA), SUBTOTAL_EXENTO_IVA = COALESCE(?, SUBTOTAL_EXENTO_IVA), SUBTOTAL_SIN_IMPUESTOS = COALESCE(?, SUBTOTAL_SIN_IMPUESTOS), DESCUENTO = COALESCE(?, DESCUENTO), ICE = COALESCE(?, ICE), IVA = COALESCE(?, IVA), IRBPNR = COALESCE(?, IRBPNR), PROPINA = COALESCE(?, PROPINA), TOTAL = COALESCE(?, TOTAL), ESTADO = COALESCE(?, ESTADO) WHERE ID_FACTURA = ?",
    [
      data.ID_VENTA ?? null,
      data.NUMERO_FACTURA ?? null,
      data.NUM_AUTORIZACION ?? null,
      data.CLAVE_ACCESO ?? null,
      data.FECHA_EMISION ?? null,
      data.ID_FORMA_PAGO ?? null,
      data.SUBTOTAL15 ?? null,
      data.SUBTOTAL0 ?? null,
      data.SUBTOTAL_NO_IVA ?? null,
      data.SUBTOTAL_EXENTO_IVA ?? null,
      data.SUBTOTAL_SIN_IMPUESTOS ?? null,
      data.DESCUENTO ?? null,
      data.ICE ?? null,
      data.IVA ?? null,
      data.IRBPNR ?? null,
      data.PROPINA ?? null,
      data.TOTAL ?? null,
      data.ESTADO ?? null,
      id,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteFactura(id: number): Promise<number> {
  console.log(`🔵 [DB] Eliminando factura ${id}`);
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM FACTURA WHERE ID_FACTURA = ?", [
    id,
  ]);
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
