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
