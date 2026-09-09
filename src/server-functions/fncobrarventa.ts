import { createServerFn } from "@tanstack/react-start";
import pool from "../../database/mysqlpool";
import {
  insertarPago,
  insertarVenta,
  insertarDetalleVenta,
  insertarMovimientoCaja,
} from "../integrations/mysql/cobrarventa";
import { getNextDocumentNumber } from "../integrations/mysql/caja";

export const cobrarVentaFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      idSucursal: string;
      idCliente: number;
      idEmpleado: number;
      metodo: string;
      referencia?: string;
      idTipoImpuesto: string;
      subtotal: number;
      valorImpuesto: number;
      descuento: number;
      total: number;
      costTotal: number;
      carrito: {
        idProducto: string;
        nombre: string;
        precio: number;
        costo: number;
        cantidad: number;
        stock: number;
      }[];
      sesionCajaId?: string;
      cajero: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Pago
      const idPago = await insertarPago(data.metodo, data.total, data.referencia);

      // 2. Venta
      const idVenta = await insertarVenta(
        data.idSucursal,
        data.idCliente,
        data.idEmpleado,
        idPago,
        data.idTipoImpuesto,
        data.subtotal,
        data.valorImpuesto,
        data.descuento,
        data.total,
      );

      // 3. Detalles Venta
      for (const l of data.carrito) {
        await insertarDetalleVenta(idVenta, l.idProducto, l.precio, l.cantidad, 0);
        const nuevoStock = Math.max(0, l.stock - l.cantidad);
      }

      // 4. Movimiento de caja (solo efectivo)
      if (data.sesionCajaId && data.metodo === "efectivo") {
        await insertarMovimientoCaja(
          data.sesionCajaId,
          "venta",
          data.total,
          "Venta en efectivo",
          String(idVenta),
          data.idEmpleado,
        );
      }

      await conn.commit();
      return { success: true, data: { idVenta } };
    } catch (error) {
      await conn.rollback();
      console.error("❌ Error cobrando venta:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    } finally {
      conn.release();
    }
  });
