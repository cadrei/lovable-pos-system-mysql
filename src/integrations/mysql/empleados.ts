import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { EmpleadoInsert, EmpleadoSelect } from "@/types/mysqltypes";

export async function getEmpleados(): Promise<EmpleadoSelect[]> {
  console.log("🔵 [empleados.getEmpleados] Obteniendo empleados...");
  try {
    const [rows] = await pool.query<EmpleadoSelect[]>(
      "SELECT ID_EMPLEADO, ID_DOCUMENTO, ID_TIPO_DOC, ID_SUCURSAL, NOMBRES, TELEFONO, EMAIL, DIRECCION, CARGO, FECHA_CONTRATACION, ESTADO, FECHA_CREACION, FECHA_MODIFICACION FROM EMPLEADO WHERE ESTADO='A' ORDER BY NOMBRES",
    );
    console.log(`✅ [empleados.getEmpleados] Éxito al obtener empleados: ${rows.length} registros`);
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [empleados.getEmpleados] Error al obtener empleados: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertEmpleado(data: EmpleadoInsert): Promise<number> {
  console.log(
    `🔵 [empleados.insertEmpleado] Inertando empleado con: documento=${data.ID_DOCUMENTO}, nombres=${data.NOMBRES}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO EMPLEADO (ID_DOCUMENTO, ID_TIPO_DOC, ID_SUCURSAL, NOMBRES, TELEFONO, EMAIL, DIRECCION, CARGO, FECHA_CONTRATACION, ESTADO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.ID_DOCUMENTO,
        data.ID_TIPO_DOC,
        data.ID_SUCURSAL,
        data.NOMBRES,
        data.TELEFONO ?? null,
        data.EMAIL ?? null,
        data.DIRECCION ?? null,
        data.CARGO ?? null,
        data.FECHA_CONTRATACION,
        data.ESTADO ?? "A",
      ],
    );
    console.log(
      `✅ [empleados.insertEmpleado] Éxito insertando empleado: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [empleados.insertEmpleado] Error insertando empleado: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateEmpleado(
  idEmpleado: number,
  data: Partial<EmpleadoInsert>,
): Promise<number> {
  console.log(`🔵 [empleados.updateEmpleado] Actualizando empleado con: id=${idEmpleado}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE EMPLEADO SET ID_DOCUMENTO = COALESCE(?, ID_DOCUMENTO), ID_TIPO_DOC = COALESCE(?, ID_TIPO_DOC), ID_SUCURSAL = COALESCE(?, ID_SUCURSAL), NOMBRES = COALESCE(?, NOMBRES), TELEFONO = ?, EMAIL = ?, DIRECCION = ?, CARGO = ?, FECHA_CONTRATACION = COALESCE(?, FECHA_CONTRATACION), ESTADO = COALESCE(?, ESTADO) WHERE ID_EMPLEADO = ?",
      [
        data.ID_DOCUMENTO ?? null,
        data.ID_TIPO_DOC ?? null,
        data.ID_SUCURSAL ?? null,
        data.NOMBRES ?? null,
        data.TELEFONO ?? null,
        data.EMAIL ?? null,
        data.DIRECCION ?? null,
        data.CARGO ?? null,
        data.FECHA_CONTRATACION ?? null,
        data.ESTADO ?? null,
        idEmpleado,
      ],
    );
    console.log(
      `✅ [empleados.updateEmpleado] Éxito actualizando empleado: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [empleados.updateEmpleado] Error actualizando empleado ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteEmpleado(idEmpleado: number): Promise<number> {
  console.log(`🔵 [empleados.deleteEmpleado] Eliminando empleado con: id=${idEmpleado}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM EMPLEADO WHERE ID_EMPLEADO = ?",
      [idEmpleado],
    );
    console.log(
      `✅ [empleados.deleteEmpleado] Éxito eliminando empleado: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [empleados.deleteEmpleado] Error eliminando empleado: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
