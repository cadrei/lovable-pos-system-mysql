import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useSession } from "@/hooks/use-session";
import React, { useState } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { getProductosVistaFn } from "@/server-functions/fnproductosvista";
import { getImagenesPorProductoFn } from "@/server-functions/fnimagenesProducto";
import { VistaProductoRow } from "@/types/mysqltypes";
import { Image, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/galeria")({
  head: () => ({
    meta: [
      { title: "Galería de Productos — PuntoVenta" },
      { name: "description", content: "Página ecommerce con galería de productos." },
      { property: "og:title", content: "Galería de Productos — PuntoVenta" },
      {
        property: "og:description",
        content: "Visualización de productos con imágenes y detalles.",
      },
    ],
  }),
  component: Galeria,
});

type ImagenProducto = NonNullable<
  Awaited<ReturnType<typeof getImagenesPorProductoFn>>["data"]
>[number];

function ProductoCard({
  producto,
  imagenesData,
  onOpenModal,
}: {
  producto: VistaProductoRow;
  imagenesData: ImagenProducto[];
  onOpenModal: (img: ImagenProducto) => void;
}) {
  const [imagenPrincipal, setImagenPrincipal] = useState(imagenesData[0]);

  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col">
      <div className="flex flex-col items-center">
        {imagenPrincipal ? (
          <img
            src={`/images/${imagenPrincipal.url}`}
            alt={imagenPrincipal.description ?? producto.nombreProducto}
            className="w-full h-64 object-contain mb-2 transition-opacity duration-300 ease-in-out hover:scale-105 cursor-pointer"
            onClick={() => onOpenModal(imagenPrincipal)} // 🔹 abre modal
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100">
            <Image className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* 🔹 Miniaturas */}
        <div className="flex gap-2 overflow-x-auto">
          {imagenesData.map((img) => (
            <img
              key={img.id}
              src={`/images/${img.url}`}
              alt={img.description ?? ""}
              loading="lazy" // 🔹 Lazy loading
              className={`w-16 h-16 object-contain border rounded cursor-pointer ${
                img.id === imagenPrincipal?.id ? "border-blue-500" : ""
              }`}
              onClick={() => setImagenPrincipal(img)}
            />
          ))}
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-4">{producto.nombreProducto}</h3>
      <p className="text-sm text-gray-600">{producto.descripcion}</p>
      <p className="text-primary font-bold mt-2">Precio: ${producto.pvp}</p>
      <p className="text-xs text-gray-500">
        {producto.categoria} / {producto.subcategoria}
      </p>
      <p className="text-xs text-gray-500">Etiquetas: {producto.etiquetas}</p>
      <p className="text-xs text-gray-500">Stock: {producto.cantidad}</p>
    </div>
  );
}

function Galeria() {
  const { sucursalId } = useSession();

  // 🔹 Productos
  const { data: productosData = [], isLoading: loadingProductos } = useQuery<VistaProductoRow[]>({
    queryKey: ["productosVista", sucursalId],
    queryFn: async () => {
      const res = await getProductosVistaFn({ data: { idSucursal: sucursalId! } });
      if (!res.success) throw new Error(res.error);
      return res.data ?? [];
    },
    enabled: !!sucursalId,
  });

  // 🔹 Paginación
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProductos = productosData.slice(startIndex, endIndex);

  // 🔹 Imágenes de productos
  const imagenesQueries = useQueries({
    queries: paginatedProductos.map((producto) => ({
      queryKey: ["imagenesProducto", producto.idProducto],
      queryFn: async () => {
        const res = await getImagenesPorProductoFn({ data: { idProducto: producto.idProducto } });
        if (!res.success) throw new Error(res.error);
        return res.data ?? [];
      },
    })),
  });

  // 🔹 Estado global para modal/lightbox
  const [modalImg, setModalImg] = useState<ImagenProducto | null>(null);

  return (
    <AppShell title="Galería" subtitle="Galería de Productos">
      {loadingProductos ? (
        <p>Cargando productos...</p>
      ) : productosData.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paginatedProductos.map((producto, idx) => {
              const imagenesData = imagenesQueries[idx]?.data ?? [];
              if (imagenesData.length === 0) return null;
              return (
                <ProductoCard
                  key={producto.idProducto}
                  producto={producto}
                  imagenesData={imagenesData}
                  onOpenModal={setModalImg}
                />
              );
            })}
          </div>

          {/* 🔹 Controles de paginación */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span>Página {page}</span>
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setPage((p) => p + 1)}
              disabled={endIndex >= productosData.length}
            >
              Siguiente
            </button>
          </div>

          {/* 🔹 Modal/lightbox */}
          {modalImg && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="relative">
                <button
                  className="absolute top-2 right-2 text-white"
                  onClick={() => setModalImg(null)}
                >
                  <X size={32} />
                </button>
                <img
                  src={`/images/${modalImg.url}`}
                  alt={modalImg.description ?? ""}
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                />
              </div>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
