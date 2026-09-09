import type { RowDataPacket } from "mysql2";

// Productos
export interface ProductoRow extends RowDataPacket {
  idProducto: string;
  idSucursal: string;
  nombreSucursal: string;
  nombreProducto: string;
  pvp: number;
  descripcion: string;
  idSubcategoria: string;
  categoria: string;
  subcategoria: string;
  etiquetas: string;
  unidadMedida: string;
  pesoVolumen: number;
  idStockMinimo: string;
  stockMin: number;
  idStockMax: string;
  stockMaximo: number;
  cantidad: number;
}

//Productos Beneficios
export interface ProductoBeneficioRow extends RowDataPacket {
  producto: string;
  sucursal: string;
  precio: number;
  cantidad: number;
  unidad_medida: string;
  peso_volumen: string;
  descripcion: string;
}

export interface BeneficioRow extends RowDataPacket {
  idBeneficio: string;
  nombreBeneficio: string;
  descBeneficio: string;
  estado: string;
}

export type ProductoInsertRow = {
  ID_PRODUCTO: string;
  NOMBRE_PRODUCTO: string;
  PVP: number;
  DESCRIPCION?: string | null;
  ID_SUBCATEGORIA: string;
  ETIQUETAS?: string | null;
  UNIDAD_MEDIDA?: string | null;
  PESO_VOLUMEN?: number | null;
  ID_LABORATORIO?: string | null;
  CODIGO_BARRAS?: string | null;
  FECHA_CADUCIDAD?: Date | null;
  ID_STOCK_MIN?: string | null;
  ID_STOCK_MAX?: string | null;
  ID_PROVEEDOR?: string | null;
  ESTADO?: "A" | "I" | "S" | "P" | "E" | "O" | "R" | "T";
};

export interface ProductoPOS {
  id: string;
  code: string;
  barcode?: string;
  name: string;
  sale_price: number;
  cost_price?: number;
  stock: number;
}

// Ventas
export interface VentaDetalleRow extends RowDataPacket {
  idVenta: number;
  fechaHora: Date;
  subtotal: number;
  descuento: number;
  impuesto: number;
  valorImpuesto: number;
  total: number;
  cliente: string;
  empleado: string;
  idSucursal: string;
  sucursal: string;
  formaPago: string;
  referenciaPago: string;
  montoPago: number;
  estadoPago: string;
  idProducto: string;
  nombreProducto: string;
  precioProducto: number;
  nombreCategoria: string;
}

export interface VentaRow extends RowDataPacket {
  idVenta: number;
  fechaHora: Date;
  subtotal: number;
  descuento: number;
  impuesto: number;
  valorImpuesto: number;
  total: number;
  cliente: string;
  empleado: string;
  idSucursal: string;
  sucursal: string;
  formaPago: string;
  referenciaPago: string;
  montoPago: number;
  estadoPago: string;
}

//Sucursales
export interface SucursalRow extends RowDataPacket {
  ID_SUCURSAL: string;
  NOMBRE_SUCURSAL: string;
}

// Clientes
export interface ClienteRow extends RowDataPacket {
  ID_CLIENTE: number;
  ID_DOCUMENTO: string;
  TIPO_DOCUMENTO: string;
  NOMBRES: string;
  EMAIL: string;
  TELEFONO: string;
  DIRECCION: string;
}

//Factura - Pendiente terminar la definicion de acuerdo al esquema
export interface FacturaRow extends RowDataPacket {
  idFactura: number;
  estado: string;
}

//Flujo de Caja
export interface CashRegisterRow extends RowDataPacket {
  id: string;
  branch_id: string;
  code: string;
  name: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CashSessionRow extends RowDataPacket {
  id: string;
  cash_register_id: string;
  user_id: string;
  user_name: string;
  opened_at: Date;
  opening_amount: number;
  closed_at?: Date;
  expected_amount?: number;
  declared_amount?: number;
  difference?: number;
  status: "abierta" | "cerrada";
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CashMovementRow extends RowDataPacket {
  id: string;
  cash_session_id: string;
  type: "venta" | "ingreso" | "egreso" | "retiro" | "devolucion" | "apertura";
  amount: number;
  concept: string;
  reference?: string;
  user_id: string;
  created_at: Date;
}

//Categorias
export type CategoriaRow = {
  ID_CATEGORIA: string;
  NOMBRE_CATEGORIA: string;
  DESCRIPCION?: string | null;
  ESTADO: "A" | "I" | "S" | "P" | "E" | "O" | "R" | "T";
  FECHA_CREACION: Date;
  FECHA_ACTUALIZACION: Date;
};

//Subcategorias
export type SubcategoriaRow = {
  ID_SUBCATEGORIA: string;
  nombreSubcategoria: string;
  DESCRIPCION?: string | null;
  ID_CATEGORIA: string;
  NOMBRE_CATEGORIA: string;
};

//Kardex
export type KardexRow = {
  idVenta: string;
  fechaHora: Date;
  idProducto: string;
  nombreProducto: string;
  precioProducto: number;
  nombreCategoria: string;
  cliente: string;
  cantidad: number;
};
