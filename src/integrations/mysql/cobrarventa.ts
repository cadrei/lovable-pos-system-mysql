import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";

export async function insertarPago(
  idFormaPago: string,
  monto: number,
  referencia?: string,
): Promise<number> {
  console.log(
    `🔵 [cobrarventa.insertarPago] Insertando pago con: idFormaPago=${idFormaPago}, monto=${monto}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO PAGO (ID_FORMA_PAGO, MONEDA, MONTO, REFERENCIA, ESTADO)
       VALUES (?, 'USD', ?, ?, 'C')`,
      [idFormaPago, monto, referencia ?? null],
    );
    console.log(`✅ [cobrarventa.insertarPago] Éxito insertando pago: insertId=${result.insertId}`);
    return result.insertId;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [cobrarventa.insertarPago] Error insertando pago: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
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
  console.log(
    `🔵 [cobrarventa.insertarVenta] insertando venta con: sucursal=${idSucursal}, cliente=${idCliente}, empleado=${idEmpleado}, total=${total}`,
  );
  try {
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
    console.log(
      `✅ [cobrarventa.insertarVenta] Éxito insertando venta: insertId=${result.insertId}`,
    );
    return result.insertId;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [cobrarventa.insertarVenta] Error insertando venta: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertarDetalleVenta(
  idVenta: number,
  idProducto: string,
  precioUnitario: number,
  cantidad: number,
  descuento: number,
): Promise<number> {
  console.log(
    `🔵 [cobrarventa.insertarDetalleVenta] Insertando detalle venta con : venta=${idVenta}, producto=${idProducto}, cantidad=${cantidad}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO DETALLE_VENTA (ID_VENTA, ID_PRODUCTO, PRECIO_UNITARIO, CANTIDAD, DESCUENTO)
       VALUES (?, ?, ?, ?, ?)`,
      [idVenta, idProducto, precioUnitario, cantidad, descuento],
    );
    console.log(
      `✅ [cobrarventa.insertarDetalleVenta] Éxito insertando detalle venta: insertId=${result.insertId}`,
    );
    return result.insertId;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [cobrarventa.insertarDetalleVenta] Error ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertarMovimientoCaja(
  sesionCajaId: string,
  tipo: string,
  monto: number,
  concepto: string,
  referencia: string,
  idEmpleado: number,
): Promise<number> {
  console.log(
    `🔵 [cobrarventa.insertarMovimientoCaja] Insertando movimiento de caja con: sesion=${sesionCajaId}, tipo=${tipo}, monto=${monto}, empleado=${idEmpleado}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO CASH_MOVEMENTS (cash_session_id, type, amount, concept, reference, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sesionCajaId, tipo, monto, concepto, referencia, idEmpleado],
    );
    console.log(
      `✅ [cobrarventa.insertarMovimientoCaja] Éxito insertando movimiento de caja: insertId=${result.insertId}`,
    );
    return result.insertId;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [cobrarventa.insertarMovimientoCaja] Error insertando movimiento de caja ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
