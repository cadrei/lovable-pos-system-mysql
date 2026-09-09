import pool from "../../../database/mysqlpool";
import type { RowDataPacket } from "mysql2";
import { ProductoRow } from "@/types/mysqltypes";
import { ProductoInsertRow } from "@/types/mysqltypes";
import { ProductoBeneficioRow } from "@/types/mysqltypes";

export async function getProductos(sucursalId: string): Promise<ProductoRow[]> {
  console.log(`🔵 [DB] Obteniendo productos para la sucursal ${sucursalId}`);
  const [productos] = await pool.query<(ProductoRow & RowDataPacket)[]>(
    "SELECT * FROM v_productos WHERE idSucursal = ? AND CANTIDAD > 0",
    [sucursalId],
  );
  console.log(`✅ [DB] Productos retornados: ${productos.length}`);
  return productos;
}

export async function getProductosBeneficio(
  beneficioId: string,
  sucursalId: string,
): Promise<ProductoBeneficioRow[]> {
  console.log(
    `🔵 [DB] Obteniendo productos para el beneficio ${beneficioId} y la sucursal ${sucursalId}`,
  );

  let sql = `
    SELECT p.NOMBRE_PRODUCTO AS producto,
           s.NOMBRE_SUCURSAL AS sucursal,
           p.PVP AS precio,
           ps.CANTIDAD AS cantidad,
           p.UNIDAD_MEDIDA AS unidad_medida,
           p.PESO_VOLUMEN AS peso_volumen,
           b.DESCRIPCION_SINT_BENEF AS descripcion
    FROM PRODUCTOS p
    JOIN PRODUCTOS_BENEFICIOS pb ON p.ID_PRODUCTO = pb.ID_PRODUCTO
    JOIN BENEFICIOS_SINTOMAS b ON pb.ID_SINT_BENEF = b.ID_SINT_BENEF
    JOIN PRODUCTOS_SUCURSAL ps ON p.ID_PRODUCTO = ps.ID_PRODUCTO
    JOIN SUCURSALES s ON ps.ID_SUCURSAL = s.ID_SUCURSAL
    WHERE pb.ID_SINT_BENEF = ?
      AND b.ESTADO = 'A'
      AND ps.CANTIDAD <> 0
  `;
  const params: string[] = [beneficioId];
  // Solo agregamos el filtro si no es ALL
  if (sucursalId && sucursalId !== "ALL") {
    sql += " AND s.ID_SUCURSAL = ?";
    params.push(sucursalId);
  }
  sql += " ORDER BY p.NOMBRE_PRODUCTO, s.NOMBRE_SUCURSAL, ps.CANTIDAD";
  const [productosBeneficio] = await pool.query<(ProductoBeneficioRow & RowDataPacket)[]>(
    sql,
    params,
  );
  console.log(`✅ [DB] Productos Beneficio retornados: ${productosBeneficio.length}`);
  return productosBeneficio;
}

export async function insertProducto(producto: ProductoInsertRow) {
  console.log(`🔵 [DB] Insertando producto ${producto["ID_PRODUCTO"]}`);
  const [result] = await pool.query<ResultSetHeader>(
    `
    INSERT INTO PRODUCTOS (
      ID_PRODUCTO,
      NOMBRE_PRODUCTO,
      PVP,
      DESCRIPCION,
      ID_SUBCATEGORIA,
      ETIQUETAS,
      UNIDAD_MEDIDA,
      PESO_VOLUMEN,
      ID_LABORATORIO,
      CODIGO_BARRAS,
      FECHA_CADUCIDAD,
      ID_STOCK_MIN,
      ID_STOCK_MAX,
      ID_PROVEEDOR,
      ESTADO
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      producto["ID_PRODUCTO"],
      producto["NOMBRE_PRODUCTO"],
      producto["PVP"],
      producto["DESCRIPCION"],
      producto["ID_SUBCATEGORIA"],
      producto["ETIQUETAS"],
      producto["UNIDAD_MEDIDA"],
      producto["PESO_VOLUMEN"],
      producto["ID_LABORATORIO"],
      producto["CODIGO_BARRAS"],
      producto["FECHA_CADUCIDAD"],
      producto["ID_STOCK_MIN"],
      producto["ID_STOCK_MAX"],
      producto["ID_PROVEEDOR"],
      producto["ESTADO"] ?? "A",
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result;
}

import type { ResultSetHeader } from "mysql2/promise";
import { ProductoSelect } from "@/types/mysqltypes";

export async function getProductosDetalle(): Promise<ProductoSelect[]> {
  console.log("🔵 [DB] Obteniendo productos completos");
  const [rows] = await pool.query<ProductoSelect[]>(
    "SELECT ID_PRODUCTO, NOMBRE_PRODUCTO, PVP, DESCRIPCION, ID_SUBCATEGORIA, ETIQUETAS, UNIDAD_MEDIDA, PESO_VOLUMEN, ID_LABORATORIO, CODIGO_BARRAS, FECHA_CADUCIDAD, ID_STOCK_MIN, ID_STOCK_MAX, ID_PROVEEDOR, FECHA_CREACION, FECHA_ACTUALIZACION, ESTADO FROM PRODUCTOS ORDER BY NOMBRE_PRODUCTO",
  );
  console.log(`✅ [DB] Productos retornados: ${rows.length}`);
  return rows;
}

export async function updateProducto(
  id: string,
  producto: Partial<ProductoInsertRow>,
): Promise<number> {
  console.log(`🔵 [DB] Actualizando producto ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE PRODUCTOS SET NOMBRE_PRODUCTO = COALESCE(?, NOMBRE_PRODUCTO), PVP = COALESCE(?, PVP), DESCRIPCION = ?, ID_SUBCATEGORIA = COALESCE(?, ID_SUBCATEGORIA), ETIQUETAS = ?, UNIDAD_MEDIDA = ?, PESO_VOLUMEN = ?, ID_LABORATORIO = ?, CODIGO_BARRAS = ?, FECHA_CADUCIDAD = ?, ID_STOCK_MIN = ?, ID_STOCK_MAX = ?, ID_PROVEEDOR = ?, ESTADO = COALESCE(?, ESTADO) WHERE ID_PRODUCTO = ?",
    [
      producto.NOMBRE_PRODUCTO ?? null,
      producto.PVP ?? null,
      producto.DESCRIPCION ?? null,
      producto.ID_SUBCATEGORIA ?? null,
      producto.ETIQUETAS ?? null,
      producto.UNIDAD_MEDIDA ?? null,
      producto.PESO_VOLUMEN ?? null,
      producto.ID_LABORATORIO ?? null,
      producto.CODIGO_BARRAS ?? null,
      producto.FECHA_CADUCIDAD ?? null,
      producto.ID_STOCK_MIN ?? null,
      producto.ID_STOCK_MAX ?? null,
      producto.ID_PROVEEDOR ?? null,
      producto.ESTADO ?? null,
      id,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteProducto(id: string): Promise<number> {
  console.log(`🔵 [DB] Eliminando producto ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM PRODUCTOS WHERE ID_PRODUCTO = ?",
    [id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
