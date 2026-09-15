import pool from "../../../database/mysqlpool";
import { ImagenesProductoRow } from "@/types/mysqltypes";

export async function getImagenesPorProducto(idProducto: string): Promise<ImagenesProductoRow[]> {
  console.log(
    `🔵 [imagenes.getImagenesPorProducto] Obteniendo imágenes activas para producto: idProducto=${idProducto}`,
  );
  try {
    const [rows] = await pool.query<ImagenesProductoRow[]>(
      `SELECT ID_IMAGEN as idImagen, ID_PRODUCTO as idProducto, URL_IMAGEN as urlImagen, DESCRIPCION as descripcion, ORDEN as orden, estado
       FROM IMAGENES_PRODUCTO
       WHERE ESTADO='A' AND ID_PRODUCTO=?
       ORDER BY ORDEN`,
      [idProducto],
    );
    console.log(
      `✅ [imagenes.getImagenesPorProducto] Éxito al obtener imágenes: ${rows.length} registros`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [imagenes.getImagenesPorProducto] Error al obtener imágenes ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
