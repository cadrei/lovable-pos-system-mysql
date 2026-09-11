import pool from "../../../database/mysqlpool";
import type { RowDataPacket } from "mysql2";
import type { ResultSetHeader } from "mysql2/promise";
import type {
  BeneficioRow,
  BeneficiosSintomasInsert,
  BeneficiosSintomasSelect,
} from "@/types/mysqltypes";

export async function getBeneficios(): Promise<BeneficioRow[]> {
  console.log("🔵 [sintbeneficios.getBeneficios] Obteniendo beneficios_sintomas...");
  try {
    const [beneficios] = await pool.query<(BeneficioRow & RowDataPacket)[]>(
      "SELECT ID_SINT_BENEF as idBeneficio, NOMBRE_SINT_BENEF AS nombreBeneficio, DESCRIPCION_SINT_BENEF AS descBeneficio,ESTADO AS estado FROM BENEFICIOS_SINTOMAS WHERE ESTADO='A' ORDER BY NOMBRE_SINT_BENEF",
    );
    console.log(
      `✅ [sintbeneficios.getBeneficios] beneficios_sintomas obtenidos: ${beneficios.length}`,
    );
    return beneficios;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [sintbeneficios.getBeneficios] Error obteniendo beneficios_sintomas: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function getBeneficiosDetalle(): Promise<BeneficiosSintomasSelect[]> {
  console.log(
    "🔵 [sintbeneficios.getBeneficiosDetalle] Obteniendo detalla de beneficios_sintomas...",
  );
  try {
    const [rows] = await pool.query<BeneficiosSintomasSelect[]>(
      "SELECT ID_SINT_BENEF, NOMBRE_SINT_BENEF, DESCRIPCION_SINT_BENEF, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM BENEFICIOS_SINTOMAS ORDER BY NOMBRE_SINT_BENEF",
    );
    console.log(
      `✅ [sintbeneficios.getBeneficiosDetalle] detalle de beneficios_sintomas obtenidos: ${rows.length}`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [sintbeneficios.getBeneficiosDetalle] Error obteniendo detalle de beneficios_sintomas: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertBeneficio(data: BeneficiosSintomasInsert): Promise<number> {
  console.log(
    `🔵 [sintbeneficios.insertBeneficio] Insertando beneficios_sintomas con: id=${data.ID_SINT_BENEF}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO BENEFICIOS_SINTOMAS (ID_SINT_BENEF, NOMBRE_SINT_BENEF, DESCRIPCION_SINT_BENEF, ESTADO) VALUES (?, ?, ?, ?)",
      [
        data.ID_SINT_BENEF,
        data.NOMBRE_SINT_BENEF,
        data.DESCRIPCION_SINT_BENEF ?? null,
        data.ESTADO ?? "A",
      ],
    );
    console.log(
      `✅ [sintbeneficios.insertBeneficio] Exito insertando beneficios_sintomas afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [sintbeneficios.insertBeneficio] Error insertando beneficios_sintomas: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateBeneficio(
  id: string,
  data: Partial<BeneficiosSintomasInsert>,
): Promise<number> {
  console.log(`🔵 [sintbeneficios.updateBeneficio] Actualizando beneficios_sintomas con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE BENEFICIOS_SINTOMAS SET NOMBRE_SINT_BENEF = COALESCE(?, NOMBRE_SINT_BENEF), DESCRIPCION_SINT_BENEF = ?, ESTADO = COALESCE(?, ESTADO) WHERE ID_SINT_BENEF = ?",
      [
        data.NOMBRE_SINT_BENEF ?? null,
        data.DESCRIPCION_SINT_BENEF ?? null,
        data.ESTADO ?? null,
        id,
      ],
    );
    console.log(
      `✅ [sintbeneficios.updateBeneficio] Exito actualizando beneficios_sintomas afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [sintbeneficios.updateBeneficio] Error actualizando beneficios_sintomas: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteBeneficio(id: string): Promise<number> {
  console.log(`🔵 [sintbeneficios.deleteBeneficio] Eliminando beneficios_sintomas con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM BENEFICIOS_SINTOMAS WHERE ID_SINT_BENEF = ?",
      [id],
    );
    console.log(
      `✅ [sintbeneficios.deleteBeneficio] Exito eliminando beneficios_sintomas afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [sintbeneficios.deleteBeneficio] Error eliminando beneficios_sintomas: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
