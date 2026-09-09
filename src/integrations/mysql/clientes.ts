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
