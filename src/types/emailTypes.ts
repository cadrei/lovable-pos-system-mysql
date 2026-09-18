import type { ReactNode } from "react";
import type { ReactElement } from "react";

/**
 * Tipos de notificación soportados por el sistema.
 * Se irán agregando a medida que se implementen los eventos.
 */
export type NotificationType = "LOGIN" | "VENTA" | "STOCK_BAJO" | "REPORTE_DIARIO" | "GENERIC";

/**
 * Paleta de colores para emails.
 * Convertida desde oklch() del CSS global a HEX por compatibilidad
 * con clientes de correo (Gmail, Outlook, etc.).
 */
export const EMAIL_COLORS = {
  background: "#FAFAF7",
  foreground: "#1F2E2C",
  card: "#FFFFFF",
  primary: "#2E7D7B",
  primaryForeground: "#F2FAFA",
  secondary: "#E6F4F3",
  muted: "#EDF3F1",
  mutedForeground: "#6B8683",
  accent: "#E8A33D",
  destructive: "#C1392E",
  success: "#3F9E6E",
  warning: "#E0B44A",
  border: "#DCE5E3",
} as const;

/**
 * Prefijo común del asunto de todos los correos.
 */
export const EMAIL_SUBJECT_PREFIX = "INFO";

/**
 * Mapa de asuntos por tipo de notificación.
 * Formato final: "NATURISTA DA VIDA - ACCION | Descripción"
 */
export const EMAIL_SUBJECT_MAP: Record<NotificationType, string> = {
  LOGIN: `${EMAIL_SUBJECT_PREFIX} - INICIO DE SESIÓN | Acceso registrado`,
  VENTA: `${EMAIL_SUBJECT_PREFIX} - VENTA | Nueva venta completada`,
  STOCK_BAJO: `${EMAIL_SUBJECT_PREFIX} - INVENTARIO | Alerta de stock bajo`,
  REPORTE_DIARIO: `${EMAIL_SUBJECT_PREFIX} - REPORTE | Resumen diario de ventas`,
  GENERIC: `${EMAIL_SUBJECT_PREFIX} - NOTIFICACIÓN | Aviso del sistema`,
};

/**
 * Props base que toda plantilla de email debe aceptar.
 */
export interface BaseEmailProps {
  /** Texto de preview que se muestra en la bandeja de entrada */
  preheader?: string;
  /** Contenido principal del email */
  children: ReactNode;
}

/**
 * Props de la plantilla genérica.
 */
export interface GenericEmailProps extends BaseEmailProps {
  /** Título visible dentro del cuerpo del email */
  title: string;
  /** Mensaje opcional adicional */
  message?: string;
}

/**
 * Datos para encolar una notificación (fila en NOTIFICACIONES_COLA).
 */
export interface QueueNotificationPayload {
  type: NotificationType;
  to: string | string[];
  subject?: string;
  /** HTML ya renderizado (resultado de render(<Template />)) */
  html: string;
  /** Metadata opcional para trazabilidad */
  metadata?: Record<string, unknown>;
}

/**
 * Props del email de Login.
 * El destinatario (admin) se resuelve en el dispatcher, no aquí.
 */
export interface LoginEmailProps {
  /** Nombre completo del usuario que inició sesión */
  nombre: string;
  /** Email del usuario que inició sesión */
  email: string;
  /** Nombre de la sucursal de la sesión activa */
  sucursalNombre: string;
  /** ID del empleado (puede ser null si no aplica) */
  nombreEmpleado: string;
  /** Fecha y hora del login — se formatea dentro con date-fns */
  fechaHora: Date;
  /** Dirección IP del request (opcional hasta implementar captura) */
  ip?: string | null;
  /** User-agent / navegador-dispositivo (opcional hasta implementar captura) */
  userAgent?: string | null;
}

/**
 * Línea de detalle de venta para el email.
 */
