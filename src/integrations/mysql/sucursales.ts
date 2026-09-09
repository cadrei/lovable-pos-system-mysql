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
