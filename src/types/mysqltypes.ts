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

//Beneficios
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

// Tipos completos del esquema MySQL
export interface CategoriaSelect extends RowDataPacket {
  ID_CATEGORIA: string;
  NOMBRE_CATEGORIA: string;
  DESCRIPCION: string | null;
  ESTADO: string;
  FECHA_CREACION: Date;
  FECHA_ACTUALIZACION: Date;
}

export type CategoriaInsert = {
  ID_CATEGORIA: string;
  NOMBRE_CATEGORIA: string;
  DESCRIPCION?: string | null;
  ESTADO?: string;
};

export interface SubcategoriaSelect extends RowDataPacket {
  ID_SUBCATEGORIA: string;
  ID_CATEGORIA: string;
  NOMBRE: string;
  DESCRIPCION: string | null;
  ESTADO: string;
  FECHA_CREACION: Date;
  FECHA_ACTUALIZACION: Date;
}

export type SubcategoriaInsert = {
  ID_SUBCATEGORIA: string;
  ID_CATEGORIA: string;
  NOMBRE: string;
  DESCRIPCION?: string | null;
  ESTADO?: string;
};

export interface StockSelect extends RowDataPacket {
  ID_STOCK: string;
  TIPO_STOCK: "M" | "X";
  AMBITO: string;
  DESCRIPCION: string | null;
  CANTIDAD: number;
  ESTADO: string;
  FECHA_CREACION: Date;
  FECHA_ACTUALIZACION: Date;
}

export type StockInsert = {
  ID_STOCK: string;
  TIPO_STOCK: "M" | "X";
  AMBITO: string;
  DESCRIPCION?: string | null;
  CANTIDAD: number;
  ESTADO?: string;
};

export interface ProductoSelect extends RowDataPacket {
  ID_PRODUCTO: string;
  NOMBRE_PRODUCTO: string;
  PVP: number;
  DESCRIPCION: string | null;
  ID_SUBCATEGORIA: string;
  ETIQUETAS: string | null;
  UNIDAD_MEDIDA: string | null;
  PESO_VOLUMEN: number | null;
  ID_LABORATORIO: string | null;
  CODIGO_BARRAS: string | null;
  FECHA_CADUCIDAD: Date | null;
  ID_STOCK_MIN: string | null;
  ID_STOCK_MAX: string | null;
  ID_PROVEEDOR: string | null;
  FECHA_CREACION: Date;
  FECHA_ACTUALIZACION: Date;
  ESTADO: string;
}

export interface SucursalSelect extends RowDataPacket {
  ID_SUCURSAL: string;
  NOMBRE_SUCURSAL: string;
  DIRECCION_SUCURSAL: string;
  TELEFONO: string | null;
  EMAIL: string | null;
  RESPONSABLE: string | null;
  RUC_SUCURSAL: string;
  ESTADO: string;
  FECHA_CREACION: Date;
  FECHA_ACTUALIZACION: Date;
}

export type SucursalInsert = {
  ID_SUCURSAL: string;
  NOMBRE_SUCURSAL: string;
  DIRECCION_SUCURSAL: string;
  TELEFONO?: string | null;
  EMAIL?: string | null;
  RESPONSABLE?: string | null;
  RUC_SUCURSAL: string;
  ESTADO?: string;
};

export type ProductoInsert = ProductoInsertRow;

export type ProductoSucursalSelect = {
  ID_PRODUCTO: string;
  ID_SUCURSAL: string;
  CANTIDAD: number;
  ESTADO: string;
  FECHA_CREACION: Date;
  FECHA_ACTUALIZACION: Date;
};

export type ProductoSucursalInsert = {
  ID_PRODUCTO: string;
  ID_SUCURSAL: string;
  CANTIDAD?: number;
  ESTADO?: string;
};

export interface BeneficiosSintomasSelect extends RowDataPacket {
  ID_SINT_BENEF: string;
  NOMBRE_SINT_BENEF: string;
  DESCRIPCION_SINT_BENEF: string | null;
  ESTADO: string;
  FECHA_CREACION: Date;
  FECHA_ACTUALIZACION: Date;
}

export type BeneficiosSintomasInsert = {
  ID_SINT_BENEF: string;
  NOMBRE_SINT_BENEF: string;
  DESCRIPCION_SINT_BENEF?: string | null;
  ESTADO?: string;
};

export type ProductoBeneficioSelect = {
  ID_PRODUCTO: string;
  ID_SINT_BENEF: string;
  ESTADO: string;
  FECHA_CREACION: Date;
  FECHA_ACTUALIZACION: Date;
};

export type ProductoBeneficioInsert = {
  ID_PRODUCTO: string;
  ID_SINT_BENEF: string;
  ESTADO?: string;
};