export interface SaleEmailLinea {
  nombre: string;
  cantidad: number;
  precio: number;
  /** subtotal = precio * cantidad */
  subtotal: number;
}

/**
 * Props del email de Venta completada.
 * El destinatario (admin) se resuelve en el dispatcher.
 */
export interface SaleEmailProps {
  /** Folio / ID de venta (se muestra tal cual) */
  idVenta: number | string;
  /** Fecha y hora de la venta */
  fechaHora: Date;
  /** Nombre de la sucursal (ya mapeado en la sesión) */
  sucursalNombre: string;
  /** Nombre del empleado que registró la venta */
  empleadoNombre: string;
  /** Nombre del cajero que operó */
  cajero: string;
  /** Nombre del cliente */
  clienteNombre: string;
  /** ID de la sesión de caja (opcional) */
  sesionCajaId?: number | null;
  /** Método de pago (EFECTIVO, TARJETA, etc.) */
  metodo: string;
  /** Referencia / número de documento (opcional) */
  referencia?: string | null;
  /** Montos en USD */
  subtotal: number;
  descuento: number;
  valorImpuesto: number;
  total: number;
  /** Detalle de productos */
  lineas: SaleEmailLinea[];
}

/**
 * Producto en estado de stock bajo (0 < stock < mínimo).
 * Los productos con stock 0 NO se listan, solo se cuentan.
 */
export interface StockLowItem {
  idProducto: number | string;
  nombreProducto: string;
  stockActual: number;
  stockMinimo: number;
  categoria: string;
  /** Unidad de medida del producto (no se muestra en el email por ahora) */
  unidadMedida: string;
}

/**
 * Agrupación por sucursal de los productos en alerta.
 */
export interface StockLowSucursalGroup {
  sucursalId: number | string;
  sucursalNombre: string;
  /** Productos con 0 < stock < mínimo */
  productosBajos: StockLowItem[];
  /** Cantidad de productos con stock = 0 (no se listan en detalle) */
  productosSinStock: number;
}

/**
 * Props del email de Stock Bajo.
 * El destinatario (admin) se resuelve en el dispatcher.
 */
export interface StockLowEmailProps {
  fechaHora: Date;
  /** Una entrada por sucursal afectada */
  sucursales: StockLowSucursalGroup[];
}

/**
 * Datos de una sucursal en el reporte diario.
 * Si la sucursal no tuvo ventas, totalVentas = 0 y numeroTransacciones = 0.
 */
export interface DailyReportSucursal {
  sucursalId: number | string;
  sucursalNombre: string;
  totalVentas: number;
  numeroTransacciones: number;
  /** Si no se calcula en backend, la plantilla puede derivarlo */
  ticketPromedio: number;
}

/**
 * Props del email de Reporte Diario.
 * El destinatario (admin) se resuelve en el dispatcher.
 * El rango horario se toma de configuración en el backend, no se pasa al email.
 */
export interface DailyReportEmailProps {
  /** Fecha del reporte (día de las ventas) */
  fechaReporte: Date;
  /** Una entrada por sucursal (incluyendo las que no tuvieron ventas) */
  sucursales: DailyReportSucursal[];
}

export type EmailTemplate<P> = (props: P) => ReactElement;

export interface SendMailOptions<P> {
  /** Destinatario(s). Acepta string o array de strings. */
  to: string | string[];
  /** Asunto del correo. */
  subject: string;
  /** Componente de plantilla React Email. */
  template: EmailTemplate<P>;
  /** Props que se pasan a la plantilla. */
  props: P;
  /** Opcional: reply-to. */
  replyTo?: string;
  /** Opcional: CC. */
  cc?: string | string[];
  /** Opcional: BCC. */
  bcc?: string | string[];
}

export interface SendMailResult {
  success: boolean;
  /** ID de Resend cuando el envío es exitoso. */
  id?: string;
  /** Mensaje de error cuando falla. */
  error?: string;
  /** Código de error de Resend, si aplica. */
  errorCode?: string;
}
