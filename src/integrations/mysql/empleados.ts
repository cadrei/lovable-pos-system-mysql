import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { EmpleadoInsert, EmpleadoSelect } from "@/types/mysqltypes";

export async function getEmpleados(): Promise<EmpleadoSelect[]> {
  console.log("🔵 [DB] Obteniendo empleados activos");
  const [rows] = await pool.query<EmpleadoSelect[]>(
    "SELECT ID_EMPLEADO, ID_DOCUMENTO, ID_TIPO_DOC, ID_SUCURSAL, NOMBRES, TELEFONO, EMAIL, DIRECCION, CARGO, FECHA_CONTRATACION, ESTADO, FECHA_CREACION, FECHA_MODIFICACION FROM EMPLEADO WHERE ESTADO='A' ORDER BY NOMBRES",
  );
  console.log(`✅ [DB] Empleados retornados: ${rows.length}`);
  return rows;
}

export async function insertEmpleado(data: EmpleadoInsert): Promise<number> {
  console.log("🔵 [DB] Insertando empleado");
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
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateEmpleado(
  idEmpleado: number,
  data: Partial<EmpleadoInsert>,
): Promise<number> {
  console.log(`🔵 [DB] Actualizando empleado ${idEmpleado}`);
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
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteEmpleado(idEmpleado: number): Promise<number> {
  console.log(`🔵 [DB] Eliminando empleado ${idEmpleado}`);
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM EMPLEADO WHERE ID_EMPLEADO = ?", [
    idEmpleado,
  ]);
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