export interface PromocionesCombosSelect extends RowDataPacket {
  ID_PROMO_COMBO: string;
  TIPO: "P" | "C";
  DESCRIPCION: string;
  CRITERIO: string | null;
  FECHA_INICIO: Date;
  FECHA_FIN: Date;
  ESTADO: string;
  USOS_MAXIMOS: number | null;
  CANAL: string | null;
  FECHA_CREACION: Date;
  FECHA_ACTUALIZACION: Date;
}

export type PromocionesCombosInsert = {
  ID_PROMO_COMBO: string;
  TIPO: "P" | "C";
  DESCRIPCION: string;
  CRITERIO?: string | null;
  FECHA_INICIO: Date;
  FECHA_FIN: Date;
  ESTADO?: string;
  USOS_MAXIMOS?: number | null;
  CANAL?: string | null;
};

export interface PromocionesDetalleSelect extends RowDataPacket {
  ID_DETALLE: number;
  ID_PROMO_COMBO: string;
  ID_PRODUCTO: string;
  TIPO_DESCUENTO: string | null;
  VALOR_DESCUENTO: number | null;
}

export type PromocionesDetalleInsert = {
  ID_PROMO_COMBO: string;
  ID_PRODUCTO: string;
  TIPO_DESCUENTO?: string | null;
  VALOR_DESCUENTO?: number | null;
};

export interface CombosDetalleSelect extends RowDataPacket {
  ID_DETALLE: number;
  ID_PROMO_COMBO: string;
  ID_PRODUCTO: string;
  CANTIDAD_PRODUCTO: number;
}

export type CombosDetalleInsert = {
  ID_PROMO_COMBO: string;
  ID_PRODUCTO: string;
  CANTIDAD_PRODUCTO?: number;
};

export interface TipoDocumentoSelect extends RowDataPacket {
  ID_TIPO_DOC: string;
  NOMBRE_TIPO_DOC: string;
  DETALLE_TIPO_DOC: string | null;
  LONGITUD_DOC: number;
  FUNCION_VALIDACION: string;
}

export type TipoDocumentoInsert = {
  ID_TIPO_DOC: string;
  NOMBRE_TIPO_DOC: string;
  DETALLE_TIPO_DOC?: string | null;
  LONGITUD_DOC: number;
  FUNCION_VALIDACION: string;
};

export interface ClienteSelect extends RowDataPacket {
  ID_CLIENTE: number;
  ID_DOCUMENTO: string;
  ID_TIPO_DOC: string;
  NOMBRES: string;
  EMAIL: string | null;
  TELEFONO: string | null;
  DIRECCION: string | null;
  ESTADO: string;
  FECHA_CREACION: Date;
  FECHA_MODIFICACION: Date;
}

export type ClienteInsert = {
  ID_DOCUMENTO: string;
  ID_TIPO_DOC: string;
  NOMBRES: string;
  EMAIL?: string | null;
  TELEFONO?: string | null;
  DIRECCION?: string | null;
  ESTADO?: string;
};

export interface EmpleadoSelect extends RowDataPacket {
  ID_EMPLEADO: number;
  ID_DOCUMENTO: string;
  ID_TIPO_DOC: string;
  ID_SUCURSAL: string;
  NOMBRES: string;
  TELEFONO: string | null;
  EMAIL: string | null;
  DIRECCION: string | null;
  CARGO: string | null;
  FECHA_CONTRATACION: Date;
  ESTADO: string;
  FECHA_CREACION: Date;
  FECHA_MODIFICACION: Date;
}

export type EmpleadoInsert = {
  ID_DOCUMENTO: string;
  ID_TIPO_DOC: string;
  ID_SUCURSAL: string;
  NOMBRES: string;
  TELEFONO?: string | null;
  EMAIL?: string | null;
  DIRECCION?: string | null;
  CARGO?: string | null;
  FECHA_CONTRATACION: Date;
  ESTADO?: string;
};

export interface FormaPagoLegalSelect extends RowDataPacket {
  ID_FPL: string;
  NOMBRE_FPL: string;
  DETALLE_FPL: string | null;
}

export type FormaPagoLegalInsert = {
  ID_FPL: string;
  NOMBRE_FPL: string;
  DETALLE_FPL?: string | null;
};

export interface FormaPagoSelect extends RowDataPacket {
  ID_FORMA_PAGO: string;
  NOMBRE_FORMA_PAGO: string;
  DETALLE_FORMA_PAGO: string | null;
  ID_FPL: string;
  ESTADO: string;
  FECHA_CREACION: Date;
  FECHA_MODIFICACION: Date;
}

