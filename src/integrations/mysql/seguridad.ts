import pool from "../../../database/mysqlpool";
import { SeguridadRolSelect } from "@/types/mysqltypes";

export async function getRolesSeguridad(): Promise<SeguridadRolSelect[]> {
  console.log("🔵 [DB] Obteniendo roles de seguridad (usuario-rol)");
  const [rows] = await pool.query<SeguridadRolSelect[]>(
    `SELECT UR.ID_UR AS id, UR.USER_ID AS user_id, R.NOMBRE AS role
     FROM USUARIO_ROL UR
     JOIN ROLES R ON UR.ROL_ID = R.ROL_ID`,
  );
  console.log(`✅ [DB] Roles de seguridad retornados: ${rows.length}`);
  return rows;
}
