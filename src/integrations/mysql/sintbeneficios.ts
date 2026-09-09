import pool from "../../../database/mysqlpool";
import type { RowDataPacket } from "mysql2";
import { BeneficioRow } from "@/types/mysqltypes";

export async function getBeneficios(): Promise<BeneficioRow[]> {
  console.log(`🔵 [DB] Obteniendo Lista de Beneficios...`);
  const [beneficios] = await pool.query<(BeneficioRow & RowDataPacket)[]>(
    "SELECT ID_SINT_BENEF as idBeneficio, NOMBRE_SINT_BENEF AS nombreBeneficio, DESCRIPCION_SINT_BENEF AS descBeneficio,ESTADO AS estado FROM BENEFICIOS_SINTOMAS WHERE ESTADO='A' ORDER BY NOMBRE_SINT_BENEF",
  );
  console.log(`✅ [DB] Beneficios retornados: ${beneficios.length}`);
  return beneficios;
}

import type { ResultSetHeader } from "mysql2/promise";
import { BeneficiosSintomasInsert, BeneficiosSintomasSelect } from "@/types/mysqltypes";

export async function getBeneficiosDetalle(): Promise<BeneficiosSintomasSelect[]> {
  console.log("🔵 [DB] Obteniendo beneficios y sintomas completos");
  const [rows] = await pool.query<BeneficiosSintomasSelect[]>(
    "SELECT ID_SINT_BENEF, NOMBRE_SINT_BENEF, DESCRIPCION_SINT_BENEF, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM BENEFICIOS_SINTOMAS ORDER BY NOMBRE_SINT_BENEF",
  );
  console.log(`✅ [DB] Beneficios y sintomas retornados: ${rows.length}`);
  return rows;
}

export async function insertBeneficio(data: BeneficiosSintomasInsert): Promise<number> {
  console.log("🔵 [DB] Insertando beneficio o sintoma");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO BENEFICIOS_SINTOMAS (ID_SINT_BENEF, NOMBRE_SINT_BENEF, DESCRIPCION_SINT_BENEF, ESTADO) VALUES (?, ?, ?, ?)",
    [
      data.ID_SINT_BENEF,
      data.NOMBRE_SINT_BENEF,
      data.DESCRIPCION_SINT_BENEF ?? null,
      data.ESTADO ?? "A",
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateBeneficio(
  id: string,
  data: Partial<BeneficiosSintomasInsert>,
): Promise<number> {
  console.log(`🔵 [DB] Actualizando beneficio o sintoma ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE BENEFICIOS_SINTOMAS SET NOMBRE_SINT_BENEF = COALESCE(?, NOMBRE_SINT_BENEF), DESCRIPCION_SINT_BENEF = ?, ESTADO = COALESCE(?, ESTADO) WHERE ID_SINT_BENEF = ?",
    [data.NOMBRE_SINT_BENEF ?? null, data.DESCRIPCION_SINT_BENEF ?? null, data.ESTADO ?? null, id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteBeneficio(id: string): Promise<number> {
  console.log(`🔵 [DB] Eliminando beneficio o sintoma ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM BENEFICIOS_SINTOMAS WHERE ID_SINT_BENEF = ?",
    [id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
