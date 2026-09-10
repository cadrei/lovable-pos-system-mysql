import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { UsuarioInsert, UsuarioSelect } from "@/types/mysqltypes";

export async function getUsuarios(): Promise<UsuarioSelect[]> {
  console.log("🔵 [DB] Obteniendo usuarios");
  const [rows] = await pool.query<UsuarioSelect[]>(
    `SELECT U.USER_ID, U.ID_EMPLEADO, U.NOMBRE, U.NOMBRE_USUARIO, U.EMAIL, U.TELEFONO,
            U.PASSWORD_HASH, U.ESTADO, U.ULTIMO_LOGIN, U.FECHA_CREACION, U.FECHA_MODIFICACION,
            E.ID_SUCURSAL AS ID_SUCURSAL, S.NOMBRE_SUCURSAL AS NOMBRE_SUCURSAL
     FROM USUARIOS U
     LEFT JOIN EMPLEADO E ON U.ID_EMPLEADO = E.ID_EMPLEADO
     LEFT JOIN SUCURSALES S ON E.ID_SUCURSAL = S.ID_SUCURSAL
     ORDER BY U.NOMBRE`,
  );
  console.log(`✅ [DB] Usuarios retornados: ${rows.length}`);
  return rows;
}

export async function insertUsuario(data: UsuarioInsert): Promise<number> {
  console.log("🔵 [DB] Insertando usuario");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO USUARIOS (ID_EMPLEADO, NOMBRE, NOMBRE_USUARIO, EMAIL, TELEFONO, PASSWORD_HASH, ESTADO, ULTIMO_LOGIN) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      data.ID_EMPLEADO ?? null,
      data.NOMBRE,
      data.NOMBRE_USUARIO,
      data.EMAIL,
      data.TELEFONO ?? null,
      data.PASSWORD_HASH,
      data.ESTADO ?? "A",
      data.ULTIMO_LOGIN ?? null,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.insertId;
}

export async function updateUsuario(id: number, data: Partial<UsuarioInsert>): Promise<number> {
  console.log(`🔵 [DB] Actualizando usuario ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE USUARIOS SET ID_EMPLEADO = ?, NOMBRE = COALESCE(?, NOMBRE), NOMBRE_USUARIO = COALESCE(?, NOMBRE_USUARIO), EMAIL = COALESCE(?, EMAIL), TELEFONO = ?, PASSWORD_HASH = COALESCE(?, PASSWORD_HASH), ESTADO = COALESCE(?, ESTADO), ULTIMO_LOGIN = ? WHERE USER_ID = ?",
    [
      data.ID_EMPLEADO ?? null,
      data.NOMBRE ?? null,
      data.NOMBRE_USUARIO ?? null,
      data.EMAIL ?? null,
      data.TELEFONO ?? null,
      data.PASSWORD_HASH ?? null,
      data.ESTADO ?? null,
      data.ULTIMO_LOGIN ?? null,
      id,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteUsuario(id: number): Promise<number> {
  console.log(`🔵 [DB] Eliminando usuario ${id}`);
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM USUARIOS WHERE USER_ID = ?", [
    id,
  ]);
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateUsuarioEstado(id: number, estado: string): Promise<number> {
  console.log(`🔵 [DB] Actualizando estado del usuario ${id} a ${estado}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE USUARIOS SET ESTADO = ? WHERE USER_ID = ?",
    [estado, id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
