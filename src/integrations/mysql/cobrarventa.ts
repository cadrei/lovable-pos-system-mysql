import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";

export async function insertarPago(
  idFormaPago: string,
  monto: number,
  referencia?: string,
): Promise<number> {
  console.log("🔵 [DB] Insertando Pago...");
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO PAGO (ID_FORMA_PAGO, MONEDA, MONTO, REFERENCIA, ESTADO)
     VALUES (?, 'USD', ?, ?, 'C')`,
    [idFormaPago, monto, referencia ?? null],
  );
  console.log(`✅ [DB] Pago Insertada: ${result.insertId}`);
  return result.insertId;
}

export async function insertarVenta(
  idSucursal: string,
  idCliente: number,
  idEmpleado: number,
  idPago: number,
  idTipoImpuesto: string,
  subtotal: number,
  valorImpuesto: number,
  descuento: number,
  total: number,
): Promise<number> {
  console.log("🔵 [DB] Insertando Venta...");
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO VENTA 
      (ID_SUCURSAL, ID_CLIENTE, ID_EMPLEADO, ID_PAGO, ID_TIPO_IMPUESTO, SUBTOTAL, VALOR_IMPUESTO, DESCUENTO, TOTAL, ESTADO)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'C')`,
    [
      idSucursal,
      idCliente,
      idEmpleado,
      idPago,
      idTipoImpuesto,
      subtotal,
      valorImpuesto,
      descuento,
      total,
    ],
  );
  console.log(`✅ [DB] Venta Insertada: ${result.insertId}`);
  return result.insertId;
}

export async function insertarDetalleVenta(
  idVenta: number,
  idProducto: string,
  precioUnitario: number,
  cantidad: number,
  descuento: number,
): Promise<number> {
  console.log("🔵 [DB] Insertando Productos en Detalle de Venta...");
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO DETALLE_VENTA (ID_VENTA, ID_PRODUCTO, PRECIO_UNITARIO, CANTIDAD, DESCUENTO)
     VALUES (?, ?, ?, ?, ?)`,
    [idVenta, idProducto, precioUnitario, cantidad, descuento],
  );
  console.log(`✅ [DB] Detalle de Venta Insertada: ${result.insertId}`);
  return result.insertId;
}

export async function insertarMovimientoCaja(
  sesionCajaId: string,
  tipo: string,
  monto: number,
  concepto: string,
  referencia: string,
  idEmpleado: number,
) {
  console.log("🔵 [DB] Insertando Movimiento de Caja...");
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO CASH_MOVEMENTS (cash_session_id, type, amount, concept, reference, user_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [sesionCajaId, tipo, monto, concepto, referencia, idEmpleado],
  );
  console.log(`✅ [DB] Detalle de Venta Insertada: ${result.insertId}`);
  return result.insertId;
}
