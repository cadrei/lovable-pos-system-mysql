import pool from "../../../database/mysqlpool";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { SucursalInsert, SucursalRow, SucursalSelect } from "@/types/mysqltypes";

export async function getSucursales(): Promise<SucursalRow[]> {
  console.log("🔵 [sucursales.getSucursales] Obteniendo sucursales...", {});
  try {
    const [sucursales] = await pool.query<(SucursalRow & RowDataPacket)[]>(
      "SELECT ID_SUCURSAL, NOMBRE_SUCURSAL FROM SUCURSALES WHERE ESTADO='A' ORDER BY NOMBRE_SUCURSAL",
    );
    console.log(`✅ [sucursales.getSucursales] Sucursales obtenidas: ${sucursales.length}`);
    return sucursales;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ [sucursales.getSucursales] Error al obtener sucursales:", err.message);
      throw new Error(`[sucursales.getSucursales] ${err.message}`);
    }
    console.error("❌ [sucursales.getSucursales] Error desconocido al obtener sucursales:", err);
    throw new Error(`[sucursales.getSucursales] ${String(err)}`);
  }
}

export async function getSucursalesDetalle(): Promise<SucursalSelect[]> {
  console.log("🔵 [sucursales.getSucursalesDetalle] Obteniendo detalle de sucursales...");
  try {
    const [rows] = await pool.query<SucursalSelect[]>(
      `SELECT ID_SUCURSAL, NOMBRE_SUCURSAL, DIRECCION_SUCURSAL, TELEFONO, EMAIL, 
              RESPONSABLE, RUC_SUCURSAL, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION 
       FROM SUCURSALES 
       ORDER BY NOMBRE_SUCURSAL`,
    );
    console.log(
      `✅ [sucursales.getSucursalesDetalle] Detalle de sucursales retornadas: ${rows.length}`,
    );
    return rows;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        "❌ [sucursales.getSucursalesDetalle] Error al obtener detalle de sucursales:",
        err.message,
      );
      throw new Error(`[sucursales.getSucursalesDetalle] ${err.message}`);
    }
    console.error(
      "❌ [sucursales.getSucursalesDetalle] Error desconocido al obtener detalle de sucursales:",
      err,
    );
    throw new Error(`[sucursales.getSucursalesDetalle] ${String(err)}`);
  }
}

export async function insertSucursal(data: SucursalInsert): Promise<number> {
  console.log("🔵 [sucursales.insertSucursal] Insertando sucursal");
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO SUCURSALES 
        (ID_SUCURSAL, NOMBRE_SUCURSAL, DIRECCION_SUCURSAL, TELEFONO, EMAIL, RESPONSABLE, RUC_SUCURSAL, ESTADO) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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
    console.log(
      `✅ [sucursales.insertSucursal] Exito insertando sucursal afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ [sucursales.insertSucursal] Error al insertar sucursal:", err.message);
      throw new Error(
        ` [sucursales.insertSucursal] No se pudo insertar la sucursal. Detalle: ${err.message}`,
      );
    }
    console.error("❌ [sucursales.insertSucursal] Error desconocido al insertar sucursal:", err);
    throw new Error(
      `[sucursales.insertSucursal] Error inesperado al insertar sucursal: ${String(err)}`,
    );
  }
}

export async function updateSucursal(id: string, data: Partial<SucursalInsert>): Promise<number> {
  console.log(`🔵 [sucursales.updateSucursal] Actualizando sucursal con: id= ${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE SUCURSALES 
         SET NOMBRE_SUCURSAL = COALESCE(?, NOMBRE_SUCURSAL), 
             DIRECCION_SUCURSAL = COALESCE(?, DIRECCION_SUCURSAL), 
             TELEFONO = ?, 
             EMAIL = ?, 
             RESPONSABLE = ?, 
             RUC_SUCURSAL = COALESCE(?, RUC_SUCURSAL), 
             ESTADO = COALESCE(?, ESTADO) 
       WHERE ID_SUCURSAL = ?`,
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
    console.log(
      `✅ [sucursales.updateSucursal] Exito actualizando sucursal afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        `❌ [sucursales.updateSucursal] Error al actualizar sucursal ${id}:`,
        err.message,
      );
      throw new Error(
        `[sucursales.updateSucursal] Error actualizando sucursal: id= ${id}. Detalle= ${err.message}`,
      );
    }
    console.error(
      `❌ [sucursales.updateSucursal] Error desconocido al actualizar sucursal ${id}:`,
      err,
    );
    throw new Error(
      `[sucursales.updateSucursal] Error inesperado al actualizar sucursal ${id}: ${String(err)}`,
    );
  }
}

export async function deleteSucursal(id: string): Promise<number> {
  console.log(`🔵 [sucursales.deleteSucursal] Eliminando sucursal con id= ${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM SUCURSALES WHERE ID_SUCURSAL = ?",
      [id],
    );
    console.log(
      `✅ [sucursales.deleteSucursal] Exito eliminando sucursal afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        `❌ [sucursales.deleteSucursal] Error al eliminar sucursal con id=${id}:`,
        err.message,
      );
      throw new Error(
        `[sucursales.deleteSucursal] No se pudo eliminar la sucursal ${id}. Detalle: ${err.message}`,
      );
    }
    console.error(
      `❌ [sucursales.deleteSucursal] Error desconocido al eliminar sucursal con id= ${id}:`,
      err,
    );
    throw new Error(
      `[sucursales.deleteSucursal] Error inesperado al eliminar sucursal ${id}: ${String(err)}`,
    );
  }
}
