import type { ResultSetHeader } from "mysql2/promise";
import { ClienteInsert, ClienteRow, ClienteSelect } from "@/types/mysqltypes";
import pool from "../../../database/mysqlpool";

export async function getClientes(): Promise<ClienteRow[]> {
  console.log("🔵 [clientes.getClientes] Obteniendo clientes...");
  try {
    const [rows] = await pool.query<ClienteRow[]>(
      "SELECT C.ID_CLIENTE,C.ID_DOCUMENTO,T.NOMBRE_TIPO_DOC AS TIPO_DOCUMENTO,C.NOMBRES,C.EMAIL,C.TELEFONO,C.DIRECCION FROM CLIENTE C JOIN TIPO_DOCUMENTO T ON C.ID_TIPO_DOC=T.ID_TIPO_DOC WHERE C.ESTADO='A'",
    );
    console.log(`✅ [clientes.getClientes] Clientes obtenidos: ${rows.length} registros`);
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [clientes.getClientes] Error al obtener clientes: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function getClientesDetalle(): Promise<ClienteSelect[]> {
  console.log("🔵 [clientes.getClientesDetalle] Obteniendo detalle de clientes...");
  try {
    const [rows] = await pool.query<ClienteSelect[]>(
      "SELECT ID_CLIENTE, ID_DOCUMENTO, ID_TIPO_DOC, NOMBRES, EMAIL, TELEFONO, DIRECCION, ESTADO, FECHA_CREACION, FECHA_MODIFICACION FROM CLIENTE ORDER BY NOMBRES",
    );
    console.log(
      `✅ [clientes.getClientesDetalle] detalles de clientes obtenidos: ${rows.length} registros`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [clientes.getClientesDetalle] Error al obtener detalle de clientes: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertCliente(data: ClienteInsert): Promise<number> {
  console.log(
    `🔵 [clientes.insertCliente] Insertando Cliente: documento=${data.ID_DOCUMENTO}, nombres=${data.NOMBRES}`,
  );
  try {
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
    console.log(
      `✅ [clientes.insertCliente] Éxito al insertar cliente: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [clientes.insertCliente] Error al insertar cliente: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateCliente(
  idCliente: number,
  data: Partial<ClienteInsert>,
): Promise<number> {
  console.log(`🔵 [clientes.updateCliente] actualizando cliente con id=${idCliente}`);
  try {
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
    console.log(
      `✅ [clientes.updateCliente] Éxito al actualizar cliente: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [clientes.updateCliente] Error al actualizar cliente ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteCliente(idCliente: number): Promise<number> {
  console.log(`🔵 [clientes.deleteCliente] Eliminando cliente con id=${idCliente}`);
  try {
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM CLIENTE WHERE ID_CLIENTE = ?", [
      idCliente,
    ]);
    console.log(
      `✅ [clientes.deleteCliente] Éxito eliminando cliente: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [clientes.deleteCliente] Error eliminando cliente: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
