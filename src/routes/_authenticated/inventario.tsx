import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Search, Bot } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/hooks/use-session";
import { fechaHora, money } from "@/lib/format";
import { getProductosFn } from "@/server-functions/fnproductos";
import { getCategoriasFn } from "@/server-functions/fnGetCategorias";
import { getKardexFn } from "@/server-functions/fnGetKardex";
import { insertProductoFn } from "@/server-functions/fnInsertProducto";
import { ajustarInventarioFn } from "@/server-functions/fnAjustarInventario";
import { getSubcategoriasFn } from "@/server-functions/fnGetSubcategorias";
import { consultarGemini, consultarGeminiTest } from "@/server-functions/fngemini";
import { ProductoInsertRow } from "@/types/mysqltypes";

export const Route = createFileRoute("/_authenticated/inventario")({
  head: () => ({
    meta: [
      { title: "Inventario y kardex — PuntoVenta" },
      {
        name: "description",
        content: "Administra productos, existencias, mínimos y movimientos de inventario.",
      },
      { property: "og:title", content: "Inventario y kardex — PuntoVenta" },
      { property: "og:description", content: "Productos, stock y kardex de movimientos." },
    ],
  }),
  component: Inventario,
});

function Inventario() {
  const qc = useQueryClient();
  const { sucursalId, can } = useSession();
  const [q, setQ] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [ajuste, setAjuste] = useState<{
    ID_PRODUCTO: string;
    NOMBRE_PRODUCTO: string;
    CANTIDAD: number;
  } | null>(null);
  const [cantidadAjuste, setCantidadAjuste] = useState(0);
  /* const [setMotivo] = useState(""); */
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<string>("");

  const consultaGemini = async () => {
    setLoading(true);
    setRespuesta("");
    try {
      const promptIALargo = `Quiero un análisis detallado del producto ${productoSeleccionado}. 
          Incluye:
          - Descripción completa
          - Beneficios principales
          - Aplicaciones prácticas
          - Forma de uso recomendada
          - Rango de edad o perfil de usuario adecuado
          - Precauciones o contraindicaciones
          - Comparación con productos similares si aplica`;
      const promptIACorto = `Dame un resumen breve con detalles, beneficios y forma de uso del producto ${productoSeleccionado}`;
      console.log(promptIACorto);
      console.log(promptIALargo);
      const data = await consultarGemini({ data: { prompt: promptIACorto } });
      setRespuesta(data.output ?? "No hubo respuesta");
    } catch (err) {
      console.error("Error en consulta:", err);
      setRespuesta("Error en la consulta");
    }
    setLoading(false);
  };

  const [form, setForm] = useState<ProductoInsertRow>({
    ID_PRODUCTO: "",
    NOMBRE_PRODUCTO: "",
    PVP: 0,
    DESCRIPCION: "",
    ID_SUBCATEGORIA: "",
    ETIQUETAS: "",
    UNIDAD_MEDIDA: "",
    PESO_VOLUMEN: null,
    ID_LABORATORIO: "",
    CODIGO_BARRAS: "",
    FECHA_CADUCIDAD: null,
    ID_STOCK_MIN: "0",
    ID_STOCK_MAX: "0",
    ID_PROVEEDOR: "",
    ESTADO: "A",
  });

  const {
    data: productos = [],
    isLoading: isLoadingProductos,
    isError: isErrorProductos,
  } = useQuery({
    queryKey: ["productos"],
    queryFn: async () => {
      const result = await getProductosFn({ data: { sucursalId: sucursalId || "" } });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const {
    data: categorias = [],
    isLoading: isLoadingCategorias,
    isError: isErrorCategorias,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const result = await getCategoriasFn();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const {
    data: subcategorias = [],
    isLoading: isLoadingSubcategorias,
    isError: isErrorSubcategorias,
  } = useQuery({
    queryKey: ["subcategorias"],
    queryFn: async () => {
      const result = await getSubcategoriasFn();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const {
    data: movimientos = [],
    isLoading: isLoadingMovimientos,
    isError: isErrorMovimientos,
  } = useQuery({
    queryKey: ["kardex"],
    queryFn: async () => {
      const result = await getKardexFn({
        data: {
          limit: 80,
          sucursalId: sucursalId || "",
        },
      });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const filtrados = (() => {
    const s = q.trim().toLowerCase();
    if (!s) return productos;
    return productos.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.code.toLowerCase().includes(s) ||
        (p.barcode ?? "").includes(s),
    );
  })();

  useEffect(() => {
    if (isErrorProductos) {
      toast.error("Error al cargar productos. Intenta nuevamente.");
    }
    if (isErrorCategorias) {
      toast.error("Error al cargar categorías. Intenta nuevamente.");
    }
    if (isErrorSubcategorias) {
      toast.error("Error al cargar subcategorías. Intenta nuevamente.");
    }
    if (isErrorMovimientos) {
      toast.error("Error al cargar movimientos. Intenta nuevamente.");
    }
  }, [isErrorProductos, isErrorCategorias, isErrorSubcategorias, isErrorMovimientos]);

  const crearProducto = useMutation({
    mutationFn: async (form: ProductoInsertRow) => {
      const result = await insertProductoFn({ data: form });
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Producto creado");
      setAbierto(false); // 🔄 cerrar modal
      setForm({
        ID_PRODUCTO: "",
        NOMBRE_PRODUCTO: "",
        PVP: 0,
        DESCRIPCION: "",
        ID_SUBCATEGORIA: "",
        ETIQUETAS: "",
        UNIDAD_MEDIDA: "",
        PESO_VOLUMEN: null,
        ID_LABORATORIO: "",
        CODIGO_BARRAS: "",
        FECHA_CADUCIDAD: null,
        ID_STOCK_MIN: "0",
        ID_STOCK_MAX: "0",
        ID_PROVEEDOR: "",
        ESTADO: "A",
      }); // 🔄 resetear formulario
      setCategoriaSeleccionada("");
      qc.invalidateQueries({ queryKey: ["productos"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const ajustar = useMutation({
    mutationFn: async () => {
      if (!ajuste) return;
      if (!sucursalId) throw new Error("No hay una sucursal seleccionada");
      const nuevo = Math.max(0, ajuste.CANTIDAD + cantidadAjuste);
      const result = await ajustarInventarioFn({
        data: {
          productId: ajuste.ID_PRODUCTO,
          nuevoStock: nuevo,
          sucursalId,
        },
      });
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Inventario ajustado");
      setAjuste(null);
      setCantidadAjuste(0);
      qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell
      title="Inventario"
      subtitle={`${productos.length} productos registrados`}
      actions={
        can("inventory.create") && (
          <Dialog open={abierto} onOpenChange={setAbierto}>
            <DialogTrigger asChild>
              <Button>Nuevo producto</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo producto</DialogTitle>
                <DialogDescription>Registra un artículo en el catálogo.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Código Producto</Label>
                  <Input
                    value={form.ID_PRODUCTO}
                    onChange={(e) => setForm({ ...form, ID_PRODUCTO: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Código de barras</Label>
                  <Input
                    value={form.CODIGO_BARRAS ?? ""}
                    onChange={(e) => setForm({ ...form, CODIGO_BARRAS: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Nombre</Label>
                  <Input
                    value={form.NOMBRE_PRODUCTO}
                    onChange={(e) => setForm({ ...form, NOMBRE_PRODUCTO: e.target.value })}
                  />
                </div>

                {/* Selector de Categoría */}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Categoría</Label>
                  <Select
                    value={categoriaSeleccionada}
                    onValueChange={(v) => {
                      setCategoriaSeleccionada(v);
                      setForm({ ...form, ID_SUBCATEGORIA: "" }); // limpiar subcategoría
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingCategorias ? (
                        <SelectItem disabled value="loading">
                          Cargando categorías…
                        </SelectItem>
                      ) : (
                        categorias.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selector de Subcategoría */}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Subcategoría</Label>
                  <Select
                    value={form.ID_SUBCATEGORIA}
                    onValueChange={(v) => setForm({ ...form, ID_SUBCATEGORIA: v })}
                    disabled={!categoriaSeleccionada}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona subcategoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingSubcategorias ? (
                        <SelectItem disabled value="loading">
                          Cargando subcategorías…
                        </SelectItem>
                      ) : (
                        subcategorias
                          .filter((sc) => sc.ID_CATEGORIA === categoriaSeleccionada)
                          .map((sc) => (
                            <SelectItem key={sc.ID_SUBCATEGORIA} value={sc.ID_SUBCATEGORIA}>
                              {sc.nombreSubcategoria}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {(
                  [
                    ["PVP", "Precio venta"],
                    ["ID_STOCK_MIN", "Stock mínimo"],
                    ["ID_STOCK_MAX", "Stock máximo"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="space-y-1.5">
                    <Label>{label}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={form[key] ?? ""}
                      onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                    />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button
                  onClick={() => crearProducto.mutate(form)}
                  disabled={!form.ID_PRODUCTO || !form.NOMBRE_PRODUCTO || crearProducto.isPending}
                >
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      }
    >
      <div className="space-y-4 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Bot className="h-6 w-6 text-white" />
          <span className="text-lg font-semibold text-white">
            Consulta de detalles de producto usando IA
          </span>
        </div>
        <Input
          className="w-1/2 bg-muted text-foreground"
          placeholder="Selecciona un producto de la tabla..."
          value={productoSeleccionado}
          readOnly
        />
        <Button
          onClick={consultaGemini}
          disabled={loading || !productoSeleccionado}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          {loading ? "Consultando..." : "Consulta IA"}
        </Button>
        {/* Área de respuesta simple */}
        <div className="p-4 border rounded min-h-[120px] max-h-[300px] overflow-auto whitespace-pre-wrap">
          {loading && "Escribiendo…"}
          {!loading && respuesta}
        </div>
      </div>

      <Tabs defaultValue="catalogo">
        <TabsList>
          <TabsTrigger value="catalogo">Catálogo</TabsTrigger>
          <TabsTrigger value="kardex">Kardex</TabsTrigger>
        </TabsList>

        <TabsContent value="catalogo" className="mt-4 space-y-4">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar producto"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-3">Código</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th className="text-center">Precio</th>
                  <th className="text-center">Stock</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingProductos && (
                  <tr>
                    <td className="p-3 text-muted-foreground" colSpan={7}>
                      Cargando…
                    </td>
                  </tr>
                )}
                {filtrados.map((p) => (
                  <tr
                    key={p.id}
                    className={`border-t border-border cursor-pointer 
                    bg-background text-foreground 
                    hover:bg-accent hover:text-accent-foreground 
                    focus:outline-none focus:ring-2 focus:ring-ring 
                    ${productoSeleccionado === p.name ? "bg-accent text-accent-foreground" : ""}`}
                    onClick={() => setProductoSeleccionado(p.name)}
                  >
                    <td className="p-3 font-mono text-xs">{p.code}</td>
                    <td className="font-medium">
                      {p.name.length > 50 ? p.name.slice(0, 50) + "…" : p.name}
                    </td>
                    <td className="text-muted-foreground">{p.category ?? "—"}</td>
                    <td className="text-center">{money(Number(p.sale_price))}</td>
                    <td className="text-center">
                      <Badge
                        variant={
                          Number(p.stock) <= Number(p.min_stock) ? "destructive" : "secondary"
                        }
                      >
                        {Number(p.stock)} / {Number(p.max_stock)}
                      </Badge>
                    </td>
                    <td className="p-2 text-center">
                      {can("inventario.ajustarstock") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setAjuste({
                              ID_PRODUCTO: p.id,
                              NOMBRE_PRODUCTO: p.name,
                              CANTIDAD: Number(p.stock),
                            })
                          }
                        >
                          Ajustar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="kardex" className="mt-4">
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm table-fixed">
              <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-3 w-[140px]">Fecha</th>
                  <th className="w-[200px]">Producto</th>
                  <th className="w-[100px]">Código</th>
                  <th className="w-[150px]">Categoría</th>
                  <th className="text-center w-[100px]">Cantidad</th>
                  <th className="text-center w-[120px]">Precio</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingMovimientos && (
                  <tr>
                    <td className="p-3 text-muted-foreground" colSpan={6}>
                      Cargando…
                    </td>
                  </tr>
                )}
                {movimientos.map((m) => (
                  <tr key={m.id} className="border-t border-border">
                    <td className="p-3 text-muted-foreground">
                      {fechaHora(m.fecha.toISOString())}
                    </td>
                    <td className="font-medium truncate">{m.producto}</td>
                    <td className="font-mono text-xs">{m.codigo}</td>
                    <td className="text-muted-foreground truncate">{m.categoria}</td>
                    <td className="text-center">{m.cantidad}</td>
                    <td className="text-center">{money(Number(m.precio))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!ajuste} onOpenChange={(o) => !o && setAjuste(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajustar inventario</DialogTitle>
            <DialogDescription>
              {ajuste?.NOMBRE_PRODUCTO} · stock actual {ajuste?.CANTIDAD}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Cantidad (+ entrada / − salida)</Label>
              <Input
                type="number"
                value={cantidadAjuste}
                onChange={(e) => setCantidadAjuste(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => ajustar.mutate()}
              disabled={!cantidadAjuste || ajustar.isPending}
            >
              Aplicar ajuste
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