export type FormaPagoInsert = {
  ID_FORMA_PAGO: string;
  NOMBRE_FORMA_PAGO: string;
  DETALLE_FORMA_PAGO?: string | null;
  ID_FPL: string;
  ESTADO?: string;
};

export interface PagoSelect extends RowDataPacket {
  ID_PAGO: number;
  ID_FORMA_PAGO: string;
  MONEDA: string;
  MONTO: number;
  FECHA_HORA: Date;
  REFERENCIA: string | null;
  ESTADO: string;
  FECHA_CREACION: Date;
  FECHA_MODIFICACION: Date;
}

export type PagoInsert = {
  ID_FORMA_PAGO: string;
  MONEDA?: string;
  MONTO: number;
  FECHA_HORA?: Date;
  REFERENCIA?: string | null;
  ESTADO?: string;
};

export interface ImpuestoSelect extends RowDataPacket {
  ID_TIPO_IMPUESTO: string;
  NOMBRE_TIPO_IMPUESTO: string;
  DETALLE_IMPUESTO: string | null;
  VALOR_IMPUESTO: number;
}

export type ImpuestoInsert = {
  ID_TIPO_IMPUESTO: string;
  NOMBRE_TIPO_IMPUESTO: string;
  DETALLE_IMPUESTO?: string | null;
  VALOR_IMPUESTO: number;
};

export interface VentaSelect extends RowDataPacket {
  ID_VENTA: number;
  ID_SUCURSAL: string;
  ID_CLIENTE: number;
  ID_EMPLEADO: number;
  ID_PAGO: number;
  ID_TIPO_IMPUESTO: string;
  FECHA_HORA: Date;
  SUBTOTAL: number;
  VALOR_IMPUESTO: number;
  DESCUENTO: number;
  TOTAL: number;
  ESTADO: string;
  FECHA_CREACION: Date;
  FECHA_MODIFICACION: Date;
}

export type VentaInsert = {
  ID_SUCURSAL: string;
  ID_CLIENTE: number;
  ID_EMPLEADO: number;
  ID_PAGO: number;
  ID_TIPO_IMPUESTO: string;
  FECHA_HORA?: Date;
  SUBTOTAL: number;
  VALOR_IMPUESTO: number;
  DESCUENTO?: number;
  TOTAL: number;
  ESTADO?: string;
};

export interface DetalleVentaSelect extends RowDataPacket {
  ID_DETALLE: number;
  ID_VENTA: number;
  ID_PRODUCTO: string;
  PRECIO_UNITARIO: number;
  CANTIDAD: number;
  DESCUENTO: number;
  SUBTOTAL: number;
  FECHA_CREACION: Date;
}

export type DetalleVentaInsert = {
  ID_VENTA: number;
  ID_PRODUCTO: string;
  PRECIO_UNITARIO?: number;
  CANTIDAD: number;
  DESCUENTO?: number;
};

export interface TransferenciaSelect extends RowDataPacket {
  ID_TRANSFERENCIA: number;
  ID_PRODUCTO: string;
  SUC_ORIGEN: string;
  SUC_DESTINO: string;
  CANTIDAD: number;
  FECHA: Date;
}

export type TransferenciaInsert = {
  ID_PRODUCTO: string;
  SUC_ORIGEN: string;
  SUC_DESTINO: string;
  CANTIDAD: number;
  FECHA?: Date;
};

export interface VentaPromocionSelect extends RowDataPacket {
  ID_VENTA: number;
  ID_PROMO_COMBO: string;
  DESCUENTO: number;
}

export type VentaPromocionInsert = {
  ID_VENTA: number;
  ID_PROMO_COMBO: string;
  DESCUENTO: number;
};

export interface FacturaSelect extends RowDataPacket {
  ID_FACTURA: number;
  ID_VENTA: number;
  NUMERO_FACTURA: string;
  NUM_AUTORIZACION: string;
  CLAVE_ACCESO: string;
  FECHA_EMISION: Date;
  ID_FORMA_PAGO: string;
  SUBTOTAL15: number;
  SUBTOTAL0: number;
  SUBTOTAL_NO_IVA: number;
  SUBTOTAL_EXENTO_IVA: number;
  SUBTOTAL_SIN_IMPUESTOS: number;
  DESCUENTO: number;
  ICE: number;
  IVA: number;
  IRBPNR: number;
  PROPINA: number;
  TOTAL: number;
  ESTADO: string;
}

