import { createServerFn } from "@tanstack/react-start";
import { getImagenesPorProducto } from "../integrations/mysql/imagenes";
import { ImagenesProductoRow } from "@/types/mysqltypes";

export const getImagenesPorProductoFn = createServerFn({ method: "POST" })
  .validator((data: { idProducto: string }) => data)
  .handler(async ({ data }) => {
    console.log(
      `🔵 [fnimagenes.getImagenesPorProductoFn] Invocando imágenes para producto: idProducto=${data.idProducto}`,
    );
    try {
      const imagenes: ImagenesProductoRow[] = await getImagenesPorProducto(data.idProducto);
      const result = imagenes.map((img) => ({
        id: img.idImagen,
        productId: img.idProducto,
        url: img.urlImagen,
        description: img.descripcion,
        order: Number(img.orden),
      }));
      console.log(
        `✅ [fnimagenes.getImagenesPorProductoFn] Éxito al obtener imágenes: ${result.length} registros`,
      );
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnimagenes.getImagenesPorProductoFn] Error en imágenes:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
