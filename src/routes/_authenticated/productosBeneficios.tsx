import { createFileRoute, FileRoutesByPath } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getBeneficiosFn } from "@/server-functions/fnbeneficios";
import { getProdBenefFn } from "@/server-functions/fnproductosBeneficios";
import { sucursalesFn } from "@/server-functions/fnsucursales";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/AppShell";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { BeneficioRow, ProductoBeneficioRow, SucursalRow } from "@/types/mysqltypes";

export const Route = createFileRoute("/_authenticated/productosBeneficios")({
  head: () => ({
    meta: [
      { title: "Busqueda de Productos" },
      {
        name: "description",
        content: "Busqueda de Productos por Sintomas Beneficios.",
      },
      { property: "og:title", content: "Busqueda de Productos" },
      { property: "og:description", content: "Busqueda de Productos por Sintomas Beneficios." },
    ],
  }),
  component: PRODBENEF,
});

function PRODBENEF() {
  const [selectedBeneficio, setSelectedBeneficio] = useState("");
  const [selectedSucursal, setSelectedSucursal] = useState("");
  const [searchProducto, setSearchProducto] = useState("");

  // Query para beneficios
  const {
    data: beneficios = [],
    isLoading: isLoadingBeneficios,
    isError: isErrorBeneficios,
  } = useQuery({
    queryKey: ["beneficios"],
    queryFn: async () => {
      const result = await getBeneficiosFn();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  // Query para Sucursales
  const {
    data: sucursales = [],
    isLoading: isLoadingSucursales,
    isError: isErrorSucursales,
  } = useQuery({
    queryKey: ["sucursales"],
    queryFn: async () => {
      const result = await sucursalesFn();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  // Query para productos según beneficio y sucursal
  const {
    data: productos = [],
    isLoading: isLoadingProductos,
    isError: isErrorProductos,
  } = useQuery({
    queryKey: ["productos-beneficio", selectedBeneficio, selectedSucursal],
    queryFn: async () => {
      if (!selectedBeneficio && !selectedSucursal) return [];
      const result = await getProdBenefFn({
        data: { beneficioId: selectedBeneficio, sucursalId: selectedSucursal },
      });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!selectedBeneficio || !!selectedSucursal, // solo ejecuta si hay beneficio seleccionado
  });

  const productosFiltrados = productos.filter((p) =>
    p.producto.toLowerCase().includes(searchProducto.toLowerCase()),
  );

  return (
    <AppShell
      title="Búsqueda de Productos por Síntoma-Beneficio"
      subtitle="Escoge el síntoma o beneficio"
    >
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Consulta de Productos por Beneficio</h1>

        {/* Combobox de beneficios */}
        <div className="space-y-1.5 mb-4">
          <Label>Beneficio / Síntoma</Label>
          <Command>
            <CommandInput placeholder="Buscar beneficio..." />
            <CommandList>
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              <CommandGroup>
                {beneficios.map((b: BeneficioRow) => (
                  <CommandItem
                    key={b.idBeneficio}
                    value={b.nombreBeneficio} // 👈 importante: usar el texto como value
                    onSelect={() => setSelectedBeneficio(b.idBeneficio)}
                  >
                    {b.nombreBeneficio}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>

        {/* Select de sucursales */}
        <div className="space-y-1.5 mb-4">
          <Label>Sucursal</Label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={selectedSucursal}
            onChange={(e) => setSelectedSucursal(e.target.value)}
          >
            <option value="">Seleccione una sucursal</option>
            <option value="ALL">TODAS</option> {/* 👈 opción especial */}
            {sucursales.map((s: SucursalRow) => (
              <option key={s.ID_SUCURSAL} value={s.ID_SUCURSAL}>
                {s.NOMBRE_SUCURSAL}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por nombre de producto */}
        <div className="space-y-1.5 mb-4">
          <Label>Producto</Label>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchProducto}
            onChange={(e) => setSearchProducto(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Tabla de productos */}
        <div className="mt-4 overflow-x-auto">
          {isLoadingProductos && <p>Consultando productos…</p>}
          {!isLoadingProductos && (
            <>
              {/* Productos filtrados por nombre */}
              {(() => {
                const productosFiltrados = productos.filter((p) =>
                  p.producto.toLowerCase().includes(searchProducto.toLowerCase()),
                );
                if (productos.length === 0 && (selectedBeneficio || selectedSucursal)) {
                  return <p>No hay productos disponibles para este beneficio/sucursal</p>;
                }
                if (productosFiltrados.length === 0 && (selectedBeneficio || selectedSucursal)) {
                  return <p>No hay productos disponibles con ese filtro de nombre</p>;
                }
                return (
                  <>
                    {/* Contador dinámico */}
                    <p className="mb-2 text-sm text-muted-foreground">
                      Se encontraron {productosFiltrados.length} productos
                    </p>
                    <table className="w-full text-sm">
                      <thead className="text-left text-xs uppercase text-muted-foreground">
                        <tr>
                          <th className="py-2">Producto</th>
                          <th>Sucursal</th>
                          <th>Precio</th>
                          <th>Cantidad</th>
                          <th>Unidad</th>
                          <th>Peso/Volumen</th>
                          <th>Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productosFiltrados.map((p: ProductoBeneficioRow, idx: number) => (
                          <tr key={idx} className="border-t border-border">
                            <td className="py-2">{p.producto}</td>
                            <td>{p.sucursal}</td>
                            <td>{p.precio}</td>
                            <td>{p.cantidad}</td>
                            <td>{p.unidad_medida}</td>
                            <td>{p.peso_volumen}</td>
                            <td>{p.descripcion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                );
              })()}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
