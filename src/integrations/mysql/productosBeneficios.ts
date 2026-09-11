import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import type { RowDataPacket } from "mysql2";
import { ProductoBeneficioInsert, ProductoBeneficioSelect } from "@/types/mysqltypes";

export async function getProductosBeneficios(
  productoId?: string,
): Promise<ProductoBeneficioSelect[]> {
  console.log(
    `🔵 [productosBeneficios.getProductosBeneficios] Obteniendo productos beneficios: productoId=${productoId ?? "todos"}`,
  );
  try {
    const [rows] = await pool.query<(ProductoBeneficioSelect & RowDataPacket)[]>(
      productoId
        ? "SELECT ID_PRODUCTO, ID_SINT_BENEF, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM PRODUCTOS_BENEFICIOS WHERE ID_PRODUCTO = ?"
        : "SELECT ID_PRODUCTO, ID_SINT_BENEF, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM PRODUCTOS_BENEFICIOS",
      productoId ? [productoId] : [],
    );
    console.log(
      `✅ [productosBeneficios.getProductosBeneficios] Éxito obteniendo productos beneficios: ${rows.length} registros`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [productosBeneficios.getProductosBeneficios] Error obteniendo productos beneficios: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertProductoBeneficio(data: ProductoBeneficioInsert): Promise<number> {
  console.log(
    `🔵 [productosBeneficios.insertProductoBeneficio] Insertando en productos beneficios con: productoId=${data.ID_PRODUCTO}, beneficioId=${data.ID_SINT_BENEF}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO PRODUCTOS_BENEFICIOS (ID_PRODUCTO, ID_SINT_BENEF, ESTADO) VALUES (?, ?, ?)",
      [data.ID_PRODUCTO, data.ID_SINT_BENEF, data.ESTADO ?? "A"],
    );
    console.log(
      `✅ [productosBeneficios.insertProductoBeneficio] Éxito insertando en productos beneficios: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [productosBeneficios.insertProductoBeneficio] Error en productos beneficios: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateProductoBeneficio(
  productoId: string,
  beneficioId: string,
  estado: string,
): Promise<number> {
  console.log(
    `🔵 [productosBeneficios.updateProductoBeneficio] Actualizando en productos beneficios con: productoId=${productoId}, beneficioId=${beneficioId}, estado=${estado}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE PRODUCTOS_BENEFICIOS SET ESTADO = ? WHERE ID_PRODUCTO = ? AND ID_SINT_BENEF = ?",
      [estado, productoId, beneficioId],
    );
    console.log(
      `✅ [productosBeneficios.updateProductoBeneficio] Éxito actualizando en productos beneficios: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [productosBeneficios.updateProductoBeneficio] Error actualizando en productos beneficios: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteProductoBeneficio(
  productoId: string,
  beneficioId: string,
): Promise<number> {
  console.log(
    `🔵 [productosBeneficios.deleteProductoBeneficio] Eliminando en productos beneficios con: productoId=${productoId}, beneficioId=${beneficioId}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM PRODUCTOS_BENEFICIOS WHERE ID_PRODUCTO = ? AND ID_SINT_BENEF = ?",
      [productoId, beneficioId],
    );
    console.log(
      `✅ [productosBeneficios.deleteProductoBeneficio] Éxito eliminando en productos beneficios: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [productosBeneficios.deleteProductoBeneficio] Error eliminando en productos beneficios: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
