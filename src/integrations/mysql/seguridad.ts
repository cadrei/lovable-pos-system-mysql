import pool from "../../../database/mysqlpool";
import type { SeguridadRolSelect } from "@/types/mysqltypes";

export async function getRolesSeguridad(): Promise<SeguridadRolSelect[]> {
  console.log("🔵 [seguridad.getRolesSeguridad] Obteniendo Roles de Usuario...");
  try {
    const [rows] = await pool.query<SeguridadRolSelect[]>(
      `SELECT UR.ID_UR AS id, UR.USER_ID AS user_id, R.NOMBRE AS role
         FROM USUARIO_ROL UR
         JOIN ROLES R ON UR.ROL_ID = R.ROL_ID`,
    );
    console.log(`✅ [seguridad.getRolesSeguridad] Roles de usuario obtenidos: ${rows.length}`);
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [seguridad.getRolesSeguridad] Error al obtener roles de usuario: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
