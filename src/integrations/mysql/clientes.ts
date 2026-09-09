import pool from "../../../database/mysqlpool";
import { ClienteRow } from "@/types/mysqltypes";

export async function getClientes(): Promise<ClienteRow[]> {
  console.log("🔵 [DB] Obteniendo clientes activos para POS");
  const [rows] = await pool.query<ClienteRow[]>(
    "SELECT C.ID_CLIENTE,C.ID_DOCUMENTO,T.NOMBRE_TIPO_DOC AS TIPO_DOCUMENTO,C.NOMBRES,C.EMAIL,C.TELEFONO,C.DIRECCION FROM CLIENTE C JOIN TIPO_DOCUMENTO T ON C.ID_TIPO_DOC=T.ID_TIPO_DOC WHERE C.ESTADO='A'",
  );
  console.log(`✅ [DB] Clientes retornados: ${rows.length}`);
  return rows;
}

import type { ResultSetHeader } from "mysql2/promise";
import { ClienteInsert, ClienteSelect } from "@/types/mysqltypes";

export async function getClientesDetalle(): Promise<ClienteSelect[]> {
  console.log("🔵 [DB] Obteniendo clientes completos");
  const [rows] = await pool.query<ClienteSelect[]>(
    "SELECT ID_CLIENTE, ID_DOCUMENTO, ID_TIPO_DOC, NOMBRES, EMAIL, TELEFONO, DIRECCION, ESTADO, FECHA_CREACION, FECHA_MODIFICACION FROM CLIENTE ORDER BY NOMBRES",
  );
  console.log(`✅ [DB] Clientes retornados: ${rows.length}`);
  return rows;
}

export async function insertCliente(data: ClienteInsert): Promise<number> {
  console.log("🔵 [DB] Insertando cliente");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO CLIENTE (ID_DOCUMENTO, ID_TIPO_DOC, NOMBRES, EMAIL, TELEFONO, DIRECCION, ESTADO) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      data.ID_DOCUMENTO,
      data.ID_TIPO_DOC,
      data.NOMBRES,
      data.EMAIL ?? null,
      data.TELEFONO ?? null,
      data.DIRECCION ?? null,
      data.ESTADO ?? "A",
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateCliente(
  idCliente: number,
  data: Partial<ClienteInsert>,
): Promise<number> {
  console.log(`🔵 [DB] Actualizando cliente ${idCliente}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE CLIENTE SET ID_DOCUMENTO = COALESCE(?, ID_DOCUMENTO), ID_TIPO_DOC = COALESCE(?, ID_TIPO_DOC), NOMBRES = COALESCE(?, NOMBRES), EMAIL = ?, TELEFONO = ?, DIRECCION = ?, ESTADO = COALESCE(?, ESTADO) WHERE ID_CLIENTE = ?",
    [
      data.ID_DOCUMENTO ?? null,
      data.ID_TIPO_DOC ?? null,
      data.NOMBRES ?? null,
      data.EMAIL ?? null,
      data.TELEFONO ?? null,
      data.DIRECCION ?? null,
      data.ESTADO ?? null,
      idCliente,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteCliente(idCliente: number): Promise<number> {
  console.log(`🔵 [DB] Eliminando cliente ${idCliente}`);
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM CLIENTE WHERE ID_CLIENTE = ?", [
    idCliente,
  ]);
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
