import { createServerFn } from "@tanstack/react-start";
import { getCategorias } from "../integrations/mysql/categorias";
import { insertCategoria } from "../integrations/mysql/categorias";
import { getMarcas } from "../integrations/mysql/marcas";
import { insertMarca } from "../integrations/mysql/marcas";
import { getImpuestos } from "../integrations/mysql/impuestos";
import { insertImpuesto } from "../integrations/mysql/impuestos";
import { getSucursalesDetalle } from "../integrations/mysql/sucursales";
import { insertSucursal } from "../integrations/mysql/sucursales";
import { updateSucursal } from "../integrations/mysql/sucursales";
import { getCashRegisters } from "../integrations/mysql/cashRegisters";
import { updateCashRegister } from "../integrations/mysql/cashRegisters";
import { CategoriaInsert, ImpuestoInsert, MarcaInsert, SucursalInsert } from "../types/mysqltypes";

/** Genera un ID corto único para PKs VARCHAR(10) */
function generarId(prefijo: string): string {
  return `${prefijo}-${Date.now().toString().slice(-7)}`;
}

// ============================================================
// CATÁLOGOS (categorías, marcas, impuestos)
// ============================================================

export const fnCfgCategoriasGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data = await getCategorias();
    const categorias = data.map((c) => ({
      id: c.ID_CATEGORIA,
      name: c.NOMBRE_CATEGORIA,
      active: c.ESTADO === "A",
    }));
    return { success: true, data: categorias };
  } catch (error) {
    console.error("❌ [fnCfgCategoriasGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnCfgCategoriaInsert = createServerFn({ method: "POST" })
  .validator((data: { name: string }) => data)
  .handler(async ({ data }) => {
    try {
      const payload: CategoriaInsert = {
        ID_CATEGORIA: generarId("CAT"),
        NOMBRE_CATEGORIA: data.name,
        ESTADO: "A",
      };
      const result = await insertCategoria(payload);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnCfgCategoriaInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnCfgMarcasGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data = await getMarcas();
    const marcas = data.map((m) => ({
      id: m.ID_MARCA,
      name: m.NOMBRE,
      active: m.ESTADO === "A",
    }));
    return { success: true, data: marcas };
  } catch (error) {
    console.error("❌ [fnCfgMarcasGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnCfgMarcaInsert = createServerFn({ method: "POST" })
  .validator((data: { name: string }) => data)
  .handler(async ({ data }) => {
    try {
      const payload: MarcaInsert = { NOMBRE: data.name, ESTADO: "A" };
      const result = await insertMarca(payload);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnCfgMarcaInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnCfgImpuestosGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data = await getImpuestos();
    const impuestos = data.map((i) => ({
      id: i.ID_TIPO_IMPUESTO,
      name: i.NOMBRE_TIPO_IMPUESTO,
      rate: Number(i.VALOR_IMPUESTO),
    }));
    return { success: true, data: impuestos };
  } catch (error) {
    console.error("❌ [fnCfgImpuestosGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnCfgImpuestoInsert = createServerFn({ method: "POST" })
  .validator((data: { name: string; rate: number }) => data)
  .handler(async ({ data }) => {
    try {
      const payload: ImpuestoInsert = {
        ID_TIPO_IMPUESTO: generarId("IMP"),
        NOMBRE_TIPO_IMPUESTO: data.name,
        VALOR_IMPUESTO: data.rate,
      };
      const result = await insertImpuesto(payload);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnCfgImpuestoInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

// ============================================================
// SUCURSALES
// ============================================================

export const fnCfgSucursalesGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data = await getSucursalesDetalle();
    const sucursales = data.map((s) => ({
      id: s.ID_SUCURSAL,
      code: s.ID_SUCURSAL,
      name: s.NOMBRE_SUCURSAL,
      address: s.DIRECCION_SUCURSAL,
      phone: s.TELEFONO ?? "",
      active: s.ESTADO === "A",
    }));
    return { success: true, data: sucursales };
  } catch (error) {
    console.error("❌ [fnconfiguracion.fnCfgSucursalesGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnCfgSucursalInsert = createServerFn({ method: "POST" })
  .validator((data: { code: string; name: string; address: string; phone: string }) => data)
  .handler(async ({ data }) => {
    try {
      const payload: SucursalInsert = {
        ID_SUCURSAL: data.code,
        NOMBRE_SUCURSAL: data.name,
        DIRECCION_SUCURSAL: data.address,
        TELEFONO: data.phone,
        RUC_SUCURSAL: "",
        ESTADO: "A",
      };
      const result = await insertSucursal(payload);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnCfgSucursalInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnCfgSucursalToggle = createServerFn({ method: "POST" })
  .validator((data: { id: string; active: boolean }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateSucursal(data.id, { ESTADO: data.active ? "A" : "I" });
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnCfgSucursalToggle] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

// ============================================================
// CAJAS
// ============================================================

export const fnCfgCajasGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data = await getCashRegisters();
    const cajas = data.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      branch_id: c.branch_id,
      active: c.active,
    }));
    return { success: true, data: cajas };
  } catch (error) {
    console.error("❌ [fnCfgCajasGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnCfgCajaToggle = createServerFn({ method: "POST" })
  .validator((data: { id: string; active: boolean }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateCashRegister(data.id, { active: data.active });
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnCfgCajaToggle] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