export type FacturaInsert = {
  ID_VENTA: number;
  NUMERO_FACTURA: string;
  NUM_AUTORIZACION: string;
  CLAVE_ACCESO: string;
  FECHA_EMISION: Date;
  ID_FORMA_PAGO: string;
  SUBTOTAL15?: number;
  SUBTOTAL0?: number;
  SUBTOTAL_NO_IVA?: number;
  SUBTOTAL_EXENTO_IVA?: number;
  SUBTOTAL_SIN_IMPUESTOS?: number;
  DESCUENTO?: number;
  ICE?: number;
  IVA?: number;
  IRBPNR?: number;
  PROPINA?: number;
  TOTAL: number;
  ESTADO?: string;
};

export interface NotaVentaSelect extends RowDataPacket {
  ID_NOTA_VENTA: number;
  ID_VENTA: number;
  NUMERO_NOTA_VENTA: string;
  NUM_AUTORIZACION: string;
  FECHA_EMISION: Date;
  TOTAL: number;
}

export type NotaVentaInsert = {
  ID_VENTA: number;
  NUMERO_NOTA_VENTA: string;
  NUM_AUTORIZACION: string;
  FECHA_EMISION: Date;
  TOTAL: number;
};

export interface UsuarioSelect extends RowDataPacket {
  USER_ID: number;
  ID_EMPLEADO: number | null;
  NOMBRE: string;
  NOMBRE_USUARIO: string;
  EMAIL: string;
  TELEFONO: string | null;
  PASSWORD_HASH: string;
  ESTADO: string;
  ULTIMO_LOGIN: Date | null;
  FECHA_CREACION: Date;
  FECHA_MODIFICACION: Date;
}

export type UsuarioInsert = {
  ID_EMPLEADO?: number | null;
  NOMBRE: string;
  NOMBRE_USUARIO: string;
  EMAIL: string;
  TELEFONO?: string | null;
  PASSWORD_HASH: string;
  ESTADO?: string;
  ULTIMO_LOGIN?: Date | null;
};

export interface RolSelect extends RowDataPacket {
  ROL_ID: number;
  NOMBRE: string;
  DESCRIPCION: string | null;
}

export type RolInsert = {
  NOMBRE: string;
  DESCRIPCION?: string | null;
};

export interface PermisoSelect extends RowDataPacket {
  PERMISO_ID: string;
  MODULO: string;
  DESCRIPCION: string;
}

export type PermisoInsert = {
  PERMISO_ID: string;
  MODULO: string;
  DESCRIPCION: string;
};

export interface RolPermisoSelect extends RowDataPacket {
  RP_ID: number;
  ROL_ID: number;
  PERMISO_ID: string;
}

export type RolPermisoInsert = {
  ROL_ID: number;
  PERMISO_ID: string;
};

export interface UsuarioRolSelect extends RowDataPacket {
  ID_UR: number;
  USER_ID: number;
  ROL_ID: number;
  FECHA_CREACION: Date;
}

export type UsuarioRolInsert = {
  USER_ID: number;
  ROL_ID: number;
  FECHA_CREACION?: Date;
};

export interface CashRegisterSelect extends RowDataPacket {
  id: string;
  branch_id: string;
  code: string;
  name: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type CashRegisterInsert = {
  id: string;
  branch_id: string;
  code: string;
  name: string;
  active?: boolean;
};

export interface CashSessionSelect extends RowDataPacket {
  id: string;
  cash_register_id: string;
  user_id: number | null;
  user_name: string | null;
  opened_at: Date;
  opening_amount: number;
  closed_at: Date | null;
  expected_amount: number | null;
  declared_amount: number | null;
  difference: number | null;
  status: "abierta" | "cerrada";
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export type CashSessionInsert = {
  id: string;
  cash_register_id: string;
  user_id?: number | null;
  user_name?: string | null;
  opened_at?: Date;
  opening_amount?: number;
  closed_at?: Date | null;
  expected_amount?: number | null;
  declared_amount?: number | null;
  difference?: number | null;
  status?: "abierta" | "cerrada";
  notes?: string | null;
};

export interface CashMovementSelect extends RowDataPacket {
  id: string;
  cash_session_id: string;
  type: "venta" | "ingreso" | "egreso" | "retiro" | "devolucion" | "apertura";
  amount: number;
  concept: string;
  reference: string | null;
  user_id: number | null;
  created_at: Date;
}

export type CashMovementInsert = {
  id: string;
  cash_session_id: string;
  type: "venta" | "ingreso" | "egreso" | "retiro" | "devolucion" | "apertura";
  amount: number;
  concept: string;
  reference?: string | null;
  user_id?: number | null;
};

export interface DocumentNumberSelect extends RowDataPacket {
  id: number;
  doc_type: string;
  series: string;
  current_number: number;
}

export type DocumentNumberInsert = {
  doc_type: string;
  series: string;
  current_number?: number;
};
