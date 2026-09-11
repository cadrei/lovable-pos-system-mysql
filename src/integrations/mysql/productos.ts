import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../../../database/mysqlpool";
import {
  ProductoBeneficioRow,
  ProductoInsertRow,
  ProductoRow,
  ProductoSelect,
  VistaProductos,
} from "@/types/mysqltypes";

export async function getProductosReporte(sucursalId: string): Promise<VistaProductos[]> {
  console.log(`🔵 [productos.getProductosReporte] Obteniendo productos, sucursalId: ${sucursalId}`);
  try {
    const [rows] = await pool.query<VistaProductos[]>(
      `SELECT idProducto AS id, idProducto AS code, nombreProducto AS name, cantidad AS stock, COALESCE(stockMin, 0) AS min_stock, 
      0 AS cost_price, pvp AS sale_price, TRUE AS active 
      FROM v_productos 
      WHERE idSucursal = ?
      AND cantidad > 0
      ORDER BY nombreProducto`,
      [sucursalId],
    );
    console.log(`✅ [productos.getProductosReporte] Registros: ${rows.length}`);
    return rows;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        `❌ [productos.getProductosReporte] Error al obtener el reporte de productos: ${err.message}`,
      );
      throw new Error(
        `[productos.getProductosReporte] Error al obtener el reporte de productos: ${err.message}`,
      );
    }
    console.error(
      `❌ [productos.getProductosReporte] Error desconocido al obtener el reporte de productos: ${String(err)}`,
    );
    throw new Error(
      `[productos.getProductosReporte] Error desconocido al obtener el reporte de productos: ${String(err)}`,
    );
  }
}

export async function getProductos(sucursalId: string): Promise<ProductoRow[]> {
  console.log(`🔵 [productos.getProductos] Obteniendo productos, sucursalId: ${sucursalId}`);
  try {
    const [productos] = await pool.query<(ProductoRow & RowDataPacket)[]>(
      "SELECT * FROM v_productos WHERE idSucursal = ? AND CANTIDAD > 0",
      [sucursalId],
    );
    console.log(`✅ [productos.getProductos] Registros: ${productos.length}`);
    return productos;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`❌ [productos.getProductos] Error al obtener los productos: ${err.message}`);
      throw new Error(`[productos.getProductos] Error al obtener los productos: ${err.message}`);
    }
    console.error(
      `❌ [productos.getProductos] Error desconocido al obtener los productos: ${String(err)}`,
    );
    throw new Error(
      `[productos.getProductos] Error desconocido al obtener los productos: ${String(err)}`,
    );
  }
}

export async function getProductosBeneficio(
  beneficioId: string,
  sucursalId: string,
): Promise<ProductoBeneficioRow[]> {
  console.log(
    `🔵 [productos.getProductosBeneficio] Obteniendo productos por beneficio, beneficioId: ${beneficioId}, sucursalId: ${sucursalId}`,
  );
  try {
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
    console.log(
      `✅ [productos.getProductosBeneficio] Exito al obtener productos por beneficio: ${productosBeneficio.length}`,
    );
    return productosBeneficio;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        `❌ [productos.getProductosBeneficio] Error al obtener productos por beneficio: ${err.message}`,
      );
      throw new Error(
        `[productos.getProductosBeneficio] Error al obtener productos por beneficio: ${err.message}`,
      );
    }
    console.error(
      `❌ [productos.getProductosBeneficio] Error desconocido al obtener productos por beneficio: ${String(err)}`,
    );
    throw new Error(
      `[productos.getProductosBeneficio] Error desconocido al obtener productos por beneficio: ${String(err)}`,
    );
  }
}

export async function insertProducto(producto: ProductoInsertRow): Promise<ResultSetHeader> {
  console.log(`🔵 [productos.insertProducto] Insertando producto, id: ${producto["ID_PRODUCTO"]}`);
  try {
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
    console.log(`✅ [productos.insertProducto] Afectados: ${result.affectedRows}`);
    return result;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`❌ [productos.insertProducto] Error al insertar el producto: ${err.message}`);
      throw new Error(`[productos.insertProducto] Error al insertar el producto: ${err.message}`);
    }
    console.error(
      `❌ [productos.insertProducto] Error desconocido al insertar el producto: ${String(err)}`,
    );
    throw new Error(
      `[productos.insertProducto] Error desconocido al insertar el producto: ${String(err)}`,
    );
  }
}

export async function getProductosDetalle(): Promise<ProductoSelect[]> {
  console.log("🔵 [productos.getProductosDetalle] Obteniendo productos detalle");
  try {
    const [rows] = await pool.query<ProductoSelect[]>(
      "SELECT ID_PRODUCTO, NOMBRE_PRODUCTO, PVP, DESCRIPCION, ID_SUBCATEGORIA, ETIQUETAS, UNIDAD_MEDIDA, PESO_VOLUMEN, ID_LABORATORIO, CODIGO_BARRAS, FECHA_CADUCIDAD, ID_STOCK_MIN, ID_STOCK_MAX, ID_PROVEEDOR, FECHA_CREACION, FECHA_ACTUALIZACION, ESTADO FROM PRODUCTOS ORDER BY NOMBRE_PRODUCTO",
    );
    console.log(
      `✅ [productos.getProductosDetalle] Exito al obtener detalle de productos: ${rows.length}`,
    );
    return rows;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        `❌ [productos.getProductosDetalle] Error al obtener el detalle de productos: ${err.message}`,
      );
      throw new Error(
        `[productos.getProductosDetalle] Error al obtener el detalle de productos: ${err.message}`,
      );
    }
    console.error(
      `❌ [productos.getProductosDetalle] Error desconocido al obtener el detalle de productos: ${String(err)}`,
    );
    throw new Error(
      `[productos.getProductosDetalle] Error desconocido al obtener el detalle de productos: ${String(err)}`,
    );
  }
}

export async function updateProducto(
  id: string,
  producto: Partial<ProductoInsertRow>,
): Promise<number> {
  console.log(`🔵 [productos.updateProducto] Actualizando producto, id: ${id}`);
  try {
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
    console.log(
      `✅ [productos.updateProducto] Producto actualizado - Afectados: ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        `❌ [productos.updateProducto] Error al actualizar el producto: ${err.message}`,
      );
      throw new Error(`[productos.updateProducto] Error al actualizar el producto: ${err.message}`);
    }
    console.error(
      `❌ [productos.updateProducto] Error desconocido al actualizar el producto: ${String(err)}`,
    );
    throw new Error(
      `[productos.updateProducto] Error desconocido al actualizar el producto: ${String(err)}`,
    );
  }
}

export async function deleteProducto(id: string): Promise<number> {
  console.log(`🔵 [productos.deleteProducto] Eliminando producto, id: ${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM PRODUCTOS WHERE ID_PRODUCTO = ?",
      [id],
    );
    console.log(
      `✅ [productos.deleteProducto] Exito eliminando producto - Afectados: ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`❌ [productos.deleteProducto] Error al eliminar el producto: ${err.message}`);
      throw new Error(`[productos.deleteProducto] Error al eliminar el producto: ${err.message}`);
    }
    console.error(
      `❌ [productos.deleteProducto] Error desconocido al eliminar el producto: ${String(err)}`,
    );
    throw new Error(
      `[productos.deleteProducto] Error desconocido al eliminar el producto: ${String(err)}`,
    );
  }
}
