// Tipado genérico para datos de configuración de la empresa
export interface EmpresaConfig {
  id?: string; // opcional, por si en el futuro se agrega persistencia
  name: string;
  tax_id: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string;
}

// Tipado genérico para parámetros del sistema (system_settings)
export interface SystemSetting {
  key: string;
  value: string;
  description?: string;
}

// Tipado genérico para unidades de medida
export interface UnidadMedida {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

// Valores por defecto de la empresa
export const defaultEmpresaConfig: EmpresaConfig = {
  name: "Naturista del Sur",
  tax_id: "IVA",
  address: "Matriz Redondel Atahualpa SN",
  phone: "593978854589",
  email: "naturistadelsur@gmail.com",
  logo_url: "https://www.facebook.com/comisariatonaturista/",
};

// Valores por defecto de ajustes del sistema
export const defaultSystemSettings: SystemSetting[] = [
  { key: "theme", value: "dark", description: "Tema visual de la aplicación" },
  { key: "currency", value: "USD", description: "Moneda por defecto" },
  { key: "language", value: "es", description: "Idioma por defecto" },
];

// Valores por defecto de unidades de medida comunes en productos naturistas
export const defaultUnidadesMedida: UnidadMedida[] = [
  { codigo: "ML", nombre: "Mililitros", descripcion: "Volumen líquido", activo: true },
  { codigo: "L", nombre: "Litros", descripcion: "Volumen líquido mayor", activo: true },
  { codigo: "GR", nombre: "Gramos", descripcion: "Peso sólido", activo: true },
  { codigo: "KG", nombre: "Kilogramos", descripcion: "Peso sólido mayor", activo: true },
  { codigo: "CAP", nombre: "Cápsulas", descripcion: "Presentación encapsulada", activo: true },
  { codigo: "TAB", nombre: "Tabletas", descripcion: "Presentación en comprimidos", activo: true },
  {
    codigo: "SOB",
    nombre: "Sobres",
    descripcion: "Presentación en polvo individual",
    activo: true,
  },
  { codigo: "FR", nombre: "Frascos", descripcion: "Envase líquido o sólido", activo: true },
  { codigo: "BOT", nombre: "Botellas", descripcion: "Envase líquido", activo: true },
  { codigo: "UN", nombre: "Unidad", descripcion: "Producto individual", activo: true },
];
