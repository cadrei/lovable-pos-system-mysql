import pool from "../../../database/mysqlpool";
import { RowDataPacket } from "mysql2";
import { SucursalRow } from "@/types/mysqltypes";

export async function getSucursales(): Promise<SucursalRow[]> {
  console.log("🔵 [DB] Obteniendo Sucursales...");
  const [sucursales] = await pool.query<(SucursalRow & RowDataPacket)[]>(
    "SELECT ID_SUCURSAL, NOMBRE_SUCURSAL FROM SUCURSALES WHERE ESTADO='A' ORDER BY NOMBRE_SUCURSAL",
  );
  console.log(`✅ [DB] Sucursales obtenidas: ${sucursales.length}`);
  return sucursales;
}

import type { ResultSetHeader } from "mysql2/promise";
import { SucursalInsert, SucursalSelect } from "@/types/mysqltypes";

export async function getSucursalesDetalle(): Promise<SucursalSelect[]> {
  console.log("🔵 [DB] Obteniendo sucursales completas");
  const [rows] = await pool.query<SucursalSelect[]>(
    "SELECT ID_SUCURSAL, NOMBRE_SUCURSAL, DIRECCION_SUCURSAL, TELEFONO, EMAIL, RESPONSABLE, RUC_SUCURSAL, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM SUCURSALES ORDER BY NOMBRE_SUCURSAL",
  );
  console.log(`✅ [DB] Sucursales retornadas: ${rows.length}`);
  return rows;
}

export async function insertSucursal(data: SucursalInsert): Promise<number> {
  console.log("🔵 [DB] Insertando sucursal");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO SUCURSALES (ID_SUCURSAL, NOMBRE_SUCURSAL, DIRECCION_SUCURSAL, TELEFONO, EMAIL, RESPONSABLE, RUC_SUCURSAL, ESTADO) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      data.ID_SUCURSAL,
      data.NOMBRE_SUCURSAL,
      data.DIRECCION_SUCURSAL,
      data.TELEFONO ?? null,
      data.EMAIL ?? null,
      data.RESPONSABLE ?? null,
      data.RUC_SUCURSAL,
      data.ESTADO ?? "A",
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateSucursal(id: string, data: Partial<SucursalInsert>): Promise<number> {
  console.log(`🔵 [DB] Actualizando sucursal ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE SUCURSALES SET NOMBRE_SUCURSAL = COALESCE(?, NOMBRE_SUCURSAL), DIRECCION_SUCURSAL = COALESCE(?, DIRECCION_SUCURSAL), TELEFONO = ?, EMAIL = ?, RESPONSABLE = ?, RUC_SUCURSAL = COALESCE(?, RUC_SUCURSAL), ESTADO = COALESCE(?, ESTADO) WHERE ID_SUCURSAL = ?",
    [
      data.NOMBRE_SUCURSAL ?? null,
      data.DIRECCION_SUCURSAL ?? null,
      data.TELEFONO ?? null,
      data.EMAIL ?? null,
      data.RESPONSABLE ?? null,
      data.RUC_SUCURSAL ?? null,
      data.ESTADO ?? null,
      id,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteSucursal(id: string): Promise<number> {
  console.log(`🔵 [DB] Eliminando sucursal ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM SUCURSALES WHERE ID_SUCURSAL = ?",
    [id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
