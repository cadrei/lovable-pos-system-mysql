import { createServerFn } from "@tanstack/react-start";
import { getKardex } from "../integrations/mysql/kardex";
import { KardexRow } from "../types/mysqltypes";

export const getKardexFn = createServerFn({ method: "POST" }) // ✅ cambiamos a POST para enviar sucursalId
  .validator((data: { limit?: number; sucursalId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const kardexData: KardexRow[] = await getKardex(data.limit ?? 80, data.sucursalId);
      const movimientos = kardexData.map((m) => ({
        id: m.idVenta,
        fecha: m.fechaHora,
        producto: m.nombreProducto,
        codigo: m.idProducto,
        categoria: m.nombreCategoria,
        cantidad: m.cantidad,
        precio: m.precioProducto,
        tipo: "SALIDA", // siempre venta
        cliente: m.cliente,
      }));

      return { success: true, data: movimientos };
    } catch (error) {
      console.error("❌ [fnGetKardex] Error en kardex:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
